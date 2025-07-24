# MongoDB Integration Testing Guide

## Issue Resolution

The MongoDB integration wasn't working properly when testing with Postman. Here are the fixes implemented:

### ✅ **Fixed Issues:**

1. **Model Save Method**: Fixed the `WasteScan.save()` method to properly save to MongoDB after Django model save
2. **User Level Updates**: Fixed the level calculation and save process
3. **MongoDB Connection**: Enhanced error handling and logging
4. **Test Endpoint**: Added `/api/v1/waste/test-mongodb/` for debugging

### 🔧 **Changes Made:**

#### 1. Enhanced WasteScan Model (`waste_management/models.py`)

- Fixed the save method to detect new records properly
- Separated MongoDB save into `_save_to_mongodb()` method
- Added better error handling and logging
- Fixed user points and level updates

#### 2. Improved MongoDB Service (`mongodb_service.py`)

- Added timestamps and metadata to saved documents
- Enhanced error logging with full tracebacks
- Better connection status checking

#### 3. Added Debug Endpoint

- **URL**: `POST /api/v1/waste/test-mongodb/`
- **Purpose**: Manually test MongoDB save functionality
- **Returns**: Success/failure status with ObjectIds

## 🧪 **Testing Steps:**

### Step 1: Test MongoDB Connection

1. **Endpoint**: `GET /api/v1/waste/mongodb-status/`
2. **Expected**: `"status": "connected"`
3. **Headers**: `Authorization: Token YOUR_TOKEN`

### Step 2: Test Manual MongoDB Save

1. **Endpoint**: `POST /api/v1/waste/test-mongodb/`
2. **Expected Response**:

```json
{
  "success": true,
  "message": "Test data saved to MongoDB successfully",
  "scan_analytics_id": "ObjectId_here",
  "ml_prediction_id": "ObjectId_here",
  "mongodb_status": true
}
```

### Step 3: Create Real Waste Scan

1. **Endpoint**: `POST /api/v1/waste/scans/create/`
2. **Body**:

```json
{
  "category": 1,
  "item": 1,
  "quantity": 3,
  "estimated_weight_grams": 75,
  "description": "Test scan for MongoDB",
  "location": "Test Location",
  "ml_prediction": "plastic_bottle",
  "ml_confidence": 0.95
}
```

3. **Expected**: Scan created AND data saved to MongoDB automatically

### Step 4: Verify Analytics Data

1. **Endpoint**: `GET /api/v1/waste/analytics/`
2. **Expected**: Should show the analytics data from previous scans

## 🔍 **Debugging MongoDB Issues:**

### Check 1: Connection String

Verify in settings.py:

```python
MONGODB_SETTINGS = {
    'connection_string': 'mongodb+srv://safacycle:safacycle123@sajmangodb.mow3j.mongodb.net/',
    'database_name': 'safacycle_db',
    # ... other settings
}
```

### Check 2: IP Whitelist

- Go to MongoDB Atlas Dashboard
- Navigate to Network Access
- Ensure your IP is whitelisted (or use 0.0.0.0/0 for testing)

### Check 3: Server Logs

When running the Django server, watch for these log messages:

- `✅ "MongoDB connected successfully"`
- `✅ "Analytics data saved to MongoDB for scan X with ObjectId: Y"`
- `❌ "MongoDB connection failed: error_message"`

### Check 4: Manual Test Script

Run the debug script:

```bash
python mongodb_debug_test.py
```

## 📊 **Expected MongoDB Collections:**

After successful testing, you should see these collections in MongoDB Atlas:

### Collection: `scan_analytics`

```json
{
  "_id": ObjectId("..."),
  "user_id": "1",
  "username": "testuser2025",
  "scan_id": "1",
  "category": "Plastic Bottles",
  "category_type": "recyclable",
  "item": "500ml Water Bottle",
  "quantity": 3,
  "estimated_weight_grams": 75,
  "points_awarded": 15,
  "bonus_points": 1,
  "ml_prediction": "plastic_bottle",
  "ml_confidence": 0.95,
  "location": "Test Location",
  "description": "Test scan for MongoDB",
  "timestamp": "2025-07-24T10:30:00Z",
  "saved_at": "2025-07-24T10:30:00Z",
  "data_type": "waste_scan"
}
```

### Collection: `ml_predictions`

```json
{
  "_id": ObjectId("..."),
  "model_version": "1.0",
  "prediction": "recyclable_plastic",
  "confidence": 0.92,
  "processing_time": 1.2,
  "timestamp": "2025-07-24T10:30:00Z",
  "saved_at": "2025-07-24T10:30:00Z",
  "data_type": "ml_prediction"
}
```

## 🚀 **Production Checklist:**

- [ ] IP whitelist updated for production servers
- [ ] Connection string secured (use environment variables)
- [ ] Indexes created for frequently queried fields:
  - `scan_analytics.user_id`
  - `scan_analytics.category`
  - `scan_analytics.timestamp`
- [ ] Monitoring setup for MongoDB connection status
- [ ] Backup strategy configured

## 💡 **Next Steps:**

1. **Test all endpoints** with Postman using the provided collection
2. **Verify MongoDB Atlas** shows the new collections and data
3. **Check analytics endpoints** return the saved data
4. **Monitor server logs** for any MongoDB errors
5. **Consider data indexing** for better query performance

The MongoDB integration should now work properly when creating waste scans through the API!
