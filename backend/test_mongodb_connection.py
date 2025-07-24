#!/usr/bin/env python3
"""
MongoDB Connection Test Script for SafaCycle Backend
This script will help diagnose MongoDB connection issues step by step.
"""

import os
import sys
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError, ConfigurationError

def test_basic_connection():
    """Test basic MongoDB connection"""
    print("🔧 Testing Basic MongoDB Connection...")
    
    connection_string = "mongodb+srv://iims:sajit69@sajmangodb.mow3j.mongodb.net/"
    
    try:
        # Test with minimal settings first
        client = MongoClient(connection_string, serverSelectionTimeoutMS=5000)
        
        # Test ping
        client.admin.command('ping')
        print("✅ Basic connection successful!")
        
        # List databases
        dbs = client.list_database_names()
        print(f"📋 Available databases: {dbs}")
        
        # Test specific database
        db = client['safacycle_db']
        collections = db.list_collection_names()
        print(f"📁 Collections in safacycle_db: {collections}")
        
        client.close()
        return True
        
    except ConnectionFailure as e:
        print(f"❌ Connection failed: {e}")
        return False
    except ServerSelectionTimeoutError as e:
        print(f"❌ Server selection timeout: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def test_django_integration():
    """Test Django integration with MongoDB"""
    print("\n🔧 Testing Django Integration...")
    
    try:
        # Set up Django
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safacycle_backend.settings')
        
        import django
        django.setup()
        print("✅ Django setup successful")
        
        from django.conf import settings
        print("✅ Django settings loaded")
        
        # Check MongoDB settings
        mongodb_settings = getattr(settings, 'MONGODB_SETTINGS', None)
        if mongodb_settings:
            print(f"✅ MongoDB settings found: {mongodb_settings}")
        else:
            print("❌ MongoDB settings not found in Django settings")
            return False
            
        # Test MongoDB service
        from safacycle_backend.mongodb_service import MongoDBService
        print("✅ MongoDB service imported")
        
        # Create service instance
        service = MongoDBService()
        print("✅ MongoDB service instance created")
        
        # Test database access
        db = service.get_database()
        if db:
            print(f"✅ Database accessible: {db.name}")
            collections = db.list_collection_names()
            print(f"📁 Collections: {collections}")
            return True
        else:
            print("❌ Database not accessible")
            return False
            
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False
    except Exception as e:
        print(f"❌ Django integration error: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_api_endpoints():
    """Test if Django server can start"""
    print("\n🔧 Testing Django Server...")
    
    try:
        import subprocess
        import time
        
        # Check if manage.py exists
        if not os.path.exists('manage.py'):
            print("❌ manage.py not found. Make sure you're in the correct directory.")
            return False
            
        print("✅ manage.py found")
        
        # Test Django check command
        result = subprocess.run(['python', 'manage.py', 'check'], 
                              capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0:
            print("✅ Django check passed")
            print(f"📋 Output: {result.stdout}")
            return True
        else:
            print("❌ Django check failed")
            print(f"❌ Error: {result.stderr}")
            return False
            
    except subprocess.TimeoutExpired:
        print("❌ Django check timed out")
        return False
    except Exception as e:
        print(f"❌ Error testing Django server: {e}")
        return False

def main():
    """Run all connection tests"""
    print("🚀 SafaCycle MongoDB Connection Diagnostic Tool")
    print("=" * 50)
    
    # Test 1: Basic MongoDB connection
    basic_success = test_basic_connection()
    
    # Test 2: Django integration
    django_success = test_django_integration()
    
    # Test 3: Django server
    server_success = test_api_endpoints()
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 DIAGNOSTIC SUMMARY:")
    print(f"Basic MongoDB Connection: {'✅ PASS' if basic_success else '❌ FAIL'}")
    print(f"Django Integration: {'✅ PASS' if django_success else '❌ FAIL'}")
    print(f"Django Server Check: {'✅ PASS' if server_success else '❌ FAIL'}")
    
    if basic_success and django_success and server_success:
        print("\n🎉 All tests passed! Your MongoDB connection should work.")
        print("💡 Try running: python manage.py runserver")
    else:
        print("\n🔍 Issues found. Check the error messages above.")
        
        # Provide specific troubleshooting
        if not basic_success:
            print("\n🛠️ BASIC CONNECTION TROUBLESHOOTING:")
            print("1. Check your internet connection")
            print("2. Verify MongoDB Atlas cluster is running")
            print("3. Check if IP address is whitelisted in MongoDB Atlas")
            print("4. Verify credentials: iims:sajit69")
            
        if not django_success:
            print("\n🛠️ DJANGO INTEGRATION TROUBLESHOOTING:")
            print("1. Check Django settings.py for MONGODB_SETTINGS")
            print("2. Verify all required packages are installed")
            print("3. Check for import errors in mongodb_service.py")
            
        if not server_success:
            print("\n🛠️ DJANGO SERVER TROUBLESHOOTING:")
            print("1. Run: python manage.py migrate")
            print("2. Check for missing dependencies")
            print("3. Review Django project structure")

if __name__ == "__main__":
    main()
