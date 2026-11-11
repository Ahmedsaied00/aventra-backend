import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.routes'; // <-- Import the auth routes

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aventra';

// Middleware to parse incoming JSON requests
app.use(express.json());

// Test route to verify server is running
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to AVENTRA API Server!');
});

// Register API routes
app.use('/api/auth', authRoutes); // <-- Use the auth routes

// Connect to MongoDB and start the server
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB (Aventra Database)');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });