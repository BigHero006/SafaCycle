# SafaCycle MongoDB Connection Test - PowerShell Script
# This script will properly test your MongoDB connection

Write-Host "🚀 SafaCycle MongoDB Connection Test" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Test 1: Check if server is running
Write-Host "`n🔧 Testing Django Server..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/waste/mongodb-status/" -Method GET -TimeoutSec 5
    
    Write-Host "✅ MongoDB Connection Working!" -ForegroundColor Green
    Write-Host "📊 Database Info:" -ForegroundColor Cyan
    Write-Host ($response | ConvertTo-Json -Depth 3) -ForegroundColor White
    
    # Test 2: Register a test user
    Write-Host "`n🔧 Testing User Registration..." -ForegroundColor Yellow
    
    $testUser = @{
        username = "test_user_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
        email = "test@safacycle.com"
        password = "SafaCycle@123"
        password_confirm = "SafaCycle@123"
        phone_number = "+919999999999"
    } | ConvertTo-Json
    
    $headers = @{
        'Content-Type' = 'application/json'
    }
    
    try {
        $registerResponse = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/auth/register/" -Method POST -Body $testUser -Headers $headers -TimeoutSec 10
        
        Write-Host "✅ User Registration Working!" -ForegroundColor Green
        Write-Host "👤 User: $($registerResponse.username)" -ForegroundColor Cyan
        Write-Host "🔑 Token: $($registerResponse.token.Substring(0,20))..." -ForegroundColor Cyan
        
        # Test 3: Save user to MongoDB
        Write-Host "`n🔧 Testing MongoDB User Save..." -ForegroundColor Yellow
        
        $mongoHeaders = @{
            'Authorization' = "Token $($registerResponse.token)"
            'Content-Type' = 'application/json'
        }
        
        $mongoResponse = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/waste/users/save-to-mongodb/" -Method POST -Headers $mongoHeaders -TimeoutSec 10
        
        Write-Host "✅ MongoDB Save Working!" -ForegroundColor Green
        Write-Host "🗃️ MongoDB ID: $($mongoResponse.mongodb_id)" -ForegroundColor Cyan
        
        Write-Host "`n🎉 ALL TESTS PASSED! Your MongoDB connection is working perfectly!" -ForegroundColor Green
        Write-Host "💡 You can now use the test cases in MONGODB_POPULATE_TESTS.md" -ForegroundColor Yellow
        
    } catch {
        Write-Host "❌ User registration failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Cannot connect to Django server!" -ForegroundColor Red
    Write-Host "💡 Make sure Django server is running:" -ForegroundColor Yellow
    Write-Host "   python manage.py runserver 127.0.0.1:8000" -ForegroundColor White
}

Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. If tests passed, your MongoDB is working!" -ForegroundColor White
Write-Host "2. Use Postman or curl with the test cases in MONGODB_POPULATE_TESTS.md" -ForegroundColor White
Write-Host "3. Check MongoDB Atlas dashboard to see your data" -ForegroundColor White
