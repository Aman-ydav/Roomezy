import mongoose from "mongoose";
import {DB_NAME} from "../constant.js";



const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\nMongoDB connected: ${connectionInstance.connection.host}`);
    }
    catch(err){
        console.log("MongoDB connection FAILED:", err);
        process.exit(1);
    }
}

export default connectDB;