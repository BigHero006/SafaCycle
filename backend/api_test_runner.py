#!/usr/bin/env python3
"""
SafaCycle API Test Runner
Simple script to test API endpoints automatically
"""

import requests
import json
import sys
import time
from datetime import datetime

class SafaCycleAPITester:
    def __init__(self, base_url="http://127.0.0.1:8000/api/v1"):
        self.base_url = base_url
        self.auth_token = None
        self.user_id = None
        self.test_results = []
        
    def log_test(self, test_name, success, message="", response_time=0):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            'test': test_name,
            'status': status,
            'message': message,
            'response_time': f"{response_time:.3f}s",
            'timestamp': datetime.now().isoformat()
        }
        self.test_results.append(result)
        print(f"{status} {test_name} ({response_time:.3f}s) - {message}")
        
    def test_registration(self):
        """Test user registration"""
        timestamp = int(time.time())
        test_data = {
            "username": f"testuser_{timestamp}",
            "email": f"test_{timestamp}@safacycle.com",
            "password": "SafaCycle@123",
            "password_confirm": "SafaCycle@123",
            "phone_number": "+919876543210"
        }
        
        try:
            start_time = time.time()
            response = requests.post(
                f"{self.base_url}/auth/register/",
                json=test_data,
                headers={"Content-Type": "application/json"}
            )
            response_time = time.time() - start_time
            
            if response.status_code == 201:
                data = response.json()
                self.auth_token = data.get('token')
                self.user_id = data.get('user', {}).get('id')
                self.log_test("User Registration", True, "User registered successfully", response_time)
                return True
            else:
                self.log_test("User Registration", False, f"Status: {response.status_code}", response_time)
                return False
                
        except Exception as e:
            self.log_test("User Registration", False, f"Error: {str(e)}")
            return False
    
    def test_login(self):
        """Test user login (using existing user if registration failed)"""
        test_data = {
            "username": "admin",  # Fallback user
            "password": "admin123"
        }
        
        try:
            start_time = time.time()
            response = requests.post(
                f"{self.base_url}/auth/login/",
                json=test_data,
                headers={"Content-Type": "application/json"}
            )
            response_time = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                if not self.auth_token:  # Use this token if we don't have one
                    self.auth_token = data.get('token')
                    self.user_id = data.get('user', {}).get('id')
                self.log_test("User Login", True, "Login successful", response_time)
                return True
            else:
                self.log_test("User Login", False, f"Status: {response.status_code}", response_time)
                return False
                
        except Exception as e:
            self.log_test("User Login", False, f"Error: {str(e)}")
            return False
    
    def test_protected_endpoint(self, endpoint, test_name, method="GET", data=None):
        """Test a protected endpoint"""
        if not self.auth_token:
            self.log_test(test_name, False, "No auth token available")
            return False
            
        headers = {
            "Authorization": f"Token {self.auth_token}",
            "Content-Type": "application/json"
        }
        
        try:
            start_time = time.time()
            if method == "GET":
                response = requests.get(f"{self.base_url}{endpoint}", headers=headers)
            elif method == "POST":
                response = requests.post(f"{self.base_url}{endpoint}", json=data, headers=headers)
            else:
                response = requests.request(method, f"{self.base_url}{endpoint}", json=data, headers=headers)
                
            response_time = time.time() - start_time
            
            if response.status_code in [200, 201]:
                self.log_test(test_name, True, f"Status: {response.status_code}", response_time)
                return response.json()
            else:
                self.log_test(test_name, False, f"Status: {response.status_code}", response_time)
                return None
                
        except Exception as e:
            self.log_test(test_name, False, f"Error: {str(e)}")
            return None
    
    def test_waste_scan_creation(self):
        """Test waste scan creation"""
        scan_data = {
            "category": 1,
            "item": 1,
            "quantity": 3,
            "estimated_weight_grams": 75,
            "description": "API Test Scan",
            "location": "Test Location",
            "ml_prediction": "plastic_bottle",
            "ml_confidence": 0.95
        }
        
        result = self.test_protected_endpoint(
            "/waste/scans/create/",
            "Create Waste Scan",
            "POST",
            scan_data
        )
        return result is not None
    
    def test_mongodb_integration(self):
        """Test MongoDB integration"""
        result = self.test_protected_endpoint(
            "/waste/mongodb-status/",
            "MongoDB Status Check"
        )
        
        if result and result.get('status') == 'connected':
            self.log_test("MongoDB Connection", True, "MongoDB is connected")
            return True
        else:
            self.log_test("MongoDB Connection", False, "MongoDB connection failed")
            return False
    
    def run_all_tests(self):
        """Run all tests"""
        print("🚀 Starting SafaCycle API Tests")
        print("=" * 50)
        
        # Test sequence
        tests = [
            ("Server Health", lambda: self.test_server_health()),
            ("User Registration", lambda: self.test_registration()),
            ("User Login", lambda: self.test_login()),
            ("Get Categories", lambda: self.test_protected_endpoint("/waste/categories/", "Get Waste Categories")),
            ("Get Items", lambda: self.test_protected_endpoint("/waste/items/", "Get Waste Items")),
            ("Create Scan", lambda: self.test_waste_scan_creation()),
            ("User Statistics", lambda: self.test_protected_endpoint("/waste/stats/", "Get User Statistics")),
            ("Dashboard Data", lambda: self.test_protected_endpoint("/waste/dashboard/", "Get Dashboard Data")),
            ("MongoDB Status", lambda: self.test_mongodb_integration()),
            ("User Profile", lambda: self.test_protected_endpoint("/auth/profile/", "Get User Profile")),
        ]
        
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            try:
                result = test_func()
                if result:
                    passed += 1
            except Exception as e:
                self.log_test(test_name, False, f"Exception: {str(e)}")
        
        # Summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {passed}/{total} tests passed")
        print(f"📈 Success Rate: {(passed/total)*100:.1f}%")
        
        if passed == total:
            print("🎉 All tests passed! API is working correctly.")
        elif passed > total * 0.7:
            print("⚠️  Most tests passed. Check failed tests for issues.")
        else:
            print("❌ Multiple tests failed. API may have issues.")
        
        return passed, total
    
    def test_server_health(self):
        """Test if server is running"""
        try:
            start_time = time.time()
            response = requests.get(f"{self.base_url.replace('/api/v1', '')}/admin/", timeout=5)
            response_time = time.time() - start_time
            
            # Admin page should redirect or show login - indicates server is running
            if response.status_code in [200, 302, 403]:
                self.log_test("Server Health", True, "Server is running", response_time)
                return True
            else:
                self.log_test("Server Health", False, f"Unexpected status: {response.status_code}", response_time)
                return False
                
        except requests.exceptions.ConnectionError:
            self.log_test("Server Health", False, "Server is not running")
            return False
        except Exception as e:
            self.log_test("Server Health", False, f"Error: {str(e)}")
            return False
    
    def generate_report(self):
        """Generate test report"""
        print("\n📋 Detailed Test Report")
        print("=" * 60)
        
        for result in self.test_results:
            print(f"{result['status']} {result['test']}")
            print(f"   Time: {result['response_time']} | {result['message']}")
            print(f"   Timestamp: {result['timestamp']}")
            print()

def main():
    """Main function"""
    if len(sys.argv) > 1:
        base_url = sys.argv[1]
    else:
        base_url = "http://127.0.0.1:8000/api/v1"
    
    print(f"🎯 Testing SafaCycle API at: {base_url}")
    
    tester = SafaCycleAPITester(base_url)
    passed, total = tester.run_all_tests()
    tester.generate_report()
    
    # Exit with appropriate code
    sys.exit(0 if passed == total else 1)

if __name__ == "__main__":
    main()
