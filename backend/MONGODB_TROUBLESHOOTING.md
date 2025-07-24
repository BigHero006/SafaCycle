# MongoDB Database Not Creating - Troubleshooting Guide

## Problem

MongoDB database is not being created when testing with Postman, even though the connection string is configured.

## Root Cause Analysis

MongoDB Atlas databases and collections are created **lazily** - they only appear when:

1. At least one document is inserted into a collection
2. The connection has proper write permissions
3. The IP address is whitelisted
4. The user credentials are correct

## Step-by-Step Solution

### Step 1: Verify MongoDB Atlas Setup

#### Check Cluster Status

1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com/)
2. Navigate to your cluster `sajmangodb`
3. Ensure the cluster status shows "Active" (green)

#### Check Database User

1. Go to Database Access
2. Find user `iims`
3. Verify it has:
   - Password: `sajit69`
   - Role: `Atlas admin` or `Read and write to any database`
   - Status: Active

#### Check Network Access

1. Go to Network Access
2. Ensure one of these is whitelisted:
   - Your current IP address
   - `0.0.0.0/0` (allows all IPs - for testing only)

### Step 2: Test Connection Manually

Run this test script to verify connection:

```bash
cd c:\Users\dell\SafaCycle\backend
python simple_mongo_test.py
```

**Expected Output:**

```
✅ pymongo is available
🔗 Testing connection to: mongodb+srv://iims:sajit69@sajmangodb.mow3j.mongodb.net/
📊 Database: safacycle_db
📡 Testing connection...
✅ Connection successful!
✅ SUCCESS: Database 'safacycle_db' has been created!
```

### Step 3: Force Database Creation

Run Django management command:

```bash
python manage.py init_mongodb
```

This will:

- Test the connection
- Create the database by inserting initial documents
- Create required collections (`scan_analytics`, `ml_predictions`)
- Set up database indexes
- Verify everything is working

### Step 4: Test Through Django API

1. **Start Django server:**

   ```bash
   python manage.py runserver
   ```

2. **Test MongoDB status endpoint:**

   ```
   GET http://127.0.0.1:8000/api/v1/waste/mongodb-status/
   ```

3. **Force MongoDB save through API:**

   ```
   POST http://127.0.0.1:8000/api/v1/waste/test-mongodb/
   Headers: Authorization: Token YOUR_TOKEN
   ```

4. **Create actual waste scan:**
   ```
   POST http://127.0.0.1:8000/api/v1/waste/scans/create/
   Headers: Authorization: Token YOUR_TOKEN
   Body: {
     "category": 1,
     "item": 1,
     "quantity": 3,
     "description": "Test scan"
   }
   ```

### Step 5: Verify in MongoDB Atlas

1. Go to MongoDB Atlas Dashboard
2. Click "Browse Collections"
3. You should see:
   - Database: `safacycle_db`
   - Collections: `scan_analytics`, `ml_predictions`
   - Documents in each collection

## Common Issues and Solutions

### Issue 1: "Authentication failed"

**Solution:**

- Verify username is exactly `iims`
- Verify password is exactly `sajit69`
- Check if user exists in Database Access
- Ensure user has proper permissions

### Issue 2: "Connection timeout"

**Solution:**

- Check internet connection
- Verify cluster is active in Atlas
- Add your IP to Network Access whitelist
- Try `0.0.0.0/0` for testing

### Issue 3: "Database not appearing in Atlas"

**Solution:**

- MongoDB creates databases lazily
- Run the init command to force creation
- Insert at least one document
- Refresh the Atlas dashboard

### Issue 4: "Collections are empty"

**Solution:**

- Make sure Django server is running
- Create actual waste scans through API
- Check Django logs for MongoDB save errors
- Verify the WasteScan model is calling `_save_to_mongodb()`

## Verification Checklist

- [ ] MongoDB Atlas cluster is active
- [ ] User `iims` exists with correct password
- [ ] IP address is whitelisted (0.0.0.0/0 for testing)
- [ ] Connection test script passes
- [ ] Django init_mongodb command succeeds
- [ ] MongoDB status API returns "connected"
- [ ] Test MongoDB save API works
- [ ] Database appears in Atlas dashboard
- [ ] Collections contain documents

## Debug Commands

### Check Django Settings

```python
python manage.py shell
>>> from django.conf import settings
>>> print(settings.MONGODB_SETTINGS)
```

### Test MongoDB Service

```python
python manage.py shell
>>> from safacycle_backend.mongodb_service import mongodb_service
>>> print(mongodb_service.is_connected())
>>> print(mongodb_service.get_db_stats())
```

### Manual Document Insert

```python
python manage.py shell
>>> from safacycle_backend.mongodb_service import mongodb_service
>>> test_data = {'test': True, 'message': 'Manual test'}
>>> result = mongodb_service.save_scan_analytics(test_data)
>>> print(f"Inserted: {result}")
```

## Final Notes

1. **MongoDB Atlas free tier** has some limitations but should work fine for development
2. **Database creation is lazy** - it only appears after the first document insert
3. **Collections disappear** if they become empty (this is normal MongoDB behavior)
4. **Always check Atlas dashboard** to verify database and collections exist
5. **Use 0.0.0.0/0 IP whitelist** for testing only, never in production

If you're still having issues after following this guide, check:

- MongoDB Atlas service status
- Your internet connection stability
- Django server logs for detailed error messages
