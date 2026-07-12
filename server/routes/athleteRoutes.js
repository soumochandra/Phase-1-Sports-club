const express = require("express");

const athleteUpload = require(
  "../middleware/uploadMiddleware"
);

const {
  registerAthlete,
} = require("../controllers/athleteController");

const router = express.Router();

router.post(
  "/register",
  athleteUpload,
  registerAthlete
);

module.exports = router;