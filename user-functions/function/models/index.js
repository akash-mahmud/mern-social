const mongoose = require('mongoose');
const config = require('../config/config');

// Track the connection status
let isConnected = false;

async function connectToDatabase() {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  // If not connected, connect to MongoDB
  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    isConnected = true;
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error('Unable to connect to the database');
  }
}

module.exports = { connectToDatabase };
