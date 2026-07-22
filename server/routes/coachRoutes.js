const express = require("express");

const uploadMiddleware = require("../middleware/uploadMiddleware");
const {
  registerCoach,
  loginCoach,
  getCoachDashboard,
  getCoachProfile,
} = require("../controllers/coachController");

const router = express.Router();

router.post("/register", uploadMiddleware, registerCoach);
router.post("/portal/login", loginCoach);
router.get("/portal/dashboard", getCoachDashboard);
router.get("/portal/profile", getCoachProfile);

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Coach routes are working",
  });
});

module.exports = router;