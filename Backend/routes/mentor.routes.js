const express = require("express");
const mentorRouter = express.Router();
const {
  setAvailability,
  getAvailability,
  deleteAvailability,
  getSessionRequests,
  approveSessionRequest,
  declineSessionRequest,
  getMySessions,
  giveFeedback,
  getAnalytics,
} = require("../controllers/mentor.controller.js");
const { protect, isMentor } = require("../middlewares/auth.middleware.js");

mentorRouter.use(protect);
mentorRouter.use(isMentor);

// Availability
mentorRouter.post("/availability", setAvailability);
mentorRouter.get("/availability", getAvailability);
mentorRouter.delete("/availability/:id", deleteAvailability);

// Session Requests
mentorRouter.get("/requests", getSessionRequests);
mentorRouter.post("/requests/:id/approve", approveSessionRequest);
mentorRouter.post("/requests/:id/decline", declineSessionRequest);

// Sessions
mentorRouter.get("/sessions", getMySessions);

// Feedback
mentorRouter.post("/feedback/:sessionId", giveFeedback);

// Analytics
mentorRouter.get("/analytics", getAnalytics);

module.exports = mentorRouter;
