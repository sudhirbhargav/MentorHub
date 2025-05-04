const express = require('express');
const { registerUser, loginUser } = require('../controllers/auth.controller.js');
const authRouter = express.Router();

// Signup route
authRouter.post('/signup', registerUser);

// Login route
authRouter.post('/login', loginUser);

module.exports = authRouter;