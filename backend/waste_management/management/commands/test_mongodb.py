"""
Django management command to test MongoDB connection
"""
from django.core.management.base import BaseCommand
from safacycle_backend.mongodb_service import mongodb_service

class Command(BaseCommand):
    help = 'Test MongoDB connection and display database statistics'

    def handle(self, *args, **options):
        """Handle the command execution"""
        self.stdout.write(self.style.SUCCESS("🔗 Testing MongoDB connection..."))
        
        # Test connection
        if mongodb_service.is_connected():
            self.stdout.write(self.style.SUCCESS("✅ MongoDB connection successful!"))
            
            # Get database stats
            stats = mongodb_service.get_db_stats()
            if stats:
                self.stdout.write(f"📊 Database: {stats['database_name']}")
                self.stdout.write(f"📁 Collections: {stats['collections']}")
                self.stdout.write(f"📄 Total documents: {stats['total_documents']}")
                self.stdout.write(f"💾 Database size: {stats['db_size_mb']} MB")
                self.stdout.write(f"🗄️ Storage size: {stats['storage_size_mb']} MB")
                
                if stats['collection_names']:
                    self.stdout.write("📋 Collections found:")
                    for name, count in stats['collection_counts'].items():
                        self.stdout.write(f"   - {name}: {count} documents")
                else:
                    self.stdout.write("📋 No collections found (new database)")
            
            # Test saving sample data
            self.stdout.write("\n🧪 Testing data operations...")
            
            # Test scan analytics
            sample_scan = {
                'user_id': 'test_user_' + str(hash('test')),
                'scan_type': 'waste_identification',
                'confidence': 0.95,
                'detected_items': ['plastic_bottle', 'paper'],
                'timestamp': '2025-07-24T10:30:00Z',
                'location': {'lat': 28.6139, 'lng': 77.2090}
            }
            
            scan_id = mongodb_service.save_scan_analytics(sample_scan)
            if scan_id:
                self.stdout.write(self.style.SUCCESS(f"✅ Sample scan data saved with ID: {scan_id}"))
            
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
                self.stdout.write(self.style.SUCCESS(f"✅ Sample ML prediction saved with ID: {ml_id}"))
            
            # Get updated stats
            self.stdout.write("\n📊 Updated database stats:")
            updated_stats = mongodb_service.get_db_stats()
            if updated_stats:
                self.stdout.write(f"📄 Total documents: {updated_stats['total_documents']}")
                for name, count in updated_stats['collection_counts'].items():
                    self.stdout.write(f"   - {name}: {count} documents")
            
            self.stdout.write(self.style.SUCCESS("\n🎉 MongoDB integration test completed successfully!"))
        
        else:
            self.stdout.write(self.style.ERROR("❌ MongoDB connection failed!"))
            self.stdout.write("Please check:")
            self.stdout.write("1. Internet connectivity")
            self.stdout.write("2. MongoDB Atlas cluster is running")
            self.stdout.write("3. Connection string is correct")
            self.stdout.write("4. IP address is whitelisted in MongoDB Atlas")
