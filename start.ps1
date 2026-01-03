# LMS Full Stack Start Script
# Run this from the project root to start both frontend and backend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting LMS - Full Stack" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set backend environment variables
$env:MONGODB_URL = "mongodb+srv://qasimfarooqi09_db_user:7RHUjNzyvU0wr07h@cluster0.z3aoi8e.mongodb.net/?appName=Cluster0"
$env:CLOUDINARY_CLOUD_NAME = "du5tamjvq"
$env:CLOUDINARY_API_KEY = "436371915728456"
$env:CLOUDINARY_API_SECRET = "KpGwuhhcwfxVFJ9GSlQypTyeWHo"
$env:CLOUDINARY_SECURE = "true"
$env:JWT_SECRET = "test_jwt_secret"
$env:JWT_EXPIRY = "24h"
$env:PORT = "5000"
$env:FRONTEND_URL = "http://localhost:5173"

Write-Host "[1/2] Starting Backend Server (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\Server'; npm run dev"

Write-Host "[2/2] Starting Frontend Server (Port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\Client'; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Both servers are starting!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Two new PowerShell windows have opened for the servers." -ForegroundColor Gray
