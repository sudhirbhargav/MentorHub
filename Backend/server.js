require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
connectDB();

const app = express();

app.use(cors()); // Allow requests from your frontend origin
app.use(express.json()); // To accept JSON data in req.body

app.get("/", (req, res) => res.send("MentorHub API Running"));

// Define Routes (You'll create these files later)
app.use('/api/auth', require('./routes/auth.routes.js'));
app.use('/api/mentor', require('./routes/mentor.routes.js'));
app.use('/api/mentee', require('./routes/mentee.routes.js'));
// app.use('/api/google', require('./routes/google')); // For Google OAuth/Meet

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
