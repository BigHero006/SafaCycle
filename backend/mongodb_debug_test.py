"""
MongoDB Debug and Test Utility for SafaCycle
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
import json
from datetime import datetime

def test_mongodb_connection():
    """Test MongoDB connection with detailed debugging"""
    print("🔍 MongoDB Connection Debug Test")
    print("=" * 50)
    
    # 1. Check connection settings
    print("📋 Connection Settings:")
    print(f"   Connection String: {settings.MONGODB_SETTINGS['connection_string']}")
    print(f"   Database Name: {settings.MONGODB_SETTINGS['database_name']}")
    
    # 2. Test basic connection
    print("\n🔗 Testing Connection...")
    try:
        is_connected = mongodb_service.is_connected()
        if is_connected:
            print("✅ MongoDB connection successful!")
        else:
            print("❌ MongoDB connection failed!")
            return False
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return False
    
    # 3. Get database info
    print("\n📊 Database Information:")
    try:
        db = mongodb_service.get_database()
        if db:
            print(f"   Database: {db.name}")
            collections = db.list_collection_names()
            print(f"   Collections: {collections}")
            
            for collection_name in collections:
                count = db[collection_name].count_documents({})
                print(f"   - {collection_name}: {count} documents")
        else:
            print("   ❌ Could not get database instance")
            return False
    except Exception as e:
        print(f"   ❌ Database info error: {e}")
        return False
    
    # 4. Test saving sample data
    print("\n🧪 Testing Data Operations...")
    
    # Test scan analytics
    sample_scan = {
        'user_id': 'test_user_123',
        'username': 'test_user',
        'scan_id': 'test_scan_123',
        'category': 'Plastic Bottles',
        'category_type': 'recyclable',
        'item': '500ml Water Bottle',
        'quantity': 5,
        'estimated_weight_grams': 125,
        'points_awarded': 25,
        'bonus_points': 2,
        'ml_prediction': 'plastic_bottle',
        'ml_confidence': 0.95,
        'is_verified': False,
        'location': 'Test Location',
        'description': 'MongoDB connection test scan',
        'timestamp': datetime.now().isoformat(),
        'created_at': datetime.now().isoformat(),
        'test_data': True  # Mark as test data
    }
    
    try:
        scan_id = mongodb_service.save_scan_analytics(sample_scan)
        if scan_id:
            print(f"✅ Test scan data saved with ID: {scan_id}")
            
            # Verify the data was saved
            db = mongodb_service.get_database()
            collection = db['scan_analytics']
            saved_doc = collection.find_one({'_id': scan_id})
            if saved_doc:
                print("✅ Data verified in MongoDB")
                print(f"   Saved document: {json.dumps({k: v for k, v in saved_doc.items() if k != '_id'}, indent=2)}")
            else:
                print("❌ Could not verify saved data")
        else:
            print("❌ Failed to save test scan data")
            return False
    except Exception as e:
        print(f"❌ Save error: {e}")
        return False
    
    # 5. Test ML prediction save
    sample_prediction = {
        'model_version': '1.0',
        'input_data': 'test_image_data',
        'prediction': 'recyclable_plastic',
        'confidence': 0.92,
        'processing_time': 1.2,
        'timestamp': datetime.now().isoformat(),
        'test_data': True
    }
    
    try:
        ml_id = mongodb_service.save_ml_prediction(sample_prediction)
        if ml_id:
            print(f"✅ Test ML prediction saved with ID: {ml_id}")
        else:
            print("❌ Failed to save test ML prediction")
    except Exception as e:
        print(f"❌ ML prediction save error: {e}")
    
    # 6. Get updated stats
    print("\n📈 Final Database Stats:")
    try:
        stats = mongodb_service.get_db_stats()
        if stats:
            print(f"   Total Collections: {stats['collections']}")
            print(f"   Total Documents: {stats['total_documents']}")
            print(f"   Database Size: {stats['db_size_mb']} MB")
            
            for name, count in stats['collection_counts'].items():
                print(f"   - {name}: {count} documents")
        else:
            print("   ❌ Could not get database stats")
    except Exception as e:
        print(f"   ❌ Stats error: {e}")
    
    print("\n🎉 MongoDB test completed successfully!")
    return True

def cleanup_test_data():
    """Clean up test data from MongoDB"""
    print("\n🧹 Cleaning up test data...")
    try:
        db = mongodb_service.get_database()
        if db:
            # Remove scan analytics test data
            result1 = db['scan_analytics'].delete_many({'test_data': True})
            print(f"   Removed {result1.deleted_count} test scan documents")
            
            # Remove ML prediction test data
            result2 = db['ml_predictions'].delete_many({'test_data': True})
            print(f"   Removed {result2.deleted_count} test ML prediction documents")
            
            print("✅ Test data cleanup completed")
        else:
            print("❌ Could not access database for cleanup")
    except Exception as e:
        print(f"❌ Cleanup error: {e}")

if __name__ == "__main__":
    success = test_mongodb_connection()
    
    # Ask user if they want to clean up test data
    if success:
        response = input("\nDo you want to clean up test data? (y/n): ").lower()
        if response == 'y':
            cleanup_test_data()
        else:
            print("Test data left in database for inspection")
    
    if success:
        print("\n✅ MongoDB is properly configured and working!")
    else:
        print("\n❌ MongoDB setup has issues that need to be resolved")
        print("\nTroubleshooting tips:")
        print("1. Check internet connection")
        print("2. Verify MongoDB Atlas cluster is running")
        print("3. Check IP whitelist in MongoDB Atlas")
        print("4. Verify connection string credentials")
