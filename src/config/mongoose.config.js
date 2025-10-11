const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to DB.");
  })
  .catch(err => {
    console.log(err?.message ?? "Failed DB connection");
  });

module.exports = mongoose;
