"""
Simple MongoDB connection test
"""
import sys

# Test pymongo installation
try:
    from pymongo import MongoClient
    print("✅ pymongo is available")
except ImportError:
    print("❌ pymongo is not installed")
    print("Installing pymongo...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pymongo"])
    from pymongo import MongoClient

# Test connection
connection_string = "mongodb+srv://iims:sajit69@sajmangodb.mow3j.mongodb.net/"
database_name = "safacycle_db"

print(f"\n🔗 Testing connection to: {connection_string}")
print(f"📊 Database: {database_name}")

try:
    # Create client
    client = MongoClient(
        connection_string,
        serverSelectionTimeoutMS=10000,
        connectTimeoutMS=10000,
        socketTimeoutMS=10000
    )
    
    # Test connection
    print("\n📡 Testing connection...")
    client.admin.command('ping')
    print("✅ Connection successful!")
    
    # Get database
    db = client[database_name]
    print(f"📊 Accessing database: {db.name}")
    
    # Force database creation by inserting a document
    print("\n� Creating initial document...")
    collection = db['test_collection']
    
    test_doc = {
        'message': 'Database creation test',
        'timestamp': '2025-07-24T12:00:00Z',
        'test': True
    }
    
    result = collection.insert_one(test_doc)
    print(f"✅ Document inserted with ID: {result.inserted_id}")
    
    # Verify database exists
    print("\n� Verifying database creation...")
    admin_db = client.admin
    db_list = admin_db.command('listDatabases')
    
    print("Available databases:")
    for db_info in db_list['databases']:
        print(f"  - {db_info['name']} ({db_info['sizeOnDisk']} bytes)")
        
    if database_name in [db_info['name'] for db_info in db_list['databases']]:
        print(f"\n✅ SUCCESS: Database '{database_name}' has been created!")
        
        # List collections
        collections = db.list_collection_names()
        print(f"Collections in {database_name}: {collections}")
        
        for coll_name in collections:
            count = db[coll_name].count_documents({})
            print(f"  - {coll_name}: {count} documents")
    else:
        print(f"\n❌ Database '{database_name}' was not created")
    
    # Cleanup test document
    print("\n🧹 Cleaning up test document...")
    collection.delete_one({'_id': result.inserted_id})
    
    # If test_collection is now empty, it might disappear
    remaining_count = collection.count_documents({})
    print(f"Remaining documents in test_collection: {remaining_count}")
    
    client.close()
    print("\n🎉 Connection test completed successfully!")
    
except Exception as e:
    print(f"\n❌ Connection failed: {e}")
    print("\nTroubleshooting steps:")
    print("1. Check internet connectivity")
    print("2. Verify MongoDB Atlas cluster is running")
    print("3. Check IP whitelist in MongoDB Atlas (try 0.0.0.0/0)")
    print("4. Verify credentials: username=iims, password=sajit69")
    print("5. Check that user has proper database permissions")

print("\nDone!")
