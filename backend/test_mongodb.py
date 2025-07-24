#!/usr/bin/env python
"""
Test MongoDB connection
"""
import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safacycle_backend.settings')
django.setup()

from safacycle_backend.mongodb_service import mongodb_service

def test_mongodb_connection():
    """Test MongoDB connection and basic operations"""
    print("Testing MongoDB connection...")
    
    # Test connection
    if mongodb_service.is_connected():
        print("✅ MongoDB connection successful!")
        
        # Get database stats
        stats = mongodb_service.get_db_stats()
        if stats:
            print(f"📊 Database: {stats['database_name']}")
            print(f"📁 Collections: {stats['collections']}")
            print(f"📄 Total documents: {stats['total_documents']}")
            print(f"💾 Database size: {stats['db_size_mb']} MB")
            print(f"🗄️ Storage size: {stats['storage_size_mb']} MB")
            
            if stats['collection_names']:
                print("📋 Collections found:")
                for name, count in stats['collection_counts'].items():
                    print(f"   - {name}: {count} documents")
        
        # Test saving sample data
        print("\nTesting data operations...")
        
        # Test scan analytics
        sample_scan = {
            'user_id': 'test_user_123',
            'scan_type': 'waste_identification',
            'confidence': 0.95,
            'detected_items': ['plastic_bottle', 'paper'],
            'timestamp': '2025-07-24T10:30:00Z',
            'location': {'lat': 28.6139, 'lng': 77.2090}
        }
        
        scan_id = mongodb_service.save_scan_analytics(sample_scan)
        if scan_id:
            print(f"✅ Sample scan data saved with ID: {scan_id}")
        
        # Test ML prediction
        sample_prediction = {
            'model_version': '1.0',
            'input_data': 'base64_image_data_here',
            'prediction': 'recyclable_plastic',
            'confidence': 0.92,
            'processing_time': 1.2,
            'timestamp': '2025-07-24T10:30:00Z'
        }
        
        ml_id = mongodb_service.save_ml_prediction(sample_prediction)
        if ml_id:
            print(f"✅ Sample ML prediction saved with ID: {ml_id}")
        
        # Get updated stats
        print("\nUpdated database stats:")
        updated_stats = mongodb_service.get_db_stats()
        if updated_stats:
            print(f"📄 Total documents: {updated_stats['total_documents']}")
            for name, count in updated_stats['collection_counts'].items():
                print(f"   - {name}: {count} documents")
    
    else:
        print("❌ MongoDB connection failed!")
        print("Please check:")
        print("1. Internet connectivity")
        print("2. MongoDB Atlas cluster is running")
        print("3. Connection string is correct")
        print("4. IP address is whitelisted in MongoDB Atlas")

if __name__ == "__main__":
    test_mongodb_connection()
