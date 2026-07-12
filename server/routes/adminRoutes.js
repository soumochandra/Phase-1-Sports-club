const express = require("express");

const {
  getAllAthletes,
  getAthleteById,
  updateAthleteStatus,
} = require("../controllers/adminController");

const verifyAdmin = require("../middleware/adminAuth");

const router = express.Router();

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

module.exports = router;