#!/usr/bin/env python3
"""
Quick test script to verify Django and MongoDB setup
"""

import os
import sys
import django
from datetime import datetime

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safacycle_backend.settings')
django.setup()

def test_imports():
    """Test if all required imports work"""
    try:
        print("🔍 Testing imports...")
        
        from pymongo import MongoClient
        print("✅ pymongo imported successfully")
        
        from django.conf import settings
        print("✅ Django settings imported successfully")
        
        from safacycle_backend.mongodb_service import mongodb_service
        print("✅ MongoDB service imported successfully")
        
        return True
    except Exception as e:
        print(f"❌ Import error: {e}")
        return False

def test_django_setup():
    """Test Django configuration"""
    try:
        print("\n🔍 Testing Django setup...")
        
        from django.conf import settings
        
        # Check MongoDB settings
        mongodb_settings = getattr(settings, 'MONGODB_SETTINGS', None)
        if mongodb_settings:
            print("✅ MongoDB settings found in Django config")
            print(f"   Database: {mongodb_settings.get('database_name')}")
            return True
        else:
            print("❌ MongoDB settings not found")
            return False
            
    except Exception as e:
        print(f"❌ Django setup error: {e}")
        return False

def test_mongodb_connection():
    """Test MongoDB connection"""
    try:
        print("\n🔍 Testing MongoDB connection...")
        
        from safacycle_backend.mongodb_service import mongodb_service
        
        # Test connection
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
                print("⚠️ Connection OK but no stats available")
                return True
        else:
            print("❌ MongoDB connection failed")
            return False
            
    except Exception as e:
        print(f"❌ MongoDB connection error: {e}")
        return False

def create_test_collections():
    """Create test collections"""
    try:
        print("\n🔍 Creating test collections...")
        
        from safacycle_backend.mongodb_service import mongodb_service
        from django.conf import settings
        from pymongo import MongoClient
        
        # Get MongoDB settings
        mongodb_settings = settings.MONGODB_SETTINGS
        connection_string = mongodb_settings['connection_string']
        database_name = mongodb_settings['database_name']
        
        # Create client and database
        client = MongoClient(connection_string, **mongodb_settings['connection_params'])
        db = client[database_name]
        
        # Collections to create
        collections_data = {
            'scan_analytics': {
                'user_id': 'test_user_001',
                'username': 'testuser',
                'category': 'Plastic Bottles',
                'quantity': 2,
                'points_awarded': 10,
                'timestamp': datetime.now().isoformat(),
                'test_data': True
            },
            'ml_predictions': {
                'model_version': '1.0',
                'prediction': 'plastic_bottle',
                'confidence': 0.90,
                'timestamp': datetime.now().isoformat(),
                'test_data': True
            },
            'users': {
                'user_id': 'test_user_001',
                'username': 'testuser',
                'email': 'test@safacycle.com',
                'total_points': 150,
                'level': 2,
                'test_data': True
            },
            'admin': {
                'admin_id': 'test_admin_001',
                'username': 'testadmin',
                'action_type': 'test_action',
                'timestamp': datetime.now().isoformat(),
                'test_data': True
            },
            'drivers': {
                'driver_id': 'test_driver_001',
                'username': 'testdriver',
                'vehicle_number': 'TEST-001',
                'status': 'active',
                'test_data': True
            }
        }
        
        results = {}
        for collection_name, sample_data in collections_data.items():
            try:
                collection = db[collection_name]
                result = collection.insert_one(sample_data)
                count = collection.count_documents({})
                
                results[collection_name] = {
                    'success': True,
                    'inserted_id': str(result.inserted_id),
                    'document_count': count
                }
                
                print(f"✅ {collection_name}: Created with ID {result.inserted_id}, Total docs: {count}")
                
            except Exception as e:
                results[collection_name] = {
                    'success': False,
                    'error': str(e)
                }
                print(f"❌ {collection_name}: Error - {e}")
        
        return results
        
    except Exception as e:
        print(f"❌ Collection creation error: {e}")
        return None

def main():
    """Main execution function"""
    print("🚀 SafaCycle Backend Setup Test")
    print("=" * 50)
    
    # Run tests
    tests_passed = 0
    total_tests = 4
    
    if test_imports():
        tests_passed += 1
    
    if test_django_setup():
        tests_passed += 1
    
    if test_mongodb_connection():
        tests_passed += 1
    
    collection_results = create_test_collections()
    if collection_results:
        tests_passed += 1
        
        print(f"\n📊 Collection Creation Summary:")
        for collection, result in collection_results.items():
            if result['success']:
                print(f"   ✅ {collection}: {result['document_count']} documents")
            else:
                print(f"   ❌ {collection}: {result['error']}")
    
    print(f"\n📋 Test Results: {tests_passed}/{total_tests} tests passed")
    
    if tests_passed == total_tests:
        print("🎉 All tests passed! Your setup is working correctly.")
        print("\nNext steps:")
        print("1. Start Django server: python manage.py runserver")
        print("2. Test API endpoints with Postman")
        print("3. Check MongoDB Atlas dashboard for your collections")
    else:
        print("❌ Some tests failed. Please check the errors above.")
    
    return tests_passed == total_tests

if __name__ == '__main__':
    main()
