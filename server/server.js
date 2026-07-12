require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const athleteRoutes = require(
  "./routes/athleteRoutes"
);

const adminRoutes = require(
  "./routes/adminRoutes"
);

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Sports Club API is running",
  });
});

app.use(
  "/api/athletes",
  athleteRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use((error, req, res, next) => {
  console.error("Server error:", error);

  return res.status(400).json({
    success: false,
    message:
      error.message || "Something went wrong",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});