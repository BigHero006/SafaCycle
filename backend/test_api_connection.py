#!/usr/bin/env python3
"""
SafaCycle API Test Script
This script will test your API endpoints and MongoDB connection through Django.
"""

import requests
import json
import time
import subprocess
import os
from threading import Thread

def start_django_server():
    """Start Django development server in background"""
    try:
        os.chdir(r'c:\Users\dell\SafaCycle\backend')
        subprocess.run(['python', 'manage.py', 'runserver', '127.0.0.1:8000', '--noreload'], 
                      timeout=2)
    except subprocess.TimeoutExpired:
        pass  # Server started in background
    except Exception as e:
        print(f"Error starting server: {e}")

def test_mongodb_status():
    """Test MongoDB status endpoint"""
    print("🔧 Testing MongoDB Status Endpoint...")
    
    try:
        url = "http://127.0.0.1:8000/api/v1/waste/mongodb-status/"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ MongoDB Status API working!")
            print(f"📊 Response: {json.dumps(data, indent=2)}")
            return True
        else:
            print(f"❌ Status endpoint failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to Django server at 127.0.0.1:8000")
        print("💡 Make sure Django server is running: python manage.py runserver")
        return False
    except Exception as e:
        print(f"❌ Error testing status endpoint: {e}")
        return False

def test_user_registration():
    """Test user registration endpoint"""
    print("\n🔧 Testing User Registration...")
    
    try:
        url = "http://127.0.0.1:8000/api/v1/auth/register/"
        
        test_user = {
            "username": "test_user_diagnostic",
            "email": "test@safacycle.com",
            "password": "SafaCycle@123",
            "password_confirm": "SafaCycle@123",
            "phone_number": "+919999999999"
        }
        
        headers = {'Content-Type': 'application/json'}
        response = requests.post(url, json=test_user, headers=headers, timeout=10)
        
        if response.status_code in [200, 201]:
            print("✅ User registration working!")
            data = response.json()
            print(f"📊 User created: {data.get('username', 'Unknown')}")
            return data.get('token')
        else:
            print(f"❌ Registration failed: {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error testing registration: {e}")
        return None

def test_mongodb_save(token):
    """Test saving user to MongoDB"""
    if not token:
        print("❌ No token available for MongoDB test")
        return False
        
    print("\n🔧 Testing MongoDB User Save...")
    
    try:
        url = "http://127.0.0.1:8000/api/v1/waste/users/save-to-mongodb/"
        headers = {
            'Authorization': f'Token {token}',
            'Content-Type': 'application/json'
        }
        
        response = requests.post(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ MongoDB save working!")
            print(f"📊 MongoDB ID: {data.get('mongodb_id', 'Unknown')}")
            return True
        else:
            print(f"❌ MongoDB save failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing MongoDB save: {e}")
        return False

def main():
    """Run API tests"""
    print("🚀 SafaCycle API Connection Test")
    print("=" * 40)
    
    print("💡 Make sure to run this in a separate terminal:")
    print("   python manage.py runserver 127.0.0.1:8000")
    print("   Then press Enter to continue...")
    input()
    
    # Test 1: MongoDB Status
    status_success = test_mongodb_status()
    
    # Test 2: User Registration
    token = test_user_registration()
    
    # Test 3: MongoDB Save
    mongodb_success = test_mongodb_save(token)
    
    # Summary
    print("\n" + "=" * 40)
    print("📊 API TEST SUMMARY:")
    print(f"MongoDB Status: {'✅ PASS' if status_success else '❌ FAIL'}")
    print(f"User Registration: {'✅ PASS' if token else '❌ FAIL'}")
    print(f"MongoDB Save: {'✅ PASS' if mongodb_success else '❌ FAIL'}")
    
    if status_success and token and mongodb_success:
        print("\n🎉 All API tests passed! Your MongoDB connection is working through Django!")
        print("💡 You can now use the test cases in MONGODB_POPULATE_TESTS.md")
    else:
        print("\n🔍 Some tests failed. Common solutions:")
        print("1. Make sure Django server is running: python manage.py runserver")
        print("2. Check if all required packages are installed")
        print("3. Verify Django settings are correct")
        print("4. Check Django logs for error messages")

if __name__ == "__main__":
    main()
