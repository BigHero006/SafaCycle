import sys

# Test pymongo installation
try:
    from pymongo import MongoClient
    print("✅ pymongo is installed")
except ImportError:
    print("❌ pymongo is not installed. Installing...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pymongo"])
    from pymongo import MongoClient
    print("✅ pymongo installed successfully")

# Test MongoDB connection
connection_string = "mongodb+srv://safacycle:safacycle123@sajmangodb.mow3j.mongodb.net/"
print(f"🔗 Testing connection to: {connection_string}")

try:
    client = MongoClient(
        connection_string,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=10000,
        socketTimeoutMS=10000,
        maxPoolSize=50,
        retryWrites=True,
        w='majority'
    )
    
    # Test connection
    client.admin.command('ping')
    print("✅ MongoDB Atlas connection successful!")
    
    # Get database
    db = client['safacycle_db']
    print(f"📊 Connected to database: {db.name}")
    
    # List collections
    collections = db.list_collection_names()
    print(f"📁 Collections found: {len(collections)}")
    
    if collections:
        print("📋 Collection names:")
        for collection_name in collections:
            count = db[collection_name].count_documents({})
            print(f"   - {collection_name}: {count} documents")
    else:
        print("📋 No collections found (new database)")
    
    # Test creating a collection and inserting data
    test_collection = db['connection_test']
    test_doc = {
        'test': True,
        'message': 'SafaCycle MongoDB connection working!',
        'timestamp': '2025-07-24T10:30:00Z',
        'connection_test': True
    }
    
    result = test_collection.insert_one(test_doc)
    print(f"✅ Test document inserted with ID: {result.inserted_id}")
    
    # Verify insertion
    found_doc = test_collection.find_one({'_id': result.inserted_id})
    if found_doc:
        print("✅ Test document verified in database")
        print(f"   Message: {found_doc.get('message')}")
    
    # Get updated collection count
    updated_collections = db.list_collection_names()
    print(f"📁 Collections after test: {len(updated_collections)}")
    for collection_name in updated_collections:
        count = db[collection_name].count_documents({})
        print(f"   - {collection_name}: {count} documents")
    
    # Clean up test document (optional - you can keep it for verification)
    # test_collection.delete_one({'_id': result.inserted_id})
    # print("🧹 Test document cleaned up")
    
    client.close()
    print("🔐 Connection closed successfully")
    print("\n🎉 MongoDB Atlas integration is ready for SafaCycle!")
    
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    print("\nTroubleshooting steps:")
    print("1. Check internet connectivity")
    print("2. Verify MongoDB Atlas cluster is running")
    print("3. Check if your IP address is whitelisted in MongoDB Atlas")
    print("4. Verify the connection string is correct")
    print("5. Make sure the username and password are correct")
