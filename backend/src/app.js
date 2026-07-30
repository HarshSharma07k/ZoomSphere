import express from "express";
import { createServer } from "node:http";

import { connectToSocket } from "./controllers/socketManager.js";

import cors from "cors";
import userRoutes from "./routes/users.routes.js";
import { connectDB } from "./db/index.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);


app.set("port", (process.env.PORT || 8000))
const allowedOrigins = (process.env.CORS_ORIGIN ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.set("trust proxy", 1);
app.use(cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: allowedOrigins.length > 0
}));
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.get("/healthz", (req, res) => {
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        sockets: io.engine.clientsCount
    });
});

app.use("/api/v1/users", userRoutes);

export const start = async () => {
    const connectionDb = await connectDB();

    console.log(`MONGO Connected DB Host: ${connectionDb.connection.host}`)
    server.listen(app.get("port"), () => {
        console.log(`LISTENING ON PORT ${app.get("port")}`)
    });
}

export default app;