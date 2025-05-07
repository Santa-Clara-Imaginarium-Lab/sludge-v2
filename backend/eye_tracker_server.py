import os
import sys
import time
import json
import logging
import ctypes
import psutil
import argparse
import csv
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
import threading

# Import Google Drive helper if available
try:
    # Add debug information for imports
    import sys
    print(f"Python version: {sys.version}")
    print(f"Python path: {sys.path}")
    
    # Try to import Google Drive dependencies first to isolate issues
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
        from googleapiclient.http import MediaFileUpload
        print("Google API libraries imported successfully")
    except ImportError as e:
        print(f"Failed to import Google API libraries: {e}")
        raise
    
    # Now try to import from our helper
    from drive_helper import upload_file_to_drive, DRIVE_FOLDER_ID
    print(f"Drive helper imported successfully, folder ID: {DRIVE_FOLDER_ID}")
    
    # Check if service account file exists
    import os
    service_account_file = 'sludge-eye-tracker-8dae6ab3607f.json'
    if os.path.exists(service_account_file):
        print(f"Service account file found: {service_account_file}")
    else:
        print(f"Service account file NOT found: {service_account_file}")
        print(f"Current working directory: {os.getcwd()}")
    
    DRIVE_UPLOAD_ENABLED = True
except Exception as e:
    DRIVE_UPLOAD_ENABLED = False
    logging.warning(f"Google Drive upload not available. Error: {e}")

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("beam_eye_tracker")

parser = argparse.ArgumentParser(description='Beam Eye Tracker Server')
parser.add_argument('--sdk-path', type=str, 
                    default=r"C:\Users\khopk\Desktop\vrushabh projects\vrushabh beam eye tracker\beam_eye_tracker_sdk-2.1.0",
                    help='Path to Beam SDK')
parser.add_argument('--port', type=int, default=5000, help='Server port')
parser.add_argument('--host', type=str, default='127.0.0.1', help='Server host')
parser.add_argument('--data-dir', type=str, default='data', help='Directory to save eye tracking data')
parser.add_argument('--upload-to-drive', action='store_true', help='Upload CSV files to Google Drive')
args = parser.parse_args()

# Check if Drive upload is requested but not available
if args.upload_to_drive and not DRIVE_UPLOAD_ENABLED:
    logger.warning("Google Drive upload requested but not available. Files will only be saved locally.")

# ----- SETUP BEAM SDK PATHS -----
sdk_path = args.sdk_path
dll_path = os.path.join(sdk_path, "bin", "win64")

# Add dll path to the beginning of PATH to ensure it's found first
os.environ["PATH"] = dll_path + os.pathsep + os.environ["PATH"]
sys.path.append(os.path.join(sdk_path, "python", "package"))

# ----- CHECK FOR BEAM APPLICATION AND SDK PATHS -----
beam_exe = "BeamEyeTracker.exe"
beam_running = False

# Check if Beam application is running
for proc in psutil.process_iter(['name', 'exe', 'cmdline']):
    if proc.info['name'] == beam_exe:
        beam_running = True
        logger.info(f"✅ Found BeamEyeTracker.exe running at PID: {proc.pid}")
        logger.info(f"  Process path: {proc.info['exe']}")
        logger.info(f"  Command line: {proc.info['cmdline']}")
        break

if not beam_running:
    logger.warning(f"⚠️ Warning: The Beam Eye Tracking application ({beam_exe}) is not running.")
    logger.warning("Eye tracking features will be disabled but the website will continue to function.")
    
# Verify SDK paths
if not os.path.exists(sdk_path):
    logger.warning(f"⚠️ Warning: SDK path not found: {sdk_path}")
    logger.warning("Eye tracking features will be disabled but the website will continue to function.")

if not os.path.exists(dll_path):
    logger.warning(f"⚠️ Warning: DLL path not found: {dll_path}")
    logger.warning("Eye tracking features will be disabled but the website will continue to function.")

# ----- TRY LOADING DLL EXPLICITLY -----
EYE_TRACKING_AVAILABLE = False

try:
    logger.info(f"🔧 Attempting to load DLL from: {os.path.join(dll_path, 'beam_eye_tracker_client.dll')}")
    ctypes.cdll.LoadLibrary(os.path.join(dll_path, "beam_eye_tracker_client.dll"))
    logger.info("✅ DLL loaded successfully!")
    
    # Try to import the SDK
    try:
        logger.info("🔧 Importing Beam SDK...")
        from eyeware.beam_eye_tracker import API, ViewportGeometry, Point
        logger.info("✅ SDK imported successfully!")
        EYE_TRACKING_AVAILABLE = True
    except Exception as e:
        logger.error(f"❌ Error importing SDK: {e}")
        logger.warning("Eye tracking features will be disabled but the website will continue to function.")
        
except Exception as e:
    logger.error(f"❌ Error loading DLL: {e}")
    logger.warning("Eye tracking features will be disabled but the website will continue to function.")

# ----- FLASK APP SETUP -----
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# ----- SESSION MANAGEMENT -----
class SessionManager:
    def __init__(self):
        self.sessions = {}
        self.lock = threading.Lock()
    
    def create_session(self, session_id, metadata=None):
        with self.lock:
            if session_id in self.sessions:
                return False
            
            self.sessions[session_id] = {
                "created_at": time.time(),
                "data": [],
                "metadata": metadata or {},
                "active": False
            }
            return True
    
    def start_session(self, session_id):
        with self.lock:
            if session_id not in self.sessions:
                return False
            
            self.sessions[session_id]["active"] = True
            self.sessions[session_id]["started_at"] = time.time()
            return True
    
    def stop_session(self, session_id):
        with self.lock:
            if session_id not in self.sessions or not self.sessions[session_id]["active"]:
                return False
            
            self.sessions[session_id]["active"] = False
            self.sessions[session_id]["stopped_at"] = time.time()
            return True
    
    def add_data(self, session_id, data):
        with self.lock:
            if session_id not in self.sessions:
                return False
            
            self.sessions[session_id]["data"].append(data)
            return True
    
    def get_session(self, session_id):
        with self.lock:
            return self.sessions.get(session_id)
    
    def get_all_sessions(self):
        with self.lock:
            return {k: v for k, v in self.sessions.items()}

# Create session manager
session_manager = SessionManager()

# ----- GAZE TRACKER CLASS -----
class GazeTracker:
    def __init__(self):
        self.api = None
        self.tracking_thread = None
        self.running = False
        self.current_session_id = None
        self.screen_width = 1920
        self.screen_height = 1080
    
    def start_tracking(self, session_id, screen_width, screen_height, metadata=None):
        # Store session info regardless of tracking availability
        self.screen_width = screen_width
        self.screen_height = screen_height
        self.current_session_id = session_id
        
        # Create session with metadata
        session_manager.create_session(session_id, {
            "screen_width": screen_width,
            "screen_height": screen_height,
            **metadata  # Unpack all metadata including userId and videoData
        })
        
        # If eye tracking is not available, just return success but don't actually track
        if not EYE_TRACKING_AVAILABLE:
            logger.info(f"Eye tracking unavailable but continuing with session {session_id}")
            session_manager.start_session(session_id)
            return True
            
        # If we're already tracking, don't start again
        if self.running:
            return False
        
        # Use real SDK
        try:
            # Define viewport geometry based on provided screen size
            viewport = ViewportGeometry(
                point_00=Point(x=0, y=0),
                point_11=Point(x=screen_width, y=screen_height)
            )

            self.api = API("SludgeEyeTracker", viewport)
            self.running = True
            session_manager.start_session(session_id)
            
            # Start tracking in a separate thread
            self.tracking_thread = threading.Thread(target=self._track)
            self.tracking_thread.daemon = True
            self.tracking_thread.start()
            
            logger.info(f"✅ Eye tracking started for session {session_id} with screen size: {screen_width}x{screen_height}")
            return True
        except Exception as e:
            logger.error(f"❌ Error starting eye tracking: {e}")
            # Still return true so the application continues
            session_manager.start_session(session_id)
            return True
    
    def _track(self):
        """Track using real Beam SDK"""
        while self.running and self.current_session_id:
            try:
                tss = self.api.get_latest_tracking_state_set()
                user = tss.user_state()
                if user and user.timestamp_in_seconds.value > 0:
                    gaze = user.unified_screen_gaze
                    gaze_data = {
                        'session_id': self.current_session_id,
                        'timestamp': time.time(),
                        'x': gaze.point_of_regard.x,
                        'y': gaze.point_of_regard.y,
                        'confidence': gaze.confidence
                    }
                    
                    # Store data in session
                    session_manager.add_data(self.current_session_id, gaze_data)
                    
                    # Emit gaze data via WebSocket
                    socketio.emit('gaze_data', gaze_data)
            except Exception as e:
                logger.error(f"❌ Error during tracking: {e}")
                time.sleep(1)  # Wait before retrying
                continue
                
            time.sleep(0.01)  # 100Hz
    
    def stop_tracking(self):
        session_data = session_manager.get_session(self.current_session_id)
        
        # If tracking was running, stop it
        if self.running:
            self.running = False
            
            if self.tracking_thread:
                self.tracking_thread.join(timeout=5.0)
                self.tracking_thread = None
        
        # Save the tracking data to CSV and optionally upload to Google Drive
        drive_file_id = None
        if session_data and EYE_TRACKING_AVAILABLE:
            # Only save data if we have tracking data and eye tracking was available
            save_result, drive_file_id = save_session_to_csv(self.current_session_id, session_data)
            if save_result:
                if drive_file_id:
                    logger.info(f"💾 Eye tracking data saved to CSV and uploaded to Google Drive for session {self.current_session_id}")
                else:
                    logger.info(f"💾 Eye tracking data saved to CSV for session {self.current_session_id}")
            else:
                logger.warning(f"⚠️ Failed to save eye tracking data for session {self.current_session_id}")
        
        if self.current_session_id:
            logger.info(f"✅ Session stopped: {self.current_session_id}")
        
        return session_data
    
    def get_current_session(self):
        if not self.current_session_id:
            return None
        return session_manager.get_session(self.current_session_id)

# Create a tracker instance
tracker = GazeTracker()

# ----- API ENDPOINTS -----
@app.route('/api/start', methods=['POST'])
def start_tracking():
    data = request.json
    screen_width = data.get('screenWidth', 1920)
    screen_height = data.get('screenHeight', 1080)
    session_id = data.get('sessionId', f"session_{int(time.time())}")
    user_id = data.get('userId', 'anonymous')  # Get userId from request
    video_data = data.get('videoData', {})
    
    # Add userId to metadata for tracking
    metadata = {
        "videoData": video_data,
        "userId": user_id  # Store userId in metadata
    }
    
    success = tracker.start_tracking(session_id, screen_width, screen_height, metadata)
    
    if success:
        return jsonify({
            "status": "success", 
            "message": "Tracking started",
            "sessionId": session_id,
            "userId": user_id
        })
    else:
        return jsonify({"status": "error", "message": "Failed to start tracking"})

@app.route('/api/stop', methods=['POST'])
def stop_tracking():
    try:
        session_data = tracker.stop_tracking()
        
        # Get the CSV filename if data was saved
        csv_filename = None
        drive_file_id = None
        if session_data:
            session_id = tracker.current_session_id
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            csv_filename = f"{session_id}_{timestamp}.csv"
            
            # Check if we have a drive file ID stored
            for thread in threading.enumerate():
                if getattr(thread, "_drive_file_id", None) and getattr(thread, "_session_id", None) == session_id:
                    drive_file_id = thread._drive_file_id
                    break
        
        return jsonify({
            'status': 'success',
            'message': 'Eye tracking stopped',
            'dataPoints': len(session_data.get('data', [])) if session_data else 0,
            'csvFile': csv_filename,
            'driveFileId': drive_file_id,
            'uploadedToDrive': drive_file_id is not None
        })
    except Exception as e:
        logger.error(f"Error stopping eye tracking: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/sessions', methods=['GET'])
def get_sessions():
    sessions = session_manager.get_all_sessions()
    # Convert to a list of session summaries (without the full data)
    session_summaries = []
    
    for session_id, session in sessions.items():
        summary = {
            "session_id": session_id,
            "created_at": session["created_at"],
            "started_at": session.get("started_at"),
            "stopped_at": session.get("stopped_at"),
            "active": session["active"],
            "data_points": len(session["data"]),
            "metadata": session["metadata"]
        }
        session_summaries.append(summary)
    
    return jsonify({"sessions": session_summaries})

@app.route('/api/sessions/<session_id>', methods=['GET'])
def get_session(session_id):
    session = session_manager.get_session(session_id)
    
    if session:
        return jsonify({
            "status": "success",
            "session": session
        })
    else:
        return jsonify({
            "status": "error",
            "message": f"Session {session_id} not found"
        })

@app.route('/api/status', methods=['GET'])
def get_status():
    current_session = tracker.get_current_session()
    data_points = 0
    if current_session:
        data_points = len(current_session["data"])
    
    return jsonify({
        "tracking": tracker.running,
        "current_session_id": tracker.current_session_id,
        "data_points": data_points,
        "using_mock": USE_MOCK_TRACKER,
        "sdk_path": sdk_path,
        "dll_path": dll_path
    })

# ----- SOCKETIO EVENTS -----
@socketio.on('connect')
def handle_connect():
    logger.info(f"Client connected: {request.sid}")

@socketio.on('disconnect')
def handle_disconnect():
    logger.info(f"Client disconnected: {request.sid}")

# ----- DATA DIRECTORY SETUP -----
data_dir = args.data_dir
if not os.path.exists(data_dir):
    os.makedirs(data_dir)
    logger.info(f"📁 Created data directory at: {data_dir}")
else:
    logger.info(f"📁 Using existing data directory at: {data_dir}")

# ----- CSV HELPER FUNCTIONS -----
def save_session_to_csv(session_id, session_data):
    """
    Save eye tracking data from a session to a CSV file and optionally upload to Google Drive
    """
    try:
        # Get userId from metadata if available
        metadata = session_data.get("metadata", {})
        user_id = metadata.get("userId", "anonymous")
        
        # Use only the userId for the filename
        filename = f"{user_id}.csv"
        filepath = os.path.join(data_dir, filename)
        
        # Extract gaze data points
        gaze_data = session_data.get("data", [])
        metadata = session_data.get("metadata", {})
        
        if not gaze_data:
            logger.warning(f"No gaze data to save for session {session_id}")
            return False, None
            
        # Create CSV file with headers
        with open(filepath, 'w', newline='') as csvfile:
            # Write metadata as header comments
            csvfile.write(f"# Session ID: {session_id}\n")
            csvfile.write(f"# Created: {session_data.get('created_at', 'unknown')}\n")
            
            # Write video metadata if available
            video_data = metadata.get("videoData", {})
            if video_data:
                for key, value in video_data.items():
                    csvfile.write(f"# {key}: {value}\n")
            
            # Create CSV writer and write header
            fieldnames = ['timestamp', 'x', 'y', 'confidence']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            
            # Write data rows
            for point in gaze_data:
                writer.writerow({
                    'timestamp': point.get('timestamp', ''),
                    'x': point.get('x', ''),
                    'y': point.get('y', ''),
                    'confidence': point.get('confidence', '')
                })
                
        logger.info(f"✅ Saved eye tracking data to {filepath} ({len(gaze_data)} data points)")
        
        # Upload to Google Drive if enabled
        file_id = None
        if args.upload_to_drive and DRIVE_UPLOAD_ENABLED:
            try:
                logger.info(f"Uploading {filename} to Google Drive...")
                file_id = upload_file_to_drive(filepath, DRIVE_FOLDER_ID)
                if file_id:
                    logger.info(f"✅ File uploaded to Google Drive with ID: {file_id}")
                else:
                    logger.warning("Failed to upload file to Google Drive")
            except Exception as e:
                logger.error(f"Error uploading to Google Drive: {e}")
        
        return True, file_id
    except Exception as e:
        logger.error(f"❌ Error saving CSV: {e}")
        return False, None

# ----- RUN SERVER -----
if __name__ == '__main__':
    logger.info(f"🚀 Starting Beam Eye Tracking Server on {args.host}:{args.port}")
    if not EYE_TRACKING_AVAILABLE:
        logger.info("⚠️ Eye tracking is not available - website will function without collecting gaze data")
    socketio.run(app, host=args.host, port=args.port, debug=True)