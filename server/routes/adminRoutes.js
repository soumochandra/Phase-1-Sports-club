const express = require("express");

const {
  getAllAthletes,
  getAthleteById,
  updateAthleteStatus,
} = require("../controllers/adminController");

const {
  getAllCoaches,
  getCoachById,
  updateCoachStatus,
} = require("../controllers/adminCoachController");

const {
  assignAthletesToCoach,
  getAssignedAthletes,
  getAvailableAthletes,
  removeAssignedAthlete,
} = require("../controllers/coachAssignmentController");

const verifyAdmin = require("../middleware/adminAuth");

const router = express.Router();

/* ==========================================================
   Athlete Management
========================================================== */

router.get(
  "/athletes",
  verifyAdmin,
  getAllAthletes
);

router.get(
  "/athletes/:id",
  verifyAdmin,
  getAthleteById
);

router.patch(
  "/athletes/:id/status",
  verifyAdmin,
  updateAthleteStatus
);

/* ==========================================================
   Coach Management
========================================================== */

router.get(
  "/coaches",
  verifyAdmin,
  getAllCoaches
);

router.get(
  "/coaches/:id",
  verifyAdmin,
  getCoachById
);

router.patch(
  "/coaches/:id/status",
  verifyAdmin,
  updateCoachStatus
);

/* ==========================================================
   Athlete ↔ Coach Assignment
========================================================== */

// Get all unassigned athletes
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

// Assign one or more athletes to a coach
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