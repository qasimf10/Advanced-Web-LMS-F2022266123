import mongoose from 'mongoose';

const MONGODB_URL = 'mongodb+srv://qasimfarooqi09_db_user:7RHUjNzyvU0wr07h@cluster0.z3aoi8e.mongodb.net/?appName=Cluster0';

async function makeAdmin() {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log('Connected to MongoDB');

        const result = await mongoose.connection.db.collection('users').updateOne(
            { email: 'qasimfarooqi09@gmail.com' },
            { $set: { role: 'ADMIN' } }
        );

        console.log('Update result:', result);

        if (result.modifiedCount > 0) {
            console.log('✅ User qasimfarooqi09@gmail.com is now ADMIN!');
        } else if (result.matchedCount > 0) {
            console.log('✅ User was already ADMIN');
        } else {
            console.log('❌ User not found');
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

makeAdmin();
