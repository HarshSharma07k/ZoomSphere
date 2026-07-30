import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is required");
    }

    return mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
};