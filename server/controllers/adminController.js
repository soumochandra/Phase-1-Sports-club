const { db } = require("../config/firebaseAdmin");

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
      athletes,
    });
  } catch (error) {
    console.error("Get athletes error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load athletes",
    });
  }
};

const getAthleteById = async (req, res) => {
  try {
    const { id } = req.params;

    const athleteDocument = await db
      .collection("athletes")
      .doc(id)
      .get();

    if (!athleteDocument.exists) {
      return res.status(404).json({
        success: false,
        message: "Athlete not found",
      });
    }

    return res.status(200).json({
      success: true,
      athlete: {
        id: athleteDocument.id,
        ...athleteDocument.data(),
      },
    });
  } catch (error) {
    console.error("Get athlete error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load athlete",
    });
  }
};

const updateAthleteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "approved",
      "rejected",
    ];

    const normalizedStatus = String(
      status || ""
    ).toLowerCase();

    if (!allowedStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid athlete status",
      });
    }

    const athleteReference = db
      .collection("athletes")
      .doc(id);

    const athleteDocument =
      await athleteReference.get();

    if (!athleteDocument.exists) {
      return res.status(404).json({
        success: false,
        message: "Athlete not found",
      });
    }

    await athleteReference.update({
      status: normalizedStatus,
      updatedAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: `Athlete status updated to ${normalizedStatus}`,
      status: normalizedStatus,
    });
  } catch (error) {
    console.error(
      "Update athlete status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update athlete status",
    });
  }
};

module.exports = {
  getAllAthletes,
  getAthleteById,
  updateAthleteStatus,
};