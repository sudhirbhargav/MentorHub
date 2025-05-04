const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

// Protect routes
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Role check
const isMentor = (req, res, next) => {
  if (req.user && req.user.role === "mentor") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Access denied: Mentor role required" });
  }
};

const isMentee = (req, res, next) => {
  if (req.user && req.user.role === "mentee") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Access denied: Mentee role required" });
  }
};

module.exports = { protect, isMentor, isMentee };
