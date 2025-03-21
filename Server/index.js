import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import setupSocket from "./socket.js";
import messageRoutes from "./routes/MessageRoutes.js";
import channelRoutes from "./routes/ChannelRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS for frontend origin
app.use(
    cors({
        origin: [process.env.ORIGIN],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true
    })
);

// Temporary file storage
app.use("/uploads/profiles", express.static(path.join(__dirname, "temp/profiles")));
app.use("/uploads/files", express.static(path.join(__dirname, "temp/files")));

app.use(cookieParser());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/channel", channelRoutes);

const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

setupSocket(server);

mongoose.connect(databaseURL)
    .then(() => console.log("DB Connection Successful."))
    .catch(err => console.log(err.message));

