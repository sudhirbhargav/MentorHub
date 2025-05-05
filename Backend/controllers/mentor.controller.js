const Availability = require("../models/availability.model.js");
const Session = require("../models/session.model.js");

// Function to mock Google Meet link
const generateMockGoogleMeetLink = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const part = () =>
    Array.from(
      { length: 3 },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  return `https://meet.google.com/${part()}-${part()}-${part()}`;
};

// @desc    Set availability slots
// @route   POST /api/mentor/availability
// @access  Mentor only
const setAvailability = async (req, res) => {
  const { slots } = req.body; // Expect array of slots [{ dayOfWeek, startTime, endTime }]

  if (!slots || !Array.isArray(slots)) {
    return res.status(400).json({ message: "Slots must be an array" });
  }

  try {
    // Optionally clear previous availability if needed:
    // await Availability.deleteMany({ mentor: req.user._id });

    const newSlots = slots?.map((slot) => ({
      mentor: req.user._id,
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
    }));

    const saved = await Availability.insertMany(newSlots);
    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get my availability
// @route   GET /api/mentor/availability
// @access  Mentor only
const getAvailability = async (req, res) => {
  try {
    console.info("-------------------------------");
    console.info("req.user._id => ", req.user._id);
    console.info("-------------------------------");
    const slots = await Availability.find({ mentor: req.user._id });
    res.json(slots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete my availability
// @route   DELETE /api/mentor/availability/:id
// @access  Mentor only
const deleteAvailability = async (req, res) => {
  const { id } = req.params;
  try {
    const slot = await Availability.findOneAndDelete({
      _id: id,
      mentor: req.user._id,
    });
    console.info("-------------------------------");
    console.info("slot  => ", slot);
    console.info("-------------------------------");
    if (!slot) return res.status(404).json({ message: "Slot not found" });
    res.json({ message: "Slot deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    get all requested sessions
// @route   GET /api/mentor/requests
// @access  Mentor only
const getSessionRequests = async (req, res) => {
  try {
    const requests = await Session.find({
      mentor: req.user._id,
      status: "pending",
    }).populate("mentee", "name email");
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    approve sessions
// @route   POST /api/mentor/requests/:id/approve
// @access  Mentor only
const approveSessionRequest = async (req, res) => {
  const { sessionId } = req.params;
  try {
    const session = await Session.findOne({
      _id: sessionId,
      mentor: req.user._id,
    });
    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.status !== "pending")
      return res.status(400).json({ message: "Session is not pending" });

    session.status = "approved";
    session.videoLink = generateMockGoogleMeetLink(); // Generate the mocked link here
    await session.save();

    res.json({ message: "Session approved", session });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    decline sessions
// @route   POST /api/mentor/requests/:id/decline
// @access  Mentor only
const declineSessionRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const session = await Session.findOne({ _id: id, mentor: req.user._id });
    if (!session) return res.status(404).json({ message: "Session not found" });
    session.status = "declined";
    await session.save();
    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    get approved sessions
// @route   GET /api/mentor/sessions
// @access  Mentor only
const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      mentor: req.user._id,
      status: "approved",
    }).populate("mentee", "name email");
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    give feedback
// @route   POST /api/mentor/feedback/:sessionId
// @access  Mentor only
const giveFeedback = async (req, res) => {
  const { sessionId } = req.params;
  const { mentorRating, mentorComments } = req.body;
  try {
    const session = await Session.findOne({
      _id: sessionId,
      mentor: req.user._id,
    });
    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.status !== "completed") {
      return res
        .status(400)
        .json({ message: "Feedback allowed only after session completion" });
    }
    session.feedback.mentorRating = mentorRating;
    session.feedback.mentorComments = mentorComments;
    await session.save();
    res.json({ message: "Feedback saved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    get session analytics
// @route   GET /api/mentor/analytics
// @access  Mentor only
const getAnalytics = async (req, res) => {
  try {
    const sessions = await Session.find({
      mentor: req.user._id,
      status: "completed",
    });
    const sessionCount = sessions.length;
    const ratings = sessions
      .map((s) => s.feedback.menteeRating)
      .filter(Boolean);
    const avgRating = ratings.length
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
      : "N/A";
    res.json({
      totalSessions: sessionCount,
      averageRating: avgRating,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  setAvailability,
  getAvailability,
  deleteAvailability,
  getSessionRequests,
  approveSessionRequest,
  declineSessionRequest,
  getMySessions,
  giveFeedback,
  getAnalytics,
};
