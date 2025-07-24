from pymongo import MongoClient
from django.conf import settings
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class MongoDBService:
    _instance = None
    _client = None
    _db = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MongoDBService, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        if self._client is None:
            self.connect()
    
    def connect(self):
        """Connect to MongoDB"""
        try:
            mongodb_settings = settings.MONGODB_SETTINGS
            self._client = MongoClient(
                mongodb_settings['connection_string'],
                **mongodb_settings['connection_params']
            )
            self._db = self._client[mongodb_settings['database_name']]
            
            # Test connection with a ping
            self._client.admin.command('ping')
            logger.info("MongoDB connected successfully")
            
            # Initialize collections and indexes
            self._initialize_collections()
            
        except Exception as e:
            logger.error(f"MongoDB connection failed: {e}")
            self._client = None
            self._db = None
    
    def _initialize_collections(self):
        """Initialize collections and create indexes"""
        try:
            if self._db is not None:
                # Define collections to initialize
                collections_to_create = [
                    'scan_analytics',
                    'ml_predictions', 
                    'users',
                    'admin',
                    'drivers'
                ]
                
                # Create collections with initial documents to ensure they appear in Atlas
                for collection_name in collections_to_create:
                    collection = self._db[collection_name]
                    
                    # Insert initial document if collection is empty
                    if collection.count_documents({}) == 0:
                        initial_doc = {
                            'initialized': True,
                            'created_at': datetime.utcnow(),
                            'description': f'Initial document for {collection_name} collection'
                        }
                        collection.insert_one(initial_doc)
                        logger.info(f"Initialized collection: {collection_name}")
                
                # Create indexes for scan_analytics collection
                scan_collection = self._db['scan_analytics']
                scan_collection.create_index("user_id")
                scan_collection.create_index("scan_id")
                scan_collection.create_index("category")
                scan_collection.create_index("timestamp")
                scan_collection.create_index([("user_id", 1), ("timestamp", -1)])
                
                # Create indexes for ml_predictions collection
                ml_collection = self._db['ml_predictions']
                ml_collection.create_index("timestamp")
                ml_collection.create_index("confidence")
                
                # Create indexes for users collection
                users_collection = self._db['users']
                users_collection.create_index("user_id", unique=True)
                users_collection.create_index("username")
                users_collection.create_index("email")
                users_collection.create_index("created_at")
                
                # Create indexes for admin collection
                admin_collection = self._db['admin']
                admin_collection.create_index("admin_id", unique=True)
                admin_collection.create_index("username")
                admin_collection.create_index("action_type")
                admin_collection.create_index("timestamp")
                
                # Create indexes for drivers collection
                drivers_collection = self._db['drivers']
                drivers_collection.create_index("driver_id", unique=True)
                drivers_collection.create_index("username")
                drivers_collection.create_index("vehicle_number")
                drivers_collection.create_index("status")
                drivers_collection.create_index("last_location_update")
                
                logger.info("MongoDB collections and indexes initialized")
                
        except Exception as e:
            logger.warning(f"Failed to initialize MongoDB collections: {e}")
            # Don't fail the connection for index creation issues
    
    def get_database(self):
        """Get MongoDB database instance"""
        if self._db is None:
            self.connect()
        return self._db
    
    def is_connected(self):
        """Check if MongoDB is connected"""
        try:
            if self._client:
                self._client.admin.command('ping')
                return True
        except:
            pass
        return False
    
    def save_scan_analytics(self, scan_data):
        """Save scan data to MongoDB for analytics"""
        try:
            db = self.get_database()
            if db is not None:
                collection = db['scan_analytics']
                
                # Add metadata
                scan_data['saved_at'] = datetime.now().isoformat()
                scan_data['data_type'] = 'waste_scan'
                
                result = collection.insert_one(scan_data)
                logger.info(f"Scan analytics saved to MongoDB with ObjectId: {result.inserted_id}")
                return result.inserted_id
            else:
                logger.error("MongoDB database instance is None")
                return None
        except Exception as e:
            logger.error(f"Error saving scan analytics to MongoDB: {str(e)}")
            # Print detailed error for debugging
            import traceback
            logger.error(f"Full traceback: {traceback.format_exc()}")
        return None
    
    def save_ml_prediction(self, prediction_data):
        """Save ML prediction results"""
        try:
            db = self.get_database()
            if db is not None:
                collection = db['ml_predictions']
                
                # Add metadata
                prediction_data['saved_at'] = datetime.now().isoformat()
                prediction_data['data_type'] = 'ml_prediction'
                
                result = collection.insert_one(prediction_data)
                logger.info(f"ML prediction saved to MongoDB with ObjectId: {result.inserted_id}")
                return result.inserted_id
            else:
                logger.error("MongoDB database instance is None")
                return None
        except Exception as e:
            logger.error(f"Error saving ML prediction to MongoDB: {str(e)}")
            import traceback
            logger.error(f"Full traceback: {traceback.format_exc()}")
        return None
    
    def get_user_analytics(self, user_id):
        """Get user analytics from MongoDB"""
        try:
            db = self.get_database()
            if db is not None:
                collection = db['scan_analytics']
                analytics = collection.find({'user_id': user_id})
                return list(analytics)
        except Exception as e:
            logger.error(f"Error getting user analytics: {e}")
        return []
    
    def get_db_stats(self):
        """Get database statistics"""
        try:
            db = self.get_database()
            if db is not None:
                stats = db.command("dbstats")
                collections = db.list_collection_names()
                
                # Count documents in each collection
                collection_counts = {}
                total_documents = 0
                for collection_name in collections:
                    count = db[collection_name].count_documents({})
                    collection_counts[collection_name] = count
                    total_documents += count
                
                return {
                    'database_name': db.name,
                    'collections': len(collections),
                    'collection_names': collections,
                    'collection_counts': collection_counts,
                    'total_documents': total_documents,
                    'db_size_mb': round(stats.get('dataSize', 0) / (1024 * 1024), 2),
                    'storage_size_mb': round(stats.get('storageSize', 0) / (1024 * 1024), 2),
                }
        except Exception as e:
            logger.error(f"Error getting DB stats: {e}")
        return None

    def save_user_data(self, user_data):
        """Save user data to MongoDB"""
        try:
            db = self.get_database()
            if db is not None:
                collection = db['users']
                
                # Add metadata
                user_data['saved_at'] = datetime.now().isoformat()
                user_data['data_type'] = 'user_data'
                
                # Check if user already exists
                existing_user = collection.find_one({'user_id': user_data.get('user_id')})
                
                if existing_user:
                    # Update existing user
                    result = collection.update_one(
                        {'user_id': user_data.get('user_id')},
                        {'$set': user_data}
                    )
                    logger.info(f"User data updated in MongoDB for user_id: {user_data.get('user_id')}")
                    return existing_user['_id']
                else:
                    # Insert new user
                    result = collection.insert_one(user_data)
                    logger.info(f"User data saved to MongoDB with ObjectId: {result.inserted_id}")
                    return result.inserted_id
            else:
                logger.error("MongoDB database instance is None")
                return None
        except Exception as e:
            logger.error(f"Error saving user data to MongoDB: {str(e)}")
            import traceback
            logger.error(f"Full traceback: {traceback.format_exc()}")
        return None
    
    def save_admin_action(self, admin_data):
        """Save admin action to MongoDB"""
        try:
            db = self.get_database()
            if db is not None:
                collection = db['admin']
                
                # Add metadata
                admin_data['timestamp'] = datetime.now().isoformat()
                admin_data['data_type'] = 'admin_action'
                
                result = collection.insert_one(admin_data)
                logger.info(f"Admin action saved to MongoDB with ObjectId: {result.inserted_id}")
                return result.inserted_id
            else:
                logger.error("MongoDB database instance is None")
                return None
        except Exception as e:
            logger.error(f"Error saving admin action to MongoDB: {str(e)}")
            import traceback
            logger.error(f"Full traceback: {traceback.format_exc()}")
        return None
    
    def save_driver_data(self, driver_data):
        """Save driver data to MongoDB"""
        try:
            db = self.get_database()
            if db is not None:
                collection = db['drivers']
                
                # Add metadata
                driver_data['last_updated'] = datetime.now().isoformat()
                driver_data['data_type'] = 'driver_data'
                
                # Check if driver already exists
                existing_driver = collection.find_one({'driver_id': driver_data.get('driver_id')})
                
                if existing_driver:
                    # Update existing driver
                    result = collection.update_one(
                        {'driver_id': driver_data.get('driver_id')},
                        {'$set': driver_data}
                    )
                    logger.info(f"Driver data updated in MongoDB for driver_id: {driver_data.get('driver_id')}")
                    return existing_driver['_id']
                else:
                    # Insert new driver
                    result = collection.insert_one(driver_data)
                    logger.info(f"Driver data saved to MongoDB with ObjectId: {result.inserted_id}")
                    return result.inserted_id
            else:
                logger.error("MongoDB database instance is None")
                return None
        except Exception as e:
            logger.error(f"Error saving driver data to MongoDB: {str(e)}")
            import traceback
            logger.error(f"Full traceback: {traceback.format_exc()}")
        return None
    
    def get_user_data(self, user_id):
        """Get user data from MongoDB"""
        try:
            db = self.get_database()
            if db is not None:
                collection = db['users']
                user_data = collection.find_one({'user_id': user_id})
                return user_data
        except Exception as e:
            logger.error(f"Error getting user data: {e}")
        return None
    
    def get_admin_actions(self, admin_id=None, limit=50):
        """Get admin actions from MongoDB"""
        try:
            db = self.get_database()
            if db is not None:
                collection = db['admin']
                query = {'admin_id': admin_id} if admin_id else {}
                actions = collection.find(query).sort('timestamp', -1).limit(limit)
                return list(actions)
        except Exception as e:
            logger.error(f"Error getting admin actions: {e}")
        return []
    
    def get_driver_data(self, driver_id=None):
        """Get driver data from MongoDB"""
        try:
            db = self.get_database()
            if db is not None:
                collection = db['drivers']
                if driver_id:
                    driver_data = collection.find_one({'driver_id': driver_id})
                    return driver_data
                else:
                    # Get all drivers
                    drivers = collection.find({})
                    return list(drivers)
        except Exception as e:
            logger.error(f"Error getting driver data: {e}")
        return None if driver_id else []

# Global instance
mongodb_service = MongoDBService()
