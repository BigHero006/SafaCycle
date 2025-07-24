"""
Django management command to initialize MongoDB database
"""
from django.core.management.base import BaseCommand
from safacycle_backend.mongodb_service import mongodb_service
from django.conf import settings
from pymongo import MongoClient
from datetime import datetime

class Command(BaseCommand):
    help = 'Initialize MongoDB database and collections for SafaCycle'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force recreation of database and collections',
        )
        parser.add_argument(
            '--cleanup',
            action='store_true',
            help='Clean up test data after creation',
        )

    def handle(self, *args, **options):
        """Handle the command execution"""
        self.stdout.write(self.style.SUCCESS("🚀 Initializing MongoDB database..."))
        
        # Get connection settings
        connection_string = settings.MONGODB_SETTINGS['connection_string']
        database_name = settings.MONGODB_SETTINGS['database_name']
        connection_params = settings.MONGODB_SETTINGS['connection_params']
        
        self.stdout.write(f"📋 Database: {database_name}")
        self.stdout.write(f"📋 Connection: mongodb+srv://iims:***@sajmangodb.mow3j.mongodb.net/")
        
        try:
            # Step 1: Test connection
            self.stdout.write("\n🔗 Testing MongoDB connection...")
            client = MongoClient(connection_string, **connection_params)
            client.admin.command('ping')
            self.stdout.write(self.style.SUCCESS("✅ Connection successful!"))
            
            # Step 2: Get/create database
            self.stdout.write(f"\n📊 Accessing database '{database_name}'...")
            db = client[database_name]
            
            # Step 3: Create collections with initial data
            self.stdout.write("\n📁 Creating collections...")
            
            # Create scan_analytics collection
            scan_collection = db['scan_analytics']
            initial_scan = {
                'user_id': 'init_user_001',
                'username': 'init_user',
                'scan_id': 'init_scan_001',
                'category': 'Plastic Bottles',
                'category_type': 'recyclable',
                'item': '500ml Water Bottle',
                'quantity': 1,
                'estimated_weight_grams': 25,
                'points_awarded': 5,
                'bonus_points': 0,
                'ml_prediction': 'plastic_bottle',
                'ml_confidence': 0.95,
                'is_verified': True,
                'location': 'Database Initialization',
                'description': 'Initial database setup document',
                'timestamp': datetime.now().isoformat(),
                'created_at': datetime.now().isoformat(),
                'saved_at': datetime.now().isoformat(),
                'data_type': 'waste_scan',
                'init_data': True
            }
            
            result1 = scan_collection.insert_one(initial_scan)
            self.stdout.write(f"✅ Created scan_analytics collection: {result1.inserted_id}")
            
            # Create ml_predictions collection
            ml_collection = db['ml_predictions']
            initial_prediction = {
                'model_version': '1.0',
                'input_data': 'initialization_test_data',
                'prediction': 'recyclable_plastic',
                'confidence': 0.95,
                'processing_time': 1.0,
                'timestamp': datetime.now().isoformat(),
                'saved_at': datetime.now().isoformat(),
                'data_type': 'ml_prediction',
                'init_data': True
            }
            
            result2 = ml_collection.insert_one(initial_prediction)
            self.stdout.write(f"✅ Created ml_predictions collection: {result2.inserted_id}")
            
            # Create users collection
            users_collection = db['users']
            initial_user = {
                'user_id': 'init_user_001',
                'username': 'init_user',
                'email': 'init@safacycle.com',
                'phone_number': '+919876543210',
                'total_points': 0,
                'level': 1,
                'registration_date': datetime.now().isoformat(),
                'last_activity': datetime.now().isoformat(),
                'profile': {
                    'bio': 'Initial test user',
                    'location': 'Mumbai, India'
                },
                'data_type': 'user_data',
                'init_data': True
            }
            
            result3 = users_collection.insert_one(initial_user)
            self.stdout.write(f"✅ Created users collection: {result3.inserted_id}")
            
            # Create admin collection
            admin_collection = db['admin']
            initial_admin = {
                'admin_id': 'init_admin_001',
                'username': 'init_admin',
                'action_type': 'database_initialization',
                'action_description': 'Database initialization through Django management command',
                'target_user_id': 'init_user_001',
                'metadata': {
                    'command': 'init_mongodb',
                    'source': 'django_management'
                },
                'timestamp': datetime.now().isoformat(),
                'data_type': 'admin_action',
                'init_data': True
            }
            
            result4 = admin_collection.insert_one(initial_admin)
            self.stdout.write(f"✅ Created admin collection: {result4.inserted_id}")
            
            # Create drivers collection
            drivers_collection = db['drivers']
            initial_driver = {
                'driver_id': 'init_driver_001',
                'username': 'init_driver',
                'full_name': 'Initial Test Driver',
                'employee_id': 'EMP001',
                'vehicle_number': 'MH-01-TEST-001',
                'vehicle_type': 'garbage_truck',
                'vehicle_capacity_kg': 3000,
                'status': 'active',
                'current_location': {
                    'latitude': 19.0760,
                    'longitude': 72.8777,
                    'area': 'Test Area',
                    'city': 'Mumbai'
                },
                'route_assigned': 'Route_INIT_001',
                'shift_timing': '06:00-14:00',
                'contact_number': '+919876543210',
                'last_location_update': datetime.now().isoformat(),
                'hire_date': datetime.now().isoformat(),
                'data_type': 'driver_data',
                'init_data': True
            }
            
            result5 = drivers_collection.insert_one(initial_driver)
            self.stdout.write(f"✅ Created drivers collection: {result5.inserted_id}")
            
            # Step 4: Create indexes
            self.stdout.write("\n🔍 Creating database indexes...")
            try:
                # Indexes for scan_analytics
                scan_collection.create_index("user_id")
                scan_collection.create_index("scan_id")
                scan_collection.create_index("category")
                scan_collection.create_index("timestamp")
                scan_collection.create_index([("user_id", 1), ("timestamp", -1)])
                
                # Indexes for ml_predictions
                ml_collection.create_index("timestamp")
                ml_collection.create_index("confidence")
                
                # Indexes for users collection
                users_collection.create_index("user_id", unique=True)
                users_collection.create_index("username")
                users_collection.create_index("email")
                users_collection.create_index("registration_date")
                
                # Indexes for admin collection
                admin_collection.create_index("admin_id")
                admin_collection.create_index("action_type")
                admin_collection.create_index("timestamp")
                admin_collection.create_index([("admin_id", 1), ("timestamp", -1)])
                
                # Indexes for drivers collection
                drivers_collection.create_index("driver_id", unique=True)
                drivers_collection.create_index("username")
                drivers_collection.create_index("vehicle_number")
                drivers_collection.create_index("status")
                drivers_collection.create_index("last_location_update")
                
                self.stdout.write("✅ Database indexes created")
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"⚠️ Index creation warning: {e}"))
            
            # Step 5: Verify creation
            self.stdout.write("\n🔍 Verifying database creation...")
            
            # List databases
            admin_db = client.admin
            db_list = admin_db.command('listDatabases')
            db_names = [db_info['name'] for db_info in db_list['databases']]
            
            if database_name in db_names:
                self.stdout.write(self.style.SUCCESS(f"✅ Database '{database_name}' exists!"))
            else:
                self.stdout.write(self.style.ERROR(f"❌ Database '{database_name}' not found!"))
                self.stdout.write(f"Available databases: {db_names}")
            
            # List collections
            collections = db.list_collection_names()
            self.stdout.write(f"📁 Collections: {collections}")
            
            for collection_name in collections:
                count = db[collection_name].count_documents({})
                self.stdout.write(f"   - {collection_name}: {count} documents")
            
            # Step 6: Test our service
            self.stdout.write("\n🧪 Testing MongoDB service...")
            service_connected = mongodb_service.is_connected()
            if service_connected:
                self.stdout.write("✅ MongoDB service connected")
                
                # Test service save
                test_data = {
                    'user_id': 'service_test_001',
                    'username': 'service_test',
                    'scan_id': 'service_test_scan_001',
                    'category': 'Test Category',
                    'description': 'Service connectivity test',
                    'timestamp': datetime.now().isoformat(),
                    'service_test': True
                }
                
                service_result = mongodb_service.save_scan_analytics(test_data)
                if service_result:
                    self.stdout.write(f"✅ Service test successful: {service_result}")
                else:
                    self.stdout.write(self.style.WARNING("⚠️ Service test failed"))
            else:
                self.stdout.write(self.style.ERROR("❌ MongoDB service connection failed"))
            
            # Cleanup if requested
            if options['cleanup']:
                self.stdout.write("\n🧹 Cleaning up initialization data...")
                scan_collection.delete_many({'init_data': True})
                ml_collection.delete_many({'init_data': True})
                scan_collection.delete_many({'service_test': True})
                self.stdout.write("✅ Cleanup completed")
            
            client.close()
            
            # Final success message
            self.stdout.write("\n" + "="*50)
            self.stdout.write(self.style.SUCCESS("🎉 MongoDB database initialization completed!"))
            self.stdout.write("")
            self.stdout.write("Next steps:")
            self.stdout.write("1. Check MongoDB Atlas dashboard")
            self.stdout.write("2. Test API endpoints with Postman")
            self.stdout.write("3. Create waste scans to verify automatic data saving")
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Database initialization failed: {str(e)}"))
            self.stdout.write("")
            self.stdout.write("Troubleshooting:")
            self.stdout.write("1. Check internet connection")
            self.stdout.write("2. Verify MongoDB Atlas cluster is running")
            self.stdout.write("3. Check IP whitelist (add 0.0.0.0/0 for testing)")
            self.stdout.write("4. Verify username 'iims' and password 'sajit69'")
            self.stdout.write("5. Ensure user has database read/write permissions")
