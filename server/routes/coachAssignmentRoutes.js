const express = require("express");

const verifyAdmin = require("../middleware/adminAuth");

const {
  assignAthletesToCoach,
  getAssignedAthletes,
  getAvailableAthletes,
  removeAssignedAthlete,
} = require("../controllers/coachAssignmentController");

const router = express.Router();

// Get all athletes who are not assigned to any coach
router.get(
  "/coaches/:coachId/available-athletes",
  verifyAdmin,
  getAvailableAthletes
);

// Get athletes assigned to a coach
router.get(
  "/coaches/:coachId/assigned-athletes",
  verifyAdmin,
  getAssignedAthletes
);

// Assign athletes to coach
router.post(
  "/coaches/:coachId/assign",
  verifyAdmin,
  assignAthletesToCoach
);

// Remove athlete from coach
router.delete(
  "/coaches/:coachId/remove/:athleteId",
  verifyAdmin,
  removeAssignedAthlete
);

module.exports = router;