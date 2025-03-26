import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import contestRoutes from "./routes/contestRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { fetchContests } from "./utils/fetchContests.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://contest-tracker-app-five.vercel.app',
    'https://contest-tracker-ggq2rjl25-mohammad-uzair-ansaris-projects.vercel.app'
  ],
  credentials: true
}));

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'https://contest-tracker-app-five.vercel.app',
      'https://contest-tracker-ggq2rjl25-mohammad-uzair-ansaris-projects.vercel.app'
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
});

// Make io available to routes
app.set('io', io);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s
})
.then(() => {
    console.log('Connected to MongoDB Atlas');
    // Initial contest fetch
    fetchContests();
    // Schedule periodic updates
    setInterval(fetchContests, 1800000); // 30 minutes
})
.catch((err) => {
    console.error('MongoDB Connection Error:', err);
});

// Add error handler
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

// Add disconnection handler
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);
  
  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// Routes
app.use("/api/contests", contestRoutes);
app.use("/api/admin", adminRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "ok",
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
