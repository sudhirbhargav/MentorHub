const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.log("DB Failed to connect");
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
