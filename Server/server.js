import cloudinary from 'cloudinary';

import connectionToDB from './config/dbConnection.js';
import app from './app.js';

const PORT= process.env.PORT || 5000;

/**
 * @Cloudinary configuration for file storage service
 */
cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    secure:process.env.CLOUDINARY_SECURE,
})

/**
 * Test Cloudinary connection
 */
const testCloudinaryConnection = async () => {
    try {
        const result = await cloudinary.v2.api.ping();
        console.log('✅ Cloudinary connection successful:', result);
        return true;
    } catch (error) {
        console.error('❌ Cloudinary connection failed:', error.message);
        return false;
    }
};

app.listen(PORT, async () => {
    // Test MongoDB connection
    await connectionToDB();
    
    // Test Cloudinary connection
    await testCloudinaryConnection();
    
    console.log(`App is running at http://localhost:${PORT}`);
})