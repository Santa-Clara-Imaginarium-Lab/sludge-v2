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
parser.add_argument('--mock', action='store_true', help='Use mock tracker for development')
parser.add_argument('--data-dir', type=str, default='data', help='Directory to save eye tracking data')
args = parser.parse_args()

# ----- SETUP BEAM SDK PATHS -----
sdk_path = args.sdk_path
dll_path = os.path.join(sdk_path, "bin", "win64")

# Add dll path to the beginning of PATH to ensure it's found first
os.environ["PATH"] = dll_path + os.pathsep + os.environ["PATH"]
sys.path.append(os.path.join(sdk_path, "python", "package"))

# ----- CHECK FOR BEAM APPLICATION AND SDK PATHS -----
beam_exe = "BeamEyeTracker.exe"
beam_running = False

# Check if Beam application is running (skip if using mock)
if not args.mock:
    for proc in psutil.process_iter(['name', 'exe', 'cmdline']):
        if proc.info['name'] == beam_exe:
            beam_running = True
            logger.info(f"✅ Found BeamEyeTracker.exe running at PID: {proc.pid}")
            logger.info(f"  Process path: {proc.info['exe']}")
            logger.info(f"  Command line: {proc.info['cmdline']}")
            break

    if not beam_running:
        logger.error(f"❌ Error: The Beam Eye Tracking application ({beam_exe}) is not running.")
        logger.error("Please start the Beam Eye Tracking application first before running this server.")
        logger.error("You can find the Beam application in your Start menu or in the Beam installation folder.")
        logger.error("Alternatively, run with --mock flag for development without the Beam application.")
        sys.exit(1)

    # Verify SDK paths
    if not os.path.exists(sdk_path):
        logger.error(f"❌ Error: SDK path not found: {sdk_path}")
        logger.error("Please verify the SDK path using the --sdk-path argument.")
        sys.exit(1)

    if not os.path.exists(dll_path):
        logger.error(f"❌ Error: DLL path not found: {dll_path}")
        logger.error("Please verify the SDK path is correct.")
        sys.exit(1)

# ----- TRY LOADING DLL EXPLICITLY (Skip if using mock) -----
USE_MOCK_TRACKER = args.mock
if not USE_MOCK_TRACKER:
    try:
        logger.info(f"🔧 Attempting to load DLL from: {os.path.join(dll_path, 'beam_eye_tracker_client.dll')}")
        ctypes.cdll.LoadLibrary(os.path.join(dll_path, "beam_eye_tracker_client.dll"))
        logger.info("✅ DLL loaded successfully!")
    except Exception as e:
        logger.error(f"❌ Error loading DLL: {e}")
        logger.error(f"Current PATH: {os.environ['PATH']}")
        logger.error(f"Current Python path: {sys.path}")
        logger.error("⚠️ Falling back to mock eye tracker")
        USE_MOCK_TRACKER = True

# ----- IMPORT SDK OR MOCK -----
try:
    if USE_MOCK_TRACKER:
        logger.info("Using mock eye tracker for development")
        from mock_eye_tracker import MockEyeTracker
    else:
        logger.info("🔧 Importing Beam SDK...")
        from eyeware.beam_eye_tracker import API, ViewportGeometry, Point
        logger.info("✅ SDK imported successfully!")
except Exception as e:
    logger.error(f"❌ Error: {e}")
    
    if not USE_MOCK_TRACKER:
        logger.error("Falling back to mock eye tracker")
        USE_MOCK_TRACKER = True
        try:
            from mock_eye_tracker import MockEyeTracker
        except ImportError:
            logger.error("❌ Error: mock_eye_tracker.py not found. Creating it now...")
            # Create mock_eye_tracker.py if it doesn't exist
            with open("mock_eye_tracker.py", "w") as f:
                f.write("""import time
import random
import threading

class MockEyeTracker:
    def __init__(self):
        self.running = False
        self.data = []
        self.thread = None
        self.screen_width = 1920
        self.screen_height = 1080
    
    def start_tracking(self, screen_width, screen_height):
        self.screen_width = screen_width
        self.screen_height = screen_height
        self.running = True
        self.data = []
        
        # Start generating mock data
        self.thread = threading.Thread(target=self._generate_data)
        self.thread.daemon = True
        self.thread.start()
        
        print(f"Mock eye tracker started with screen size: {screen_width}x{screen_height}")
        return True
    
    def _generate_data(self):
        # Generate mock gaze data
        center_x = self.screen_width / 2
        center_y = self.screen_height / 2
        
        while self.running:
            # Generate random gaze data around screen center with occasional jumps
            if random.random() < 0.05:  # 5% chance of jumping to a new area
                x = random.uniform(0, self.screen_width)
                y = random.uniform(0, self.screen_height)
            else:
                # Stay around recent position with noise
                last_x = center_x if not self.data else self.data[-1]['x']
                last_y = center_y if not self.data else self.data[-1]['y']
                
                x = max(0, min(self.screen_width, last_x + random.normalvariate(0, 20)))
                y = max(0, min(self.screen_height, last_y + random.normalvariate(0, 20)))
            
            # Add some randomness to confidence
            confidence = random.uniform(0.7, 1.0)
            
            gaze_data = {
                'timestamp': time.time(),
                'x': x,
                'y': y,
                'confidence': confidence
            }
            
            self.data.append(gaze_data)
            time.sleep(0.033)  # ~30 Hz data rate
    
    def stop_tracking(self):
        if not self.running:
            return False
            
        self.running = False
        if self.thread:
            self.thread.join(timeout=1.0)
        
        print("Mock eye tracker stopped")
        return self.data
    
    def get_data(self):
        return self.data
""")
                from mock_eye_tracker import MockEyeTracker

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
        
        # Create mock tracker if using fallback
        if USE_MOCK_TRACKER:
            self.mock_tracker = MockEyeTracker()
    
    def start_tracking(self, session_id, screen_width, screen_height, video_data=None):
        if self.running:
            return False
        
        # Store screen dimensions
        self.screen_width = screen_width
        self.screen_height = screen_height
        self.current_session_id = session_id
        
        # Create session with metadata
        session_manager.create_session(session_id, {
            "screen_width": screen_width,
            "screen_height": screen_height,
            "video_data": video_data
        })
        
        # Use mock tracker if SDK failed to load
        if USE_MOCK_TRACKER:
            success = self.mock_tracker.start_tracking(screen_width, screen_height)
            if success:
                self.running = True
                session_manager.start_session(session_id)
                
                # Start data forwarding thread
                self.tracking_thread = threading.Thread(target=self._forward_mock_data)
                self.tracking_thread.daemon = True
                self.tracking_thread.start()
            return success
        
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
            return False
    
    def _forward_mock_data(self):
        """Forward mock eye tracker data to WebSocket"""
        last_data_length = 0
        while self.running and self.current_session_id:
            if USE_MOCK_TRACKER and self.mock_tracker.running:
                # Get latest data
                current_data = self.mock_tracker.get_data()
                if len(current_data) > last_data_length:
                    # Forward new data points to WebSocket
                    for i in range(last_data_length, len(current_data)):
                        gaze_data = current_data[i]
                        # Add session_id to the data
                        gaze_data['session_id'] = self.current_session_id
                        
                        # Store data in session
                        session_manager.add_data(self.current_session_id, gaze_data)
                        
                        # Emit via socketio
                        socketio.emit('gaze_data', gaze_data)
                    last_data_length = len(current_data)
            time.sleep(0.01)  # Check at 100Hz
    
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
        if not self.running:
            return False
            
        self.running = False
        session_data = session_manager.get_session(self.current_session_id)
        
        if self.tracking_thread:
            self.tracking_thread.join(timeout=5.0)
            self.tracking_thread = None
        
        if USE_MOCK_TRACKER and hasattr(self, 'mock_tracker'):
            self.mock_tracker.stop_tracking()
        
        # Save the tracking data to CSV
        if session_data:
            save_result = save_session_to_csv(self.current_session_id, session_data)
            if save_result:
                logger.info(f"💾 Eye tracking data saved to CSV for session {self.current_session_id}")
            else:
                logger.warning(f"⚠️ Failed to save eye tracking data for session {self.current_session_id}")
        
        logger.info(f"✅ Eye tracking stopped for session {self.current_session_id}")
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
    video_data = data.get('videoData', {})
    
    success = tracker.start_tracking(session_id, screen_width, screen_height, video_data)
    
    if success:
        return jsonify({
            "status": "success", 
            "message": "Tracking started",
            "sessionId": session_id
        })
    else:
        return jsonify({"status": "error", "message": "Failed to start tracking"})

@app.route('/api/stop', methods=['POST'])
def stop_tracking():
    try:
        session_data = tracker.stop_tracking()
        
        # Get the CSV filename if data was saved
        csv_filename = None
        if session_data:
            session_id = tracker.get_current_session()
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            csv_filename = f"{session_id}_{timestamp}.csv"
        
        return jsonify({
            'status': 'success',
            'message': 'Eye tracking stopped',
            'dataPoints': len(session_data.get('data', [])) if session_data else 0,
            'csvFile': csv_filename
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
    Save eye tracking data from a session to a CSV file
    """
    try:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{session_id}_{timestamp}.csv"
        filepath = os.path.join(data_dir, filename)
        
        # Extract gaze data points
        gaze_data = session_data.get("data", [])
        metadata = session_data.get("metadata", {})
        
        if not gaze_data:
            logger.warning(f"No gaze data to save for session {session_id}")
            return False
            
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
        return True
    except Exception as e:
        logger.error(f"❌ Error saving CSV: {e}")
        return False

# ----- RUN SERVER -----
if __name__ == '__main__':
    logger.info(f"🚀 Starting Beam Eye Tracking Server on {args.host}:{args.port}")
    if USE_MOCK_TRACKER:
        logger.info("⚠️ Using MOCK eye tracker for development")
    socketio.run(app, host=args.host, port=args.port, debug=True)