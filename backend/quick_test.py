print("SafaCycle MongoDB Connection Test")
print("=================================")

# Test basic Python functionality
print("✅ Python is working")

# Test pymongo import
try:
    import pymongo
    print(f"✅ pymongo version: {pymongo.__version__}")
except ImportError as e:
    print(f"❌ pymongo import failed: {e}")
    exit(1)

# Test MongoDB connection
try:
    from pymongo import MongoClient
    
    connection_string = "mongodb+srv://safacycle:safacycle123@sajmangodb.mow3j.mongodb.net/"
    print(f"🔗 Connecting to MongoDB Atlas...")
    
    client = MongoClient(connection_string, serverSelectionTimeoutMS=5000)
    
    # Ping to test connection
    print("📡 Testing connection...")
    client.admin.command('ping')
    print("✅ Successfully connected to MongoDB Atlas!")
    
    # Get database info
    db = client['safacycle_db']
    print(f"📊 Database: {db.name}")
    
    # List collections
    collections = db.list_collection_names()
    print(f"📁 Found {len(collections)} collections")
    
    if collections:
        for collection in collections:
            count = db[collection].count_documents({})
            print(f"   - {collection}: {count} documents")
    
    print("🎉 MongoDB is ready for SafaCycle!")
    
except Exception as e:
    print(f"❌ Connection failed: {e}")
    print("Please check your internet connection and MongoDB Atlas settings")

print("\nConnection test completed!")
