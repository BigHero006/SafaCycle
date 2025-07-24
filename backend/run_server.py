#!/usr/bin/env python3
"""
Django server startup script with pre-checks
"""

import os
import sys
import subprocess
import django
from datetime import datetime

def check_django_installation():
    """Check if Django is properly installed"""
    try:
        import django
        print(f"✅ Django {django.get_version()} is installed")
        return True
    except ImportError:
        print("❌ Django is not installed")
        return False

def check_mongodb_connection():
    """Check MongoDB connection"""
    try:
        # Setup Django
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safacycle_backend.settings')
        django.setup()
        
        from safacycle_backend.mongodb_service import mongodb_service
        connected = mongodb_service.is_connected()
        
        if connected:
            print("✅ MongoDB connection successful")
            
            # Get database stats
            stats = mongodb_service.get_db_stats()
            if stats:
                print(f"   Database: {stats['database_name']}")
                print(f"   Collections: {stats['collections']}")
                print(f"   Total documents: {stats['total_documents']}")
            
            return True
        else:
            print("⚠️ MongoDB connection failed - server will still start")
            return False
            
    except Exception as e:
        print(f"⚠️ MongoDB check error: {e} - server will still start")
        return False

def run_django_checks():
    """Run Django system checks"""
    try:
        result = subprocess.run([
            sys.executable, 'manage.py', 'check'
        ], capture_output=True, text=True, cwd=os.getcwd())
        
        if result.returncode == 0:
            print("✅ Django system checks passed")
            return True
        else:
            print("⚠️ Django system checks have warnings:")
            print(result.stdout)
            print(result.stderr)
            return False
    except Exception as e:
        print(f"❌ Error running Django checks: {e}")
        return False

def start_server():
    """Start the Django development server"""
    print("\n🚀 Starting Django Development Server...")
    print("=" * 50)
    print(f"Server URL: http://127.0.0.1:8000")
    print(f"API Base URL: http://127.0.0.1:8000/api/v1/")
    print(f"Admin URL: http://127.0.0.1:8000/admin/")
    print("\nPress Ctrl+C to stop the server")
    print("=" * 50)
    
    try:
        # Start the server
        subprocess.run([
            sys.executable, 'manage.py', 'runserver', '8000'
        ], cwd=os.getcwd())
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped by user")
    except Exception as e:
        print(f"\n❌ Error starting server: {e}")

def main():
    """Main execution function"""
    print("🎯 SafaCycle Backend Server Startup")
    print("=" * 40)
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Directory: {os.getcwd()}")
    print()
    
    # Pre-startup checks
    print("🔍 Running pre-startup checks...")
    
    checks_passed = 0
    total_checks = 3
    
    if check_django_installation():
        checks_passed += 1
    
    if run_django_checks():
        checks_passed += 1
    
    if check_mongodb_connection():
        checks_passed += 1
    
    print(f"\n📊 Checks completed: {checks_passed}/{total_checks}")
    
    if checks_passed >= 2:  # Django + system checks minimum
        print("✅ Minimum requirements met - starting server...")
        start_server()
    else:
        print("❌ Critical checks failed - please fix issues before starting server")
        print("\nTroubleshooting:")
        print("1. Install Django: pip install django")
        print("2. Check MongoDB connection in settings.py")
        print("3. Run: python manage.py migrate")

if __name__ == '__main__':
    main()
