# MongoDB Connection Working - Test Commands

# 1. FIRST - Start Django server in another terminal:

python manage.py runserver 127.0.0.1:8000

# 2. THEN - Test MongoDB status (run this in current terminal):

curl -X GET http://127.0.0.1:8000/api/v1/waste/mongodb-status/

# Expected Response (if working):

{
"status": "connected",
"message": "MongoDB connection is active",
"database_info": {
"database_name": "safacycle_db",
"collections": 5,
"collection_names": ["scan_analytics", "ml_predictions", "users", "admin", "drivers"],
"total_documents": 5
}
}

# 3. Test User Registration:

curl -X POST http://127.0.0.1:8000/api/v1/auth/register/ \
 -H "Content-Type: application/json" \
 -d '{
"username": "test_user_2025",
"email": "test@safacycle.com",
"password": "SafaCycle@123",
"password_confirm": "SafaCycle@123",
"phone_number": "+919876543210"
}'

# 4. If registration works, your MongoDB connection is perfect!

# TROUBLESHOOTING:

# If you get "connection refused" - Django server isn't running

# If you get 500 error - Check Django logs in the server terminal

# If you get 404 - Check your URLs are correct

# Your MongoDB diagnostic showed:

# ✅ Basic connection successful

# ✅ Collections exist: users, drivers, ml_predictions, scan_analytics, admin

# ✅ Django integration working

# The issue is likely:

# 1. Django server not running

# 2. Wrong URL in test

# 3. Firewall blocking local connections
