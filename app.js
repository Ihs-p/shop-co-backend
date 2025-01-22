const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// CORS Configuration
app.use(cors({
  origin: ['https://shop-co-frontend-chi.vercel.app','http://localhost:3000'], // Your client URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// MongoDB connection
const connectDB = async () => { 
  try {
    await mongoose.connect(process.env.db_uri);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Exit process with failure
  }
};

// Call connectDB
connectDB();

// Import models
require("./models/Category");
require("./models/Style");
require("./models/User");
require("./models/Product");

// API routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/auth', require('./routes/userRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server started on http://localhost:${process.env.PORT}`);
});
