# MongoDB Database Population Test Cases

## Overview

These test cases will create actual users, admin actions, and driver data in your MongoDB database, not just test the connection.

## Prerequisites

1. Django server running on http://127.0.0.1:8000
2. MongoDB Atlas connection active
3. Postman or curl for API testing

---

## 🗄️ MongoDB Database Creation Test Cases

### Step 1: Create Test Users & Populate MongoDB

#### Test Case 1.1: Register Multiple Users

**Purpose:** Create users in Django and automatically populate MongoDB users collection

**POST** `http://127.0.0.1:8000/api/v1/auth/register/`

**Headers:**

```
Content-Type: application/json
```

**Test User 1 - Regular User:**

```json
{
  "username": "john_doe_2025",
  "email": "john.doe@safacycle.com",
  "password": "SafaCycle@123",
  "password_confirm": "SafaCycle@123",
  "phone_number": "+919876543210"
}
```

**Test User 2 - Environmental Activist:**

```json
{
  "username": "eco_warrior",
  "email": "eco.warrior@safacycle.com",
  "password": "SafaCycle@123",
  "password_confirm": "SafaCycle@123",
  "phone_number": "+919876543211"
}
```

**Test User 3 - Community Leader:**

```json
{
  "username": "community_leader",
  "email": "leader@safacycle.com",
  "password": "SafaCycle@123",
  "password_confirm": "SafaCycle@123",
  "phone_number": "+919876543212"
}
```

**Expected Result:** Each user registration should return Status 201 with user data, token, and **automatic MongoDB save**:

```json
{
  "user": { "username": "john_doe_2025", "email": "john.doe@safacycle.com" },
  "token": "your_auth_token_here",
  "message": "User registered successfully",
  "mongodb_saved": true,
  "mongodb_id": "64b8f12345678901234567ad"
}
```

#### Test Case 1.2: Login and Get Tokens (Now Auto-Saves to MongoDB!)

**Purpose:** Get authentication tokens for each user and automatically save credentials to MongoDB

**POST** `http://127.0.0.1:8000/api/v1/auth/login/`

**🆕 UPDATED:** Login now automatically saves user data to MongoDB! No separate step needed.

**Login Data for each user:**

**User 1 Login (Username):**

```json
{
  "username": "john_doe_2025",
  "password": "SafaCycle@123"
}
```

**User 1 Login (Email - Alternative):**

```json
{
  "email": "john.doe@safacycle.com",
  "password": "SafaCycle@123"
}
```

**User 2 Login:**

```json
{
  "username": "eco_warrior",
  "password": "SafaCycle@123"
}
```

**User 3 Login:**

```json
{
  "username": "community_leader",
  "password": "SafaCycle@123"
}
```

**Expected Result:** Each login should return:

```json
{
  "token": "your_auth_token_here",
  "user": { "username": "john_doe_2025", "email": "john.doe@safacycle.com" },
  "message": "Login successful",
  "mongodb_saved": true,
  "mongodb_id": "64b8f12345678901234567ad"
}
```

**Save these tokens for next steps:**

- john_doe_2025 → Token_1
- eco_warrior → Token_2
- community_leader → Token_3

---

### Step 2: Verify MongoDB Users Collection (Optional - Already Auto-Saved!)

**🎉 GOOD NEWS:** Users are now automatically saved to MongoDB during registration and login!

#### Test Case 2.1: Verify Auto-Saved Users in MongoDB (Optional)

**Purpose:** Confirm users are automatically saved in MongoDB (they should already be there!)

**GET** `http://127.0.0.1:8000/api/v1/waste/users/get-from-mongodb/`

**Headers:**

```
Authorization: Token TOKEN_FROM_LOGIN
```

**Expected Result:** User data from MongoDB with ObjectId - should already exist because of auto-save feature!

**⚠️ Note:** The old manual save endpoint `/api/v1/waste/users/save-to-mongodb/` is still available if you need it, but it's no longer necessary since users are automatically saved during registration and login.

---

### Step 3: Create Admin Users & Actions

#### Test Case 3.1: Create Admin User

**Purpose:** Create an admin user manually in Django admin or through API

First, make one of your users an admin by running this in Django shell:

```python
# Run this in terminal: python manage.py shell
from django.contrib.auth import get_user_model
User = get_user_model()
user = User.objects.get(username='john_doe_2025')
user.is_staff = True
user.is_superuser = True
user.save()
```

#### Test Case 3.2: Create Admin Actions in MongoDB

**Purpose:** Populate admin collection with real admin actions

**POST** `http://127.0.0.1:8000/api/v1/waste/admin/save-action/`

**Headers:**

```
Authorization: Token ADMIN_USER_TOKEN
Content-Type: application/json
```

**Admin Action 1 - User Verification:**

```json
{
  "action_type": "user_verification",
  "description": "Verified eco_warrior user profile and waste scan submissions",
  "target_user_id": "2"
}
```

**Admin Action 2 - System Maintenance:**

```json
{
  "action_type": "system_maintenance",
  "description": "Updated waste category points system",
  "target_user_id": null
}
```

**Admin Action 3 - Content Moderation:**

```json
{
  "action_type": "content_moderation",
  "description": "Approved community_leader waste collection event",
  "target_user_id": "3"
}
```

---

### Step 4: Create Driver Data

#### Test Case 4.1: Add Multiple Drivers

**Purpose:** Populate drivers collection with vehicle and driver information

**POST** `http://127.0.0.1:8000/api/v1/waste/drivers/save-data/`

**Headers:**

```
Authorization: Token ADMIN_USER_TOKEN
Content-Type: application/json
```

**Driver 1 - Bandra Route:**

```json
{
  "driver_id": "DRV001",
  "username": "rajesh_driver",
  "full_name": "Rajesh Kumar",
  "employee_id": "EMP2025001",
  "vehicle_number": "MH-01-AB-1234",
  "vehicle_type": "garbage_truck",
  "vehicle_capacity_kg": 5000,
  "status": "active",
  "latitude": 19.0596,
  "longitude": 72.8295,
  "area": "Bandra West",
  "city": "Mumbai",
  "route_assigned": "Route_BW_001",
  "shift_timing": "06:00-14:00",
  "contact_number": "+919876543220",
  "emergency_contact": "+919876543221"
}
```

**Driver 2 - Andheri Route:**

```json
{
  "driver_id": "DRV002",
  "username": "suresh_driver",
  "full_name": "Suresh Patil",
  "employee_id": "EMP2025002",
  "vehicle_number": "MH-01-CD-5678",
  "vehicle_type": "recyclable_truck",
  "vehicle_capacity_kg": 3000,
  "status": "active",
  "latitude": 19.1136,
  "longitude": 72.8697,
  "area": "Andheri East",
  "city": "Mumbai",
  "route_assigned": "Route_AE_002",
  "shift_timing": "14:00-22:00",
  "contact_number": "+919876543222",
  "emergency_contact": "+919876543223"
}
```

**Driver 3 - Borivali Route:**

```json
{
  "driver_id": "DRV003",
  "username": "amit_driver",
  "full_name": "Amit Sharma",
  "employee_id": "EMP2025003",
  "vehicle_number": "MH-01-EF-9012",
  "vehicle_type": "organic_waste_truck",
  "vehicle_capacity_kg": 4000,
  "status": "active",
  "latitude": 19.2307,
  "longitude": 72.8567,
  "area": "Borivali West",
  "city": "Mumbai",
  "route_assigned": "Route_BV_003",
  "shift_timing": "06:00-14:00",
  "contact_number": "+919876543224",
  "emergency_contact": "+919876543225"
}
```

---

### Step 5: Create Waste Scan Data

#### Test Case 5.1: Create Initial Waste Categories & Items

**Purpose:** Ensure categories exist before creating scans

First, run this Django command to create basic data:

```bash
python manage.py shell
```

```python
from waste_management.models import WasteCategory, WasteItem

# Create categories
plastic_cat = WasteCategory.objects.create(
    name="Plastic Bottles",
    category_type="recyclable",
    description="PET plastic bottles",
    points_per_item=5
)

paper_cat = WasteCategory.objects.create(
    name="Paper",
    category_type="recyclable",
    description="Newspapers, magazines, office paper",
    points_per_item=3
)

organic_cat = WasteCategory.objects.create(
    name="Organic Waste",
    category_type="organic",
    description="Food waste, garden waste",
    points_per_item=2
)

# Create items
WasteItem.objects.create(
    name="500ml Water Bottle",
    category=plastic_cat,
    description="Standard 500ml plastic water bottle",
    estimated_weight_grams=25
)

WasteItem.objects.create(
    name="Newspaper",
    category=paper_cat,
    description="Daily newspaper",
    estimated_weight_grams=50
)

WasteItem.objects.create(
    name="Food Scraps",
    category=organic_cat,
    description="Kitchen food waste",
    estimated_weight_grams=100
)
```

#### Test Case 5.2: Create Waste Scans (This will populate scan_analytics collection)

**Purpose:** Create actual waste scans that auto-save to MongoDB

**POST** `http://127.0.0.1:8000/api/v1/waste/scans/create/`

**User 1 Scan - Plastic Bottles:**

```json
{
  "category": 1,
  "item": 1,
  "quantity": 5,
  "estimated_weight_grams": 125,
  "description": "Found plastic bottles near Marine Drive beach",
  "location": "Marine Drive, Mumbai",
  "ml_prediction": "plastic_bottle",
  "ml_confidence": 0.95
}
```

**User 2 Scan - Paper Waste:**

```json
{
  "category": 2,
  "item": 2,
  "quantity": 10,
  "estimated_weight_grams": 500,
  "description": "Collected newspapers from office building",
  "location": "BKC, Mumbai",
  "ml_prediction": "paper",
  "ml_confidence": 0.88
}
```

**User 3 Scan - Organic Waste:**

```json
{
  "category": 3,
  "item": 3,
  "quantity": 3,
  "estimated_weight_grams": 300,
  "description": "Food waste from community kitchen",
  "location": "Dharavi, Mumbai",
  "ml_prediction": "organic",
  "ml_confidence": 0.92
}
```

---

### Step 6: Verify MongoDB Database Population

#### Test Case 6.1: Check All Collections

**Purpose:** Verify all collections have data

**GET** `http://127.0.0.1:8000/api/v1/waste/mongodb-status/`

**Expected Result:**

```json
{
  "status": "connected",
  "message": "MongoDB connection is active",
  "database_info": {
    "database_name": "safacycle_db",
    "collections": 5,
    "collection_names": [
      "scan_analytics",
      "ml_predictions",
      "users",
      "admin",
      "drivers"
    ],
    "collection_counts": {
      "scan_analytics": 3,
      "ml_predictions": 3,
      "users": 3,
      "admin": 3,
      "drivers": 3
    },
    "total_documents": 15
  }
}
```

#### Test Case 6.2: Verify in MongoDB Atlas

1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com/)
2. Navigate to cluster `sajmangodb`
3. Click "Browse Collections"
4. Check database `safacycle_db`
5. Verify each collection has documents:
   - **users**: 3 users (john_doe_2025, eco_warrior, community_leader)
   - **admin**: 3 admin actions
   - **drivers**: 3 drivers with different routes
   - **scan_analytics**: 3 waste scans
   - **ml_predictions**: 3 ML predictions

---

## 🎯 Expected Final Database State

After running all test cases, your MongoDB should contain:

### users Collection:

- 3 user documents with profile information
- ObjectIds for each user
- Registration dates, activity data

### admin Collection:

- 3 admin action documents
- Different action types (verification, maintenance, moderation)
- Timestamps and admin user information

### drivers Collection:

- 3 driver documents with vehicle information
- Different routes across Mumbai
- Contact information and shift timings

### scan_analytics Collection:

- 3 waste scan documents
- Different waste categories
- ML prediction data and confidence scores

### ml_predictions Collection:

- 3 ML prediction documents
- Model predictions for different waste types
- Confidence scores

---

## 🛠️ Troubleshooting

### If Registration Fails (400 Bad Request):

1. Check password requirements (must contain letters, numbers, special chars)
2. Ensure username is unique
3. Verify email format is valid
4. Check phone number format

### If MongoDB Save Fails:

1. Check MongoDB connection with status endpoint
2. Verify user has authentication token
3. Run database initialization script if needed

### If Admin Actions Fail:

1. Ensure user has staff/admin privileges
2. Check user permissions in Django admin

### If Driver Creation Fails:

1. Verify admin permissions
2. Check all required fields are provided
3. Ensure latitude/longitude are valid numbers

**Run these test cases in order, and you'll have a fully populated MongoDB database with real user data!** 🚀
