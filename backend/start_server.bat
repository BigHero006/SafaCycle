@echo off
echo Starting SafaCycle Django Backend Server
echo =======================================

cd /d "c:\Users\dell\SafaCycle\backend"

echo Checking Django installation...
python -c "import django; print('Django version:', django.get_version())"

echo.
echo Checking MongoDB connection...
python -c "
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safacycle_backend.settings')
django.setup()
from safacycle_backend.mongodb_service import mongodb_service
print('MongoDB connected:', mongodb_service.is_connected())
"

echo.
echo Starting Django development server...
echo Server will be available at: http://127.0.0.1:8000
echo API base URL: http://127.0.0.1:8000/api/v1/
echo.
echo Press Ctrl+C to stop the server
echo.

python manage.py runserver 8000
