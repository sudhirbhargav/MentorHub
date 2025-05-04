const express = require("express");
const menteeRouter = express.Router();
const {
  getAllMentors,
  getMentorAvailability,
  requestSession,
  getMySessions,
  giveFeedback,
  getAnalytics,
} = require("../controllers/mentee.controller.js");
const { protect, isMentee } = require("../middlewares/auth.middleware.js");

menteeRouter.use(protect);
menteeRouter.use(isMentee);

// Browse mentors
menteeRouter.get("/mentors", getAllMentors);
menteeRouter.get("/mentors/:mentorId/availability", getMentorAvailability);

// Request session
menteeRouter.post("/sessions", requestSession);

// My sessions
menteeRouter.get("/sessions", getMySessions);

// Feedback
menteeRouter.post("/feedback/:sessionId", giveFeedback);

// Analytics
menteeRouter.get("/analytics", getAnalytics);

module.exports = menteeRouter;
