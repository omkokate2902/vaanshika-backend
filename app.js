import express from "express";
import cors from "cors";
import { connectDB } from './config/db.js';
import authRoutes from "./routes/authRoutes.js";
import familyRoutes from "./routes/familyRoutes.js";
import { protect } from "./middlewares/authMiddleware.js";

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: "*", // Allow requests from this origin
    credentials: true, // Allow cookies to be sent
  })
);

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Testing Branch Works!");
});

app.use("/api/auth", authRoutes);

app.use("/api/family", protect, familyRoutes);

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));