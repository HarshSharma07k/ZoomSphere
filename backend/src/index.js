import dotenv from "dotenv";
import { start } from "./app.js";

dotenv.config({
    path: '../.env'
})

await start();