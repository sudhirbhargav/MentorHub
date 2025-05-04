const Availability = require("../models/availability.model.js");
const Session = require("../models/session.model.js");
const User = require("../models/user.model.js");

// @desc    get all mentors
// @route   GET /api/mentee/mentors
// @access  Mentee only
const getAllMentors = async (req, res) => {
  try {
    const mentors = await User.find({ role: "mentor" }).select("-password");
    res.json(mentors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    get mentors availability
// @route   GET /api/mentee/mentors/:mentorId/availability
// @access  Mentee only
const getMentorAvailability = async (req, res) => {
  const { mentorId } = req.params;
  try {
    const slots = await Availability.find({ mentor: mentorId });
    res.json(slots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    request session
// @route   POST /api/mentee/sessions
// @access  Mentee only
const requestSession = async (req, res) => {
  const { mentorId, timeSlot, notes } = req.body;
  try {
    const newSession = new Session({
      mentor: mentorId,
      mentee: req.user._id,
      timeSlot,
      status: "pending",
      notes,
    });
    await newSession.save();
    res.status(201).json(newSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    get my sessions
// @route   GET /api/mentee/sessions
// @access  Mentee only
const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({ mentee: req.user._id }).populate(
      "mentor",
      "name email"
    );
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    give feedback
// @route   POST /api/mentee/feedback/:sessionId
// @access  Mentee only
const giveFeedback = async (req, res) => {
  const { sessionId } = req.params;
  const { menteeRating, menteeComments } = req.body;
  try {
    const session = await Session.findOne({
      _id: sessionId,
      mentee: req.user._id,
    });
    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.status !== "completed") {
      return res
        .status(400)
        .json({ message: "Feedback allowed only after session completion" });
    }
    session.feedback.menteeRating = menteeRating;
    session.feedback.menteeComments = menteeComments;
    await session.save();
    res.json({ message: "Feedback saved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    get session analytics
// @route   GET /api/mentee/analytics
// @access  Mentee only
const getAnalytics = async (req, res) => {
  try {
    const sessions = await Session.find({
      mentee: req.user._id,
      status: "completed",
    }).populate("mentor", "name email");

    const analytics = sessions.map((session) => ({
      mentor: {
        name: session.mentor.name,
        email: session.mentor.email,
      },
      sessionDate: session.slot,
      myRatingForMentor: session.feedback.menteeRating,
      myCommentForMentor: session.feedback.mentorComments,
      mentorFeedback: {
        rating: session.feedback.mentorRating,
        comments: session.feedback.mentorComments,
      },
    }));

    res.json({ totalSessions: sessions.length, analytics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllMentors,
  getMentorAvailability,
  requestSession,
  getMySessions,
  giveFeedback,
  getAnalytics,
};
