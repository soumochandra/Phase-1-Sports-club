const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

const athleteRoutes = require("./routes/athleteRoutes");
const coachRoutes = require("./routes/coachRoutes");
const adminRoutes = require("./routes/adminRoutes");

const dotenvPath = path.join(__dirname, ".env");

if (fs.existsSync(dotenvPath)) {
  dotenv.config({ path: dotenvPath });
} else {
  dotenv.config();
}

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
app.use(express.urlencoded({ extended: true }));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Sports Club API is running",
  });
});

app.use("/api/athletes", athleteRoutes);
app.use("/api/coaches", coachRoutes);
app.use("/api/admin", adminRoutes);



app.use((error, req, res, next) => {
  console.error("Server Error:", error);

  return res.status(400).json({
    success: false,
    message: error.message || "Something went wrong",
  });
});

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      const nextPort = port + 1;

      console.warn(
        `Port ${port} is busy. Trying ${nextPort}...`
      );

      server.close(() => startServer(nextPort));
      return;
    }

    throw error;
  });
};

const PORT = Number(process.env.PORT || 5000);

startServer(PORT);