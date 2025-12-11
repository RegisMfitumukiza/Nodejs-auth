import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const databaseConnection = async () => {

    try {
        const uri = process.env.MONGO_URI;

        if (!uri) {
            throw new Error("Missing MONGO_URI in .env file");
        }

        await mongoose.connect(uri);
        console.log('MongoDb has connected successfully!');

    } catch (error) {
        console.error('MongoDb has failed to connect', error.message);
        process.exit(1);
    }
}

export default databaseConnection;