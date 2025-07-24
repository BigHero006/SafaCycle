#!/usr/bin/env python
"""
Simple server startup script
"""
import os
import subprocess
import sys

def main():
    print("🚀 Starting SafaCycle Django Server")
    print("=" * 40)
    
    # Change to backend directory
    backend_dir = r"c:\Users\dell\SafaCycle\backend"
    os.chdir(backend_dir)
    print(f"📁 Working directory: {os.getcwd()}")
    
    # Start server
    print("🌟 Starting server on http://127.0.0.1:8000")
    print("📋 API Base URL: http://127.0.0.1:8000/api/v1/")
    print("🛑 Press Ctrl+C to stop the server")
    print("=" * 40)
    
    try:
        # Run the Django server
        os.system("python manage.py runserver 8000")
    except KeyboardInterrupt:
        print("\n👋 Server stopped")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
