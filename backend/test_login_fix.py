#!/usr/bin/env python3
"""
Quick test to verify login works with both username and email
"""

import requests
import json

def test_login_fix():
    """Test that login now works with username"""
    
    base_url = "http://127.0.0.1:8000"
    
    print("🧪 Testing Fixed Login Endpoint")
    print("=" * 35)
    
    # First, let's register a test user
    print("📝 Step 1: Registering test user...")
    
    test_user = {
        "username": "test_login_fix",
        "email": "test.login@safacycle.com",
        "password": "SafaCycle@123",
        "password_confirm": "SafaCycle@123",
        "phone_number": "+919876543299"
    }
    
    try:
        reg_response = requests.post(
            f"{base_url}/api/v1/auth/register/",
            json=test_user,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if reg_response.status_code == 201:
            print("✅ Registration successful!")
            reg_data = reg_response.json()
            print(f"👤 User: {reg_data['user']['username']}")
            print(f"📧 Email: {reg_data['user']['email']}")
        else:
            print(f"❌ Registration failed: {reg_response.status_code}")
            print(f"Error: {reg_response.text}")
            return
            
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return
    
    # Test login with username
    print("\n🔑 Step 2: Testing login with USERNAME...")
    
    login_username = {
        "username": "test_login_fix",
        "password": "SafaCycle@123"
    }
    
    try:
        login_response = requests.post(
            f"{base_url}/api/v1/auth/login/",
            json=login_username,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if login_response.status_code == 200:
            print("✅ Username login successful!")
            login_data = login_response.json()
            print(f"🔑 Token: {login_data['token'][:20]}...")
            print(f"📊 MongoDB Saved: {login_data.get('mongodb_saved', False)}")
            if login_data.get('mongodb_id'):
                print(f"🗃️ MongoDB ID: {login_data['mongodb_id']}")
        else:
            print(f"❌ Username login failed: {login_response.status_code}")
            print(f"Error: {login_response.text}")
            
    except Exception as e:
        print(f"❌ Username login error: {e}")
    
    # Test login with email
    print("\n📧 Step 3: Testing login with EMAIL...")
    
    login_email = {
        "email": "test.login@safacycle.com",
        "password": "SafaCycle@123"
    }
    
    try:
        email_response = requests.post(
            f"{base_url}/api/v1/auth/login/",
            json=login_email,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if email_response.status_code == 200:
            print("✅ Email login successful!")
            email_data = email_response.json()
            print(f"🔑 Token: {email_data['token'][:20]}...")
            print(f"📊 MongoDB Saved: {email_data.get('mongodb_saved', False)}")
        else:
            print(f"❌ Email login failed: {email_response.status_code}")
            print(f"Error: {email_response.text}")
            
    except Exception as e:
        print(f"❌ Email login error: {e}")
    
    print("\n🎉 Test completed!")
    print("Now try your original test case:")
    print('POST http://127.0.0.1:8000/api/v1/auth/login/')
    print('{"username": "john_doe_2025", "password": "SafaCycle@123"}')

if __name__ == "__main__":
    print("🚀 Login Fix Test for SafaCycle")
    print("Make sure Django server is running on 127.0.0.1:8000")
    print("Press Enter to continue...")
    input()
    
    test_login_fix()
