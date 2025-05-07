import os
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

# Define the scopes for Google Drive API
SCOPES = ['https://www.googleapis.com/auth/drive.file']

# Folder ID from the shared Google Drive URL
DRIVE_FOLDER_ID = "1n0XF0tT7RbMq7cx5YNKxtyZLOIKkjsOy"

# Path to the service account key file
SERVICE_ACCOUNT_FILE = 'sludge-eye-tracker-8dae6ab3607f.json'

def get_drive_service():
    """Get an authenticated Google Drive service using service account"""
    try:
        # Load service account credentials
        if not os.path.exists(SERVICE_ACCOUNT_FILE):
            print(f"Error: Service account file {SERVICE_ACCOUNT_FILE} not found")
            return None
            
        credentials = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE, scopes=SCOPES)
        
        # Build the Drive service
        service = build('drive', 'v3', credentials=credentials)
        return service
    except Exception as e:
        print(f"Error setting up Drive service: {e}")
        return None

def upload_file_to_drive(file_path, folder_id, mime_type='text/csv'):
    """Upload a file to Google Drive in the specified folder"""
    try:
        service = get_drive_service()
        if not service:
            print("Failed to get Drive service")
            return None
            
        file_name = os.path.basename(file_path)
        
        file_metadata = {
            'name': file_name,
            'parents': [folder_id]
        }
        
        media = MediaFileUpload(file_path, mimetype=mime_type, resumable=True)
        
        file = service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id'
        ).execute()
        
        print(f"File '{file_name}' uploaded to Google Drive with ID: {file.get('id')}")
        return file.get('id')
    except Exception as e:
        print(f"Error uploading file to Drive: {e}")
        return None
