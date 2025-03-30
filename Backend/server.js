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
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  
  let families = {}; // Store family-based user locations
  
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
  
    // User joins a family room
    socket.on("joinFamily", ({ userId, familyId }) => {
      socket.join(familyId);
      console.log(`${userId} joined family ${familyId}`);
  
      // Ensure family exists
      if (!families[familyId]) {
        families[familyId] = {};
      }
  
      families[familyId][userId] = { latitude: null, longitude: null };
    });
  
    // Receive and broadcast location updates within the family
    socket.on("updateLocation", ({ userId, familyId, latitude, longitude }) => {
      if (families[familyId]) {
        families[familyId][userId] = { latitude, longitude };
  
        console.log(`Location updated for ${userId} in Family ${familyId}: (${latitude}, ${longitude})`);
  
        // Send updates only to this family
        io.to(familyId).emit("usersData", families[familyId]);
      }
    });
  
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      // Remove user from families (optional)
      Object.keys(families).forEach((familyId) => {
        Object.keys(families[familyId]).forEach((userId) => {
          if (families[familyId][userId].socketId === socket.id) {
            delete families[familyId][userId];
          }
        });
      });
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
