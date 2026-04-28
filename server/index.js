const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Nike App Backend is running' });
});

// Products Route Placeholder
app.get('/api/products', (req, res) => {
  // Sample data returned
  res.json({
    success: true,
    count: 2,
    data: [
      { id: 1, name: 'Air Jordan 1', price: 180 },
      { id: 2, name: 'Nike Air Max 270', price: 150 }
    ]
  });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Uncomment when MongoDB URI is available
    /*
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
    */
    console.log('MongoDB connection skipped for demo purposes');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
