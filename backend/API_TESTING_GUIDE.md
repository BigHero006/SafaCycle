# SafaCycle API Testing Guide

## Step 1: Start the Server

Run this batch file to start your Django server:

```batch
c:\Users\dell\SafaCycle\backend\start_server.bat
```

Or manually run:

```bash
cd c:\Users\dell\SafaCycle\backend
python manage.py runserver 8000
```

**Expected Output:**

```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

## Step 2: Test API Endpoints

### Base URL

```
http://127.0.0.1:8000/api/v1/
```

### 🔐 Authentication Tests (Start Here)

#### 1. Register a Test User

**POST** `http://127.0.0.1:8000/api/v1/auth/register/`

**Body (JSON):**

```json
{
  "username": "testuser2025",
  "email": "testuser@safacycle.com",
  "password": "SafaCycle@123",
  "password_confirm": "SafaCycle@123",
  "phone_number": "+919876543210"
}
```

**Expected Response:** Status 201 with user data and token

#### 2. Login

**POST** `http://127.0.0.1:8000/api/v1/auth/login/`

**Body (JSON):**

```json
{
  "username": "testuser2025",
  "password": "SafaCycle@123"
}
```

**Expected Response:** Status 200 with token
**Save the token** - you'll need it for all other requests!

### 📊 MongoDB Integration Tests

#### 3. Check MongoDB Status

**GET** `http://127.0.0.1:8000/api/v1/waste/mongodb-status/`

**Headers:**

```
Authorization: Token YOUR_TOKEN_HERE
```

**Expected Response:** Should show connected status and database info

#### 4. Test MongoDB Save

**POST** `http://127.0.0.1:8000/api/v1/waste/test-mongodb/`

**Headers:**

```
Authorization: Token YOUR_TOKEN_HERE
```

**Expected Response:** Success message with ObjectIds

#### 5. Initialize MongoDB Collections

**POST** `http://127.0.0.1:8000/api/v1/waste/users/save-to-mongodb/`

**Headers:**

```
Authorization: Token YOUR_TOKEN_HERE
```

**Expected Response:** User data saved to MongoDB

### 🗃️ Collection-Specific Tests

#### 6. Test Users Collection

**GET** `http://127.0.0.1:8000/api/v1/waste/users/get-from-mongodb/`

**Headers:**

```
Authorization: Token YOUR_TOKEN_HERE
```

#### 7. Test Admin Collection (Need Staff User)

**POST** `http://127.0.0.1:8000/api/v1/waste/admin/save-action/`

**Headers:**

```
Authorization: Token YOUR_TOKEN_HERE
```

**Body (JSON):**

```json
{
  "action_type": "test_action",
  "description": "Testing admin functionality",
  "target_user_id": "1"
}
```

#### 8. Test Drivers Collection

**POST** `http://127.0.0.1:8000/api/v1/waste/drivers/save-data/`

**Headers:**

```
Authorization: Token YOUR_TOKEN_HERE
```

**Body (JSON):**

```json
{
  "driver_id": "driver_001",
  "username": "testdriver",
  "full_name": "Test Driver",
  "vehicle_number": "TEST-001",
  "vehicle_type": "garbage_truck",
  "status": "active",
  "latitude": 19.076,
  "longitude": 72.8777,
  "area": "Test Area",
  "city": "Mumbai",
  "contact_number": "+919876543210"
}
```

### 🗂️ Waste Management Tests

#### 9. Get Waste Categories

**GET** `http://127.0.0.1:8000/api/v1/waste/categories/`

**Headers:**

```
Authorization: Token YOUR_TOKEN_HERE
```

#### 10. Create Waste Scan

**POST** `http://127.0.0.1:8000/api/v1/waste/scans/create/`

**Headers:**

```
Authorization: Token YOUR_TOKEN_HERE
```

**Body (JSON):**

```json
{
  "category": 1,
  "item": 1,
  "quantity": 3,
  "estimated_weight_grams": 75,
  "description": "Test waste scan",
  "location": "Test Location",
  "ml_prediction": "plastic_bottle",
  "ml_confidence": 0.95
}
```

## Step 3: Verify MongoDB Atlas

After running the tests:

1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com/)
2. Navigate to your cluster `sajmangodb`
3. Click "Browse Collections"
4. You should see database: `safacycle_db`
5. Check these collections:
   - `scan_analytics` (from waste scans)
   - `ml_predictions` (from ML predictions)
   - `users` (from user data)
   - `admin` (from admin actions)
   - `drivers` (from driver data)

## Step 4: Using Postman (Recommended)

### Import Collection

1. Open Postman
2. Import the collection file: `SafaCycle_API_Collection.postman_collection.json`
3. Import environment: `SafaCycle_Development.postman_environment.json`

### Set Environment Variables

```json
{
  "base_url": "http://127.0.0.1:8000/api/v1",
  "auth_token": "your_token_from_login",
  "user_id": "1"
}
```

### Test Sequence

1. **Authentication** → Register → Login (save token)
2. **MongoDB Status** → Check connection
3. **MongoDB Collections** → Test all 5 collections
4. **Waste Management** → Categories → Create Scan
5. **Verification** → Check MongoDB Atlas

## Troubleshooting

### Server Won't Start

```bash
cd c:\Users\dell\SafaCycle\backend
python manage.py check
python manage.py migrate
```

### MongoDB Connection Issues

```bash
python test_setup.py
```

### Authentication Issues

- Make sure you're including the `Authorization: Token YOUR_TOKEN` header
- Register a new user if login fails
- Check if the token is valid

### Database Not Created

```bash
python force_db_creation.py
```

## Expected Results

After successful testing:

✅ **Django Server**: Running on http://127.0.0.1:8000  
✅ **MongoDB**: Connected and database created  
✅ **Collections**: 5 collections with test data  
✅ **API Endpoints**: All responding correctly  
✅ **Authentication**: Token-based auth working

## Next Steps

1. **Start the server** using `start_server.bat`
2. **Test with Postman** or curl commands
3. **Verify in MongoDB Atlas** that collections are created
4. **Integrate with React Native** app using the API endpoints

Your SafaCycle backend is ready for production testing! 🚀
