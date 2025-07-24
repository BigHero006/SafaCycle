"""
MongoDB Database Creation and Connection Test
This script will force database creation and verify the connection
"""
import os
import sys
import django

# Set up Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safacycle_backend.settings')
django.setup()

from safacycle_backend.mongodb_service import mongodb_service
from django.conf import settings
from pymongo import MongoClient
import json
from datetime import datetime

def force_database_creation():
    """Force MongoDB database and collection creation"""
    print("🚀 Force MongoDB Database Creation Test")
    print("=" * 60)
    
    # Get connection settings
    connection_string = settings.MONGODB_SETTINGS['connection_string']
    database_name = settings.MONGODB_SETTINGS['database_name']
    connection_params = settings.MONGODB_SETTINGS['connection_params']
    
    print(f"📋 Connection Details:")
    print(f"   Connection String: {connection_string}")
    print(f"   Database Name: {database_name}")
    print(f"   Username: iims")
    print(f"   Cluster: sajmangodb.mow3j.mongodb.net")
    
    try:
        # Step 1: Direct connection test
        print(f"\n🔗 Step 1: Testing direct connection...")
        client = MongoClient(connection_string, **connection_params)
        
        # Test connection with ping
        client.admin.command('ping')
        print("✅ Direct connection successful!")
        
        # Step 2: Get database (this will create it if it doesn't exist)
        print(f"\n📊 Step 2: Creating/accessing database '{database_name}'...")
        db = client[database_name]
        
        # Step 3: Create collections by inserting data
        print(f"\n📁 Step 3: Creating collections...")
        
        # Create scan_analytics collection
        scan_collection = db['scan_analytics']
        sample_scan = {
            'user_id': 'initial_test_user',
            'username': 'test_user',
            'scan_id': 'initial_scan_001',
            'category': 'Plastic Bottles',
            'category_type': 'recyclable',
            'item': '500ml Water Bottle',
            'quantity': 1,
            'estimated_weight_grams': 25,
            'points_awarded': 5,
            'bonus_points': 0,
            'ml_prediction': 'plastic_bottle',
            'ml_confidence': 0.90,
            'is_verified': False,
            'location': 'Initial Test Location',
            'description': 'Initial database creation test',
            'timestamp': datetime.now().isoformat(),
            'created_at': datetime.now().isoformat(),
            'saved_at': datetime.now().isoformat(),
            'data_type': 'waste_scan',
            'initial_test': True
        }
        
        result1 = scan_collection.insert_one(sample_scan)
        print(f"✅ Created 'scan_analytics' collection with document ID: {result1.inserted_id}")
        
        # Create ml_predictions collection
        ml_collection = db['ml_predictions']
        sample_prediction = {
            'model_version': '1.0',
            'input_data': 'initial_test_image_data',
            'prediction': 'recyclable_plastic',
            'confidence': 0.90,
            'processing_time': 0.8,
            'timestamp': datetime.now().isoformat(),
            'saved_at': datetime.now().isoformat(),
            'data_type': 'ml_prediction',
            'initial_test': True
        }
        
        result2 = ml_collection.insert_one(sample_prediction)
        print(f"✅ Created 'ml_predictions' collection with document ID: {result2.inserted_id}")
        
        # Create users collection
        users_collection = db['users']
        sample_user = {
            'user_id': 'initial_test_user_001',
            'username': 'testuser',
            'email': 'testuser@safacycle.com',
            'phone_number': '+919876543210',
            'total_points': 150,
            'level': 2,
            'registration_date': datetime.now().isoformat(),
            'last_activity': datetime.now().isoformat(),
            'profile': {
                'bio': 'Environmental enthusiast',
                'location': 'Mumbai, India'
            },
            'data_type': 'user_data',
            'initial_test': True
        }
        
        result3 = users_collection.insert_one(sample_user)
        print(f"✅ Created 'users' collection with document ID: {result3.inserted_id}")
        
        # Create admin collection
        admin_collection = db['admin']
        sample_admin = {
            'admin_id': 'initial_admin_001',
            'username': 'admin',
            'action_type': 'database_initialization',
            'action_description': 'Initial database setup and testing',
            'target_user_id': 'initial_test_user_001',
            'metadata': {
                'ip_address': '127.0.0.1',
                'user_agent': 'Database Init Script'
            },
            'timestamp': datetime.now().isoformat(),
            'data_type': 'admin_action',
            'initial_test': True
        }
        
        result4 = admin_collection.insert_one(sample_admin)
        print(f"✅ Created 'admin' collection with document ID: {result4.inserted_id}")
        
        # Create drivers collection
        drivers_collection = db['drivers']
        sample_driver = {
            'driver_id': 'initial_driver_001',
            'username': 'driver001',
            'full_name': 'John Doe Driver',
            'employee_id': 'EMP001',
            'vehicle_number': 'MH-01-AB-1234',
            'vehicle_type': 'garbage_truck',
            'vehicle_capacity_kg': 5000,
            'status': 'active',
            'current_location': {
                'latitude': 19.0760,
                'longitude': 72.8777,
                'area': 'Bandra West',
                'city': 'Mumbai'
            },
            'route_assigned': 'Route_A_001',
            'shift_timing': '06:00-14:00',
            'contact_number': '+919876543210',
            'emergency_contact': '+919876543211',
            'last_location_update': datetime.now().isoformat(),
            'hire_date': datetime.now().isoformat(),
            'data_type': 'driver_data',
            'initial_test': True
        }
        
        result5 = drivers_collection.insert_one(sample_driver)
        print(f"✅ Created 'drivers' collection with document ID: {result5.inserted_id}")
        
        # Step 4: Verify database and collections exist
        print(f"\n🔍 Step 4: Verifying database creation...")
        
        # List all databases
        admin_db = client.admin
        db_list = admin_db.command('listDatabases')
        db_names = [db_info['name'] for db_info in db_list['databases']]
        
        if database_name in db_names:
            print(f"✅ Database '{database_name}' exists in MongoDB!")
        else:
            print(f"❌ Database '{database_name}' not found in database list: {db_names}")
        
        # List collections in our database
        collections = db.list_collection_names()
        print(f"📁 Collections in '{database_name}': {collections}")
        
        # Count documents in each collection
        for collection_name in collections:
            count = db[collection_name].count_documents({})
            print(f"   - {collection_name}: {count} documents")
        
        # Step 5: Test our service
        print(f"\n🧪 Step 5: Testing MongoDB service...")
        service_connected = mongodb_service.is_connected()
        print(f"   Service connection status: {'✅ Connected' if service_connected else '❌ Disconnected'}")
        
        if service_connected:
            stats = mongodb_service.get_db_stats()
            if stats:
                print(f"   Service database info:")
                print(f"     Database: {stats['database_name']}")
                print(f"     Collections: {stats['collections']}")
                print(f"     Total documents: {stats['total_documents']}")
                print(f"     Size: {stats['db_size_mb']} MB")
        
        # Step 6: Test saving through service
        print(f"\n💾 Step 6: Testing service data save...")
        service_test_data = {
            'user_id': 'service_test_user',
            'username': 'service_test',
            'scan_id': 'service_test_001',
            'category': 'Paper',
            'category_type': 'recyclable',
            'quantity': 2,
            'points_awarded': 6,
            'description': 'Service test data',
            'timestamp': datetime.now().isoformat(),
            'service_test': True
        }
        
        service_result = mongodb_service.save_scan_analytics(service_test_data)
        if service_result:
            print(f"✅ Service save successful with ID: {service_result}")
        else:
            print("❌ Service save failed")
        
        # Final verification
        final_count = scan_collection.count_documents({})
        print(f"\n📊 Final verification: scan_analytics has {final_count} documents")
        
        client.close()
        print(f"\n🎉 Database creation test completed successfully!")
        print(f"✅ Database '{database_name}' is now created and accessible")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during database creation: {str(e)}")
        import traceback
        print(f"Full error traceback:\n{traceback.format_exc()}")
        
        # Additional debugging
        print(f"\n🔍 Debugging information:")
        print(f"   Python MongoDB driver version: {MongoClient.__module__}")
        
        try:
            # Test basic connection without database operations
            basic_client = MongoClient(connection_string, serverSelectionTimeoutMS=5000)
            basic_client.admin.command('ping')
            print(f"   ✅ Basic connection works")
            basic_client.close()
        except Exception as basic_error:
            print(f"   ❌ Basic connection failed: {basic_error}")
        
        return False

def cleanup_test_data():
    """Clean up initial test data"""
    print(f"\n🧹 Cleaning up test data...")
    try:
        connection_string = settings.MONGODB_SETTINGS['connection_string']
        database_name = settings.MONGODB_SETTINGS['database_name']
        connection_params = settings.MONGODB_SETTINGS['connection_params']
        
        client = MongoClient(connection_string, **connection_params)
        db = client[database_name]
        
        # Remove initial test documents
        result1 = db['scan_analytics'].delete_many({'initial_test': True})
        result2 = db['ml_predictions'].delete_many({'initial_test': True})
        result3 = db['scan_analytics'].delete_many({'service_test': True})
        
        print(f"   Removed {result1.deleted_count} initial scan test documents")
        print(f"   Removed {result2.deleted_count} initial ML test documents")
        print(f"   Removed {result3.deleted_count} service test documents")
        
        client.close()
        print(f"✅ Cleanup completed")
        
    except Exception as e:
        print(f"❌ Cleanup error: {e}")

if __name__ == "__main__":
    print("This script will create the MongoDB database and collections for SafaCycle")
    print("Make sure your MongoDB Atlas cluster is running and accessible.")
    print()
    
    success = force_database_creation()
    
    if success:
        print(f"\n" + "="*60)
        print(f"🎊 SUCCESS! Your MongoDB database is now set up!")
        print(f"")
        print(f"Next steps:")
        print(f"1. Check your MongoDB Atlas dashboard")
        print(f"2. You should see 'safacycle_db' database")
        print(f"3. It should contain 'scan_analytics' and 'ml_predictions' collections")
        print(f"4. Test your API endpoints with Postman")
        print(f"")
        
        cleanup_choice = input("Do you want to clean up the test data? (y/n): ").lower().strip()
        if cleanup_choice == 'y':
            cleanup_test_data()
        else:
            print("Test data kept for verification")
            
    else:
        print(f"\n" + "="*60)
        print(f"❌ Database creation failed!")
        print(f"")
        print(f"Common issues to check:")
        print(f"1. Internet connection")
        print(f"2. MongoDB Atlas cluster is running")
        print(f"3. IP address is whitelisted (0.0.0.0/0 for testing)")
        print(f"4. Username 'iims' and password 'sajit69' are correct")
        print(f"5. User 'iims' has read/write permissions on the database")
        print(f"")
        print(f"Check MongoDB Atlas dashboard and network settings.")
