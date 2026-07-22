const { db } = require("../config/firebaseAdmin");
const { Timestamp } = require("firebase-admin/firestore");

/**
 * ============================================================
 * Get All Athletes
 * GET /api/admin/athletes
 * ============================================================
 */
const getAllAthletes = async (req, res) => {
  try {
    const snapshot = await db
      .collection("athletes")
      .orderBy("createdAt", "desc")
      .get();

    const athletes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      success: true,
      count: athletes.length,
      athletes,
    });
  } catch (error) {
    console.error("❌ Get All Athletes Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch athletes.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * ============================================================
 * Get Athlete By ID
 * GET /api/admin/athletes/:id
 * ============================================================
 */
const getAthleteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Athlete ID is required.",
      });
    }

    const athleteRef = db.collection("athletes").doc(id);
    const athleteDoc = await athleteRef.get();

    if (!athleteDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Athlete not found.",
      });
    }

    return res.status(200).json({
      success: true,
      athlete: {
        id: athleteDoc.id,
        ...athleteDoc.data(),
      },
    });
  } catch (error) {
    console.error("❌ Get Athlete Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch athlete.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * ============================================================
 * Update Athlete Status
 * PATCH /api/admin/athletes/:id/status
 * ============================================================
 */
const updateAthleteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "approved",
      "rejected",
    ];

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required.",
      });
    }

    const normalizedStatus = status.trim().toLowerCase();

    if (!allowedStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Allowed values are: pending, approved, rejected.",
      });
    }

    const athleteRef = db.collection("athletes").doc(id);
    const athleteDoc = await athleteRef.get();

    if (!athleteDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Athlete not found.",
      });
    }

    await athleteRef.update({
      status: normalizedStatus,
      updatedAt: Timestamp.now(),
    });

    const updatedAthlete = await athleteRef.get();

    return res.status(200).json({
      success: true,
      message: "Athlete status updated successfully.",
      status: normalizedStatus,
      athlete: {
        id: updatedAthlete.id,
        ...updatedAthlete.data(),
      },
    });
  } catch (error) {
    console.error("❌ Update Athlete Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update athlete status.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getAllAthletes,
  getAthleteById,
  updateAthleteStatus,
};