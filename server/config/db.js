import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();

export const connectDB = async () =>{
    try {
        const mongoURI = process.env.DATABASE_URL;
        if(!mongoURI){
            throw new Error("Cant find MONGO_URI");
        }
        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
}