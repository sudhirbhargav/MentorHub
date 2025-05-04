const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Helper to generate token
const generateToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

// @desc    Register user (Mentor or Mentee)
// @route   POST /api/auth/signup
const registerUser = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!["mentor", "mentee"].includes(role)) {
    return res.status(400).json({ message: "Role must be mentor or mentee" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(password, salt);

    const user = await User.create({ email, password: pass, role });

    if (user) {
      res.status(201).json({ message: "user signup successful!", user });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.info("-------------------------------");
    console.info("error => ", error);
    console.info("-------------------------------");
    res
      .status(500)
      .json({ message: "something went wrong, please signup later!" });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        message: "user login successful!",
        user,
        token: generateToken(user._id, email, user.role),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.info("-------------------------------");
    console.info("error => ", error);
    console.info("-------------------------------");
    res
      .status(500)
      .json({ message: "something went wrong, please login later!" });
  }
};

module.exports = { registerUser, loginUser };
