import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDB = async (req, res) => {
    try {
        const connectionDB = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);

        return connectionDB;
    } catch (error) {
        console.log(error);
    }
}