@echo off
echo SafaCycle Backend Database Setup
echo ================================

cd /d "c:\Users\dell\SafaCycle\backend"

echo.
echo Step 1: Testing Django setup...
python manage.py check

echo.
echo Step 2: Running MongoDB initialization...
python manage.py init_mongodb

echo.
echo Step 3: Testing database creation...
python test_setup.py

echo.
echo Step 4: Starting Django server...
echo You can now test the API endpoints!
python manage.py runserver 8000

pause
