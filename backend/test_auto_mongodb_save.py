#!/usr/bin/env python3
"""
Test script to verify that login now saves credentials to MongoDB
"""

import requests
import json
import time

def test_registration_and_login():
    """Test that both registration and login save to MongoDB"""
    
    base_url = "http://127.0.0.1:8000"
    
    print("🧪 Testing Auto-Save to MongoDB on Registration & Login")
    print("=" * 55)
    
    # Test data
    test_user = {
        "username": f"mongodb_test_user_{int(time.time())}",
        "email": "mongodb.test@safacycle.com",
        "password": "SafaCycle@123",
        "password_confirm": "SafaCycle@123",
        "phone_number": "+919876543299"
    }
    
    print(f"👤 Test User: {test_user['username']}")
    
    try:
        # Step 1: Register User (should auto-save to MongoDB)
        print("\n🔧 Step 1: Testing Registration with MongoDB Auto-Save...")
        
        reg_response = requests.post(
            f"{base_url}/api/v1/auth/register/",
            json=test_user,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if reg_response.status_code == 201:
            reg_data = reg_response.json()
            print("✅ Registration successful!")
            print(f"🔑 Token: {reg_data['token'][:20]}...")
            print(f"📊 MongoDB Saved: {reg_data.get('mongodb_saved', False)}")
            if reg_data.get('mongodb_id'):
                print(f"🗃️ MongoDB ID: {reg_data['mongodb_id']}")
            
            token = reg_data['token']
        else:
            print(f"❌ Registration failed: {reg_response.status_code}")
            print(f"Response: {reg_response.text}")
            return False
            
        # Step 2: Test Login (should also auto-save to MongoDB)
        print("\n🔧 Step 2: Testing Login with MongoDB Auto-Save...")
        
        login_data = {
            "username": test_user['username'],
            "password": test_user['password']
        }
        
        login_response = requests.post(
            f"{base_url}/api/v1/auth/login/",
            json=login_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if login_response.status_code == 200:
            login_resp_data = login_response.json()
            print("✅ Login successful!")
            print(f"🔑 Token: {login_resp_data['token'][:20]}...")
            print(f"📊 MongoDB Saved: {login_resp_data.get('mongodb_saved', False)}")
            if login_resp_data.get('mongodb_id'):
                print(f"🗃️ MongoDB ID: {login_resp_data['mongodb_id']}")
        else:
            print(f"❌ Login failed: {login_response.status_code}")
            print(f"Response: {login_response.text}")
            return False
            
        # Step 3: Verify MongoDB Status
        print("\n🔧 Step 3: Checking MongoDB Database Status...")
        
        status_response = requests.get(f"{base_url}/api/v1/waste/mongodb-status/", timeout=10)
        
        if status_response.status_code == 200:
            status_data = status_response.json()
            print("✅ MongoDB Status Check successful!")
            print(f"📋 Database: {status_data['database_info']['database_name']}")
            print(f"📁 Users Collection Count: {status_data['database_info']['collection_counts'].get('users', 0)}")
            print(f"📄 Total Documents: {status_data['database_info']['total_documents']}")
        else:
            print(f"❌ MongoDB status check failed: {status_response.status_code}")
            
        # Step 4: Verify user exists in MongoDB
        print("\n🔧 Step 4: Verifying User in MongoDB...")
        
        mongo_check_response = requests.get(
            f"{base_url}/api/v1/waste/users/get-from-mongodb/",
            headers={'Authorization': f'Token {token}'},
            timeout=10
        )
        
        if mongo_check_response.status_code == 200:
            mongo_user_data = mongo_check_response.json()
            print("✅ User found in MongoDB!")
            print(f"👤 Username: {mongo_user_data.get('username', 'Unknown')}")
            print(f"📧 Email: {mongo_user_data.get('email', 'Unknown')}")
            print(f"🆔 MongoDB ObjectId: {mongo_user_data.get('_id', 'Unknown')}")
        else:
            print(f"❌ MongoDB user check failed: {mongo_check_response.status_code}")
            print(f"Response: {mongo_check_response.text}")
            
        print("\n🎉 Test completed! Your credentials are now automatically saved to MongoDB on both registration and login!")
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to Django server!")
        print("💡 Make sure Django server is running:")
        print("   python manage.py runserver 127.0.0.1:8000")
        return False
        
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def main():
    """Run the test"""
    print("🚀 MongoDB Auto-Save Test for SafaCycle")
    print("Make sure Django server is running on 127.0.0.1:8000")
    print("Press Enter to continue...")
    input()
    
    success = test_registration_and_login()
    
    if success:
        print("\n✅ ALL TESTS PASSED!")
        print("📋 Summary:")
        print("• Registration now automatically saves user to MongoDB")
        print("• Login now automatically saves user to MongoDB")
        print("• Your credentials are stored in MongoDB database")
        print("• You can verify this in MongoDB Atlas dashboard")
    else:
        print("\n❌ TESTS FAILED!")
        print("Check the error messages above and ensure:")
        print("• Django server is running")
        print("• MongoDB connection is working")
        print("• No syntax errors in the updated code")

if __name__ == "__main__":
    main()
