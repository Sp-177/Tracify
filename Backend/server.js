import dotenv from "dotenv";
import { ConnectDB } from "./config/dbConfig.js";
import { app, port } from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config({ path: "./.env" });

// Create HTTP server for Express app (Required for Socket.io)
const server = createServer(app);

// Initialize Socket.io
const io = new Server(server, { 
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:5174' , '*'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
        credentials: true
    }
});

// WebSocket Connection Handling
io.on("connection", (socket) => {
    console.log(`⚡ User connected: ${socket.id}`);

    socket.on("sendMessage", (data) => {
        console.log("📩 Message received:", data);
        io.emit("receiveMessage", data); // Broadcast message to all clients
    });

    socket.on("disconnect", () => {
        console.log(`❌ User disconnected: ${socket.id}`);
    });
});

// Connect to Database & Start Server
ConnectDB()
    .then(() => {
        server.listen(port, () => {
            console.log(`✅ Server is running at: http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error("❌ Database Connection Failed:", error);
        process.exit(1); // Exit process if DB connection fails
    });

// Export io to use it elsewhere in your app
export { io };
