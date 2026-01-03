# LMS Backend Start Script
# Run this script to start the backend server with all environment variables

# Set environment variables
$env:MONGODB_URL="mongodb+srv://qasimfarooqi09_db_user:7RHUjNzyvU0wr07h@cluster0.z3aoi8e.mongodb.net/?appName=Cluster0"
$env:CLOUDINARY_CLOUD_NAME="du5tamjvq"
$env:CLOUDINARY_API_KEY="436371915728456"
$env:CLOUDINARY_API_SECRET="KpGwuhhcwfxVFJ9GSlQypTyeWHo"
$env:CLOUDINARY_SECURE="true"
$env:JWT_SECRET="test_jwt_secret"
$env:JWT_EXPIRY="24h"
$env:PORT="5000"
$env:FRONTEND_URL="http://localhost:5173"

# Start the server with nodemon
npm run dev
