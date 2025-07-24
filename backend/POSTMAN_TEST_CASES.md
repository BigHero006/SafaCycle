# SafaCycle Backend API Test Cases for Postman

## Overview

This document contains comprehensive test cases for the SafaCycle Django backend API. These tests can be imported into Postman or used as a reference for API testing.

## Base Configuration

**Base URL:** `http://127.0.0.1:8000/api/v1/`

**Headers for all requests:**

```json
{
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

**Headers for authenticated requests:**

```json
{
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Authorization": "Token YOUR_TOKEN_HERE"
}
```

---

## 1. Authentication Endpoints

### 1.1 User Registration

**Method:** `POST`  
**URL:** `{{base_url}}/auth/register/`  
**Body (raw JSON):**

```json
{
  "username": "testuser2025",
  "email": "testuser@safacycle.com",
  "password": "SafaCycle@123",
  "password_confirm": "SafaCycle@123",
  "phone_number": "+919876543210"
}
```

**Expected Response (201):**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "testuser2025",
    "email": "testuser@safacycle.com",
    "phone_number": "+919876543210",
    "total_points": 0,
    "level": 1
  },
  "token": "your_auth_token_here"
}
```

**Test Cases:**

- Valid registration with all required fields
- Registration with existing username (should fail)
- Registration with existing email (should fail)
- Registration with mismatched passwords (should fail)
- Registration with invalid email format (should fail)

### 1.2 User Login

**Method:** `POST`  
**URL:** `{{base_url}}/auth/login/`  
**Body (raw JSON):**

```json
{
  "username": "testuser2025",
  "password": "SafaCycle@123"
}
```

**Expected Response (200):**

```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "testuser2025",
    "email": "testuser@safacycle.com",
    "total_points": 150,
    "level": 2
  },
  "token": "your_auth_token_here"
}
```

**Test Cases:**

- Valid login with username and password
- Login with email and password
- Invalid username (should fail)
- Invalid password (should fail)
- Empty credentials (should fail)

### 1.3 User Profile

**Method:** `GET`  
**URL:** `{{base_url}}/auth/profile/`  
**Headers:** Include Authorization token

**Expected Response (200):**

```json
{
  "id": 1,
  "username": "testuser2025",
  "email": "testuser@safacycle.com",
  "phone_number": "+919876543210",
  "total_points": 150,
  "level": 2,
  "date_joined": "2025-07-24T10:30:00Z",
  "profile": {
    "bio": "",
    "location": "",
    "profile_picture": null
  }
}
```

### 1.4 Update Profile

**Method:** `PUT`  
**URL:** `{{base_url}}/auth/profile/`  
**Headers:** Include Authorization token  
**Body (raw JSON):**

```json
{
  "phone_number": "+919876543211",
  "profile": {
    "bio": "Environmental enthusiast and waste management advocate",
    "location": "Mumbai, India"
  }
}
```

---

## 2. Waste Management Endpoints

### 2.1 Get Waste Categories

**Method:** `GET`  
**URL:** `{{base_url}}/waste/categories/`  
**Headers:** Include Authorization token

**Expected Response (200):**

```json
[
  {
    "id": 1,
    "name": "Plastic Bottles",
    "category_type": "recyclable",
    "description": "PET plastic bottles",
    "points_per_item": 5,
    "is_active": true
  },
  {
    "id": 2,
    "name": "Paper",
    "category_type": "recyclable",
    "description": "Newspaper, magazines, office paper",
    "points_per_item": 3,
    "is_active": true
  }
]
```

### 2.2 Get Waste Items

**Method:** `GET`  
**URL:** `{{base_url}}/waste/items/`  
**Headers:** Include Authorization token

**Query Parameters:**

- `category`: Filter by category ID (optional)

**Expected Response (200):**

```json
[
  {
    "id": 1,
    "name": "500ml Water Bottle",
    "category": 1,
    "category_name": "Plastic Bottles",
    "description": "Standard 500ml plastic water bottle",
    "estimated_weight_grams": 25,
    "is_recyclable": true
  }
]
```

### 2.3 Create Waste Scan

**Method:** `POST`  
**URL:** `{{base_url}}/waste/scans/create/`  
**Headers:** Include Authorization token  
**Body (raw JSON):**

```json
{
  "category": 1,
  "item": 1,
  "quantity": 3,
  "estimated_weight_grams": 75,
  "description": "Found near park entrance",
  "location": "Bandra West, Mumbai",
  "ml_prediction": "plastic_bottle",
  "ml_confidence": 0.95
}
```

**Expected Response (201):**

```json
{
  "id": 1,
  "category": 1,
  "category_name": "Plastic Bottles",
  "item": 1,
  "item_name": "500ml Water Bottle",
  "quantity": 3,
  "estimated_weight_grams": 75,
  "points_awarded": 15,
  "bonus_points": 1,
  "description": "Found near park entrance",
  "location": "Bandra West, Mumbai",
  "ml_prediction": "plastic_bottle",
  "ml_confidence": 0.95,
  "is_verified": false,
  "created_at": "2025-07-24T10:30:00Z"
}
```

### 2.4 Get User Scans

**Method:** `GET`  
**URL:** `{{base_url}}/waste/scans/`  
**Headers:** Include Authorization token

**Expected Response (200):**

```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "category_name": "Plastic Bottles",
      "item_name": "500ml Water Bottle",
      "quantity": 3,
      "points_awarded": 15,
      "bonus_points": 1,
      "created_at": "2025-07-24T10:30:00Z"
    }
  ]
}
```

### 2.5 Get User Statistics

**Method:** `GET`  
**URL:** `{{base_url}}/waste/stats/`  
**Headers:** Include Authorization token

**Expected Response (200):**

```json
{
  "total_scans": 25,
  "total_points": 150,
  "level": 2,
  "total_weight_grams": 1250,
  "category_breakdown": {
    "Plastic Bottles": 15,
    "Paper": 8,
    "Organic": 2
  },
  "this_month_scans": 10,
  "this_month_points": 65
}
```

### 2.6 Get Dashboard Data

**Method:** `GET`  
**URL:** `{{base_url}}/waste/dashboard/`  
**Headers:** Include Authorization token

**Expected Response (200):**

```json
{
  "recent_scans": [
    {
      "id": 5,
      "category_name": "Plastic Bottles",
      "quantity": 2,
      "points_awarded": 10,
      "created_at": "2025-07-24T09:15:00Z"
    }
  ],
  "category_breakdown": {
    "Plastic Bottles": 15,
    "Paper": 8,
    "Organic": 2
  },
  "total_points": 150,
  "level": 2,
  "monthly_progress": {
    "current_month": 65,
    "previous_month": 45
  }
}
```

### 2.7 Get Collection Schedule

**Method:** `GET`  
**URL:** `{{base_url}}/waste/collection-schedule/`  
**Headers:** Include Authorization token

**Expected Response (200):**

```json
[
  {
    "id": 1,
    "area": "Bandra West",
    "collection_type": "recyclable",
    "scheduled_date": "2025-07-25",
    "scheduled_time": "09:00:00",
    "is_active": true,
    "contact_number": "+919876543210",
    "instructions": "Keep recyclables clean and dry"
  }
]
```

---

## 3. MongoDB Integration Endpoints

### 3.1 MongoDB Status

**Method:** `GET`  
**URL:** `{{base_url}}/waste/mongodb-status/`  
**Headers:** Include Authorization token

**Expected Response (200):**

```json
{
  "status": "connected",
  "message": "MongoDB connection is active",
  "database_info": {
    "database_name": "safacycle_db",
    "collections": 2,
    "collection_names": ["scan_analytics", "ml_predictions"],
    "collection_counts": {
      "scan_analytics": 45,
      "ml_predictions": 23
    },
    "total_documents": 68,
    "db_size_mb": 0.15,
    "storage_size_mb": 0.25
  }
}
```

### 3.2 User Analytics

**Method:** `GET`  
**URL:** `{{base_url}}/waste/analytics/`  
**Headers:** Include Authorization token

**Expected Response (200):**

```json
{
  "user_id": "1",
  "analytics_count": 15,
  "analytics": [
    {
      "_id": "64b8f12345678901234567ab",
      "user_id": "1",
      "username": "testuser2025",
      "scan_id": "1",
      "category": "Plastic Bottles",
      "category_type": "recyclable",
      "quantity": 3,
      "points_awarded": 15,
      "ml_confidence": 0.95,
      "timestamp": "2025-07-24T10:30:00Z"
    }
  ]
}
```

### 3.3 Test MongoDB Save (Debug Endpoint)

**Method:** `POST`  
**URL:** `{{base_url}}/waste/test-mongodb/`  
**Headers:** Include Authorization token

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Test data saved to MongoDB successfully",
  "scan_analytics_id": "64b8f12345678901234567ab",
  "ml_prediction_id": "64b8f12345678901234567ac",
  "mongodb_status": true
}
```

**Test Cases:**

- Verify MongoDB connection is active
- Confirm test data is saved to both collections
- Check that ObjectIds are returned properly

### 3.4 Save User to MongoDB

**Method:** `POST`  
**URL:** `{{base_url}}/waste/users/save-to-mongodb/`  
**Headers:** Include Authorization token

**Expected Response (201):**

```json
{
  "success": true,
  "message": "User data saved to MongoDB users collection",
  "user_id": "1",
  "mongodb_id": "64b8f12345678901234567ad"
}
```

### 3.5 Get User from MongoDB

**Method:** `GET`  
**URL:** `{{base_url}}/waste/users/get-from-mongodb/`  
**Headers:** Include Authorization token

**Expected Response (200):**

```json
{
  "success": true,
  "user_data": {
    "_id": "64b8f12345678901234567ad",
    "user_id": "1",
    "username": "testuser2025",
    "email": "testuser@safacycle.com",
    "total_points": 150,
    "level": 2,
    "profile": {
      "bio": "Environmental enthusiast",
      "location": "Mumbai, India"
    }
  }
}
```

### 3.6 Save Admin Action

**Method:** `POST`  
**URL:** `{{base_url}}/waste/admin/save-action/`  
**Headers:** Include Authorization token (requires admin/staff user)  
**Body (raw JSON):**

```json
{
  "action_type": "user_verification",
  "description": "Verified user waste scan submission",
  "target_user_id": "1"
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Admin action saved to MongoDB",
  "action_id": "64b8f12345678901234567ae"
}
```

### 3.7 Get Admin Actions

**Method:** `GET`  
**URL:** `{{base_url}}/waste/admin/get-actions/`  
**Headers:** Include Authorization token (requires admin/staff user)

**Query Parameters:**

- `admin_id`: Filter by admin ID (optional)
- `limit`: Number of actions to return (default: 50)

**Expected Response (200):**

```json
{
  "success": true,
  "actions_count": 15,
  "actions": [
    {
      "_id": "64b8f12345678901234567ae",
      "admin_id": "1",
      "admin_username": "admin",
      "action_type": "user_verification",
      "action_description": "Verified user waste scan submission",
      "target_user_id": "1",
      "timestamp": "2025-07-24T10:30:00Z"
    }
  ]
}
```

### 3.8 Save Driver Data

**Method:** `POST`  
**URL:** `{{base_url}}/waste/drivers/save-data/`  
**Headers:** Include Authorization token (requires admin/staff permissions)  
**Body (raw JSON):**

```json
{
  "driver_id": "driver_001",
  "username": "johndriver",
  "full_name": "John Driver",
  "employee_id": "EMP001",
  "vehicle_number": "MH-01-AB-1234",
  "vehicle_type": "garbage_truck",
  "vehicle_capacity_kg": 5000,
  "status": "active",
  "latitude": 19.076,
  "longitude": 72.8777,
  "area": "Bandra West",
  "city": "Mumbai",
  "route_assigned": "Route_A_001",
  "shift_timing": "06:00-14:00",
  "contact_number": "+919876543210",
  "emergency_contact": "+919876543211"
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Driver data saved to MongoDB",
  "driver_id": "driver_001",
  "mongodb_id": "64b8f12345678901234567af"
}
```

### 3.9 Get Driver Data

**Method:** `GET`  
**URL:** `{{base_url}}/waste/drivers/get-data/`  
**Headers:** Include Authorization token

**Query Parameters:**

- `driver_id`: Get specific driver data (optional, if not provided returns all drivers)

**Expected Response (200):**

```json
{
  "success": true,
  "drivers_count": 5,
  "drivers": [
    {
      "_id": "64b8f12345678901234567af",
      "driver_id": "driver_001",
      "username": "johndriver",
      "full_name": "John Driver",
      "vehicle_number": "MH-01-AB-1234",
      "status": "active",
      "current_location": {
        "latitude": 19.076,
        "longitude": 72.8777,
        "area": "Bandra West",
        "city": "Mumbai"
      },
      "last_location_update": "2025-07-24T10:30:00Z"
    }
  ]
}
```

---

## 4. Notification Endpoints

### 4.1 Get User Notifications

**Method:** `GET`  
**URL:** `{{base_url}}/notifications/`  
**Headers:** Include Authorization token

**Expected Response (200):**

```json
[
  {
    "id": 1,
    "title": "Points Earned!",
    "message": "You earned 15 points for your recent scan",
    "notification_type": "points",
    "is_read": false,
    "created_at": "2025-07-24T10:30:00Z"
  }
]
```

### 4.2 Mark Notification as Read

**Method:** `PATCH`  
**URL:** `{{base_url}}/notifications/1/read/`  
**Headers:** Include Authorization token

**Expected Response (200):**

```json
{
  "message": "Notification marked as read"
}
```

---

## 5. Error Response Examples

### 5.1 Authentication Error (401)

```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 5.2 Permission Error (403)

```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 5.3 Validation Error (400)

```json
{
  "username": ["This field is required."],
  "password": ["This field may not be blank."]
}
```

### 5.4 Not Found Error (404)

```json
{
  "detail": "Not found."
}
```

### 5.5 Server Error (500)

```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## 6. Postman Environment Variables

Create these environment variables in Postman:

```json
{
  "base_url": "http://127.0.0.1:8000/api/v1",
  "auth_token": "your_token_here",
  "user_id": "1",
  "test_username": "testuser2025",
  "test_email": "testuser@safacycle.com",
  "test_password": "SafaCycle@123"
}
```

---

## 7. Test Scenarios

### 7.1 Complete User Journey

1. Register new user
2. Login with credentials
3. Get user profile
4. Get waste categories
5. Create waste scan
6. View user statistics
7. Check MongoDB analytics

### 7.2 Authentication Tests

1. Login with valid credentials ✅
2. Login with invalid credentials ❌
3. Access protected endpoint without token ❌
4. Access protected endpoint with invalid token ❌
5. Register with existing username ❌

### 7.3 Waste Management Tests

1. Create valid waste scan ✅
2. Create scan with invalid category ❌
3. Get user scans ✅
4. Get statistics ✅
5. Get dashboard data ✅

### 7.4 MongoDB Integration Tests

1. Check MongoDB connection status ✅
2. Verify analytics data is saved ✅
3. Retrieve user analytics ✅
4. Handle MongoDB connection failure ❌

### 7.5 Edge Cases

1. Large quantity waste scan (>100 items)
2. Very high ML confidence (>0.99)
3. Empty or null values in optional fields
4. Unicode characters in descriptions
5. Long text in description field

---

## 8. Performance Tests

### 8.1 Load Testing Scenarios

- 100 concurrent users registering
- 50 concurrent waste scans
- 200 concurrent dashboard requests
- Bulk data retrieval (>1000 records)

### 8.2 Response Time Expectations

- Authentication: < 500ms
- Waste scan creation: < 1000ms
- Statistics retrieval: < 800ms
- MongoDB operations: < 1200ms

---

## 9. Security Tests

### 9.1 Authentication Security

- SQL injection in login fields
- XSS attempts in user inputs
- Password brute force protection
- Token expiration handling

### 9.2 Authorization Tests

- Access other user's data
- Admin-only endpoints
- Rate limiting on API calls

---

## Notes for Postman Import

1. Create a new Postman collection named "SafaCycle Backend API"
2. Set up the environment variables listed above
3. Import each endpoint as a separate request
4. Group requests into folders by functionality
5. Add pre-request scripts for token management
6. Use tests tab to validate response structure and status codes

**Pre-request Script for Authentication:**

```javascript
// Set auth token from environment variable
pm.request.headers.add({
  key: "Authorization",
  value: "Token " + pm.environment.get("auth_token"),
});
```

**Test Script Example:**

```javascript
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Response has required fields", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property("id");
  pm.expect(jsonData).to.have.property("username");
});
```
