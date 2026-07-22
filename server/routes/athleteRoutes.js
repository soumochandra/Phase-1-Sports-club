const express = require("express");

const uploadMiddleware = require(
  "../middleware/uploadMiddleware"
);

console.log("athleteRoutes loaded");

const {
  registerAthlete,
  loginPortalUser,
  getPortalDashboard,
} = require("../controllers/athleteController");

const router = express.Router();

router.post(
  "/register",
  uploadMiddleware,
  registerAthlete
);

router.post("/portal/login", loginPortalUser);
router.get("/portal/dashboard", getPortalDashboard);

router.get("/test", (req, res) => {
  res.send("Athlete route working");
});

router.post("/portal/login", loginPortalUser);

module.exports = router;