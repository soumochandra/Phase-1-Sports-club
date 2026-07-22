const { db } = require("../config/firebaseAdmin");

const COACH_COLLECTION = "coaches";

/**
 * Get All Coaches
 */
const getAllCoaches = async (req, res) => {
  try {
    const snapshot = await db.collection(COACH_COLLECTION).get();

    const coaches = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        portalUserId: data.portalUserId,
        name: data.name,
        sport: data.sport,
        specialization: data.specialization,
        experience: data.experience,
        status: data.status,
      };
    });

    return res.status(200).json({
      success: true,
      total: coaches.length,
      coaches,
    });
  } catch (error) {
    console.error("Get Coaches Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch coaches",
    });
  }
};

/**
 * Get Coach By ID
 */
const getCoachById = async (req, res) => {
  try {
    const { id } = req.params;

    const coachRef = db.collection(COACH_COLLECTION).doc(id);
    const coachDoc = await coachRef.get();

    if (!coachDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Coach not found",
      });
    }

    const coach = coachDoc.data();

    // Remove sensitive fields
    delete coach.portalPassword;
    delete coach.portalPasswordHash;

    return res.status(200).json({
      success: true,
      coach: {
        id: coachDoc.id,
        ...coach,
      },
    });
  } catch (error) {
    console.error("Get Coach Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch coach",
    });
  }
};

/**
 * Update Coach Status
 */
const updateCoachStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "approved",
      "rejected",
      "suspended",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const coachRef = db.collection(COACH_COLLECTION).doc(id);

    const coachDoc = await coachRef.get();

    if (!coachDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Coach not found",
      });
    }

    await coachRef.update({
      status,
      updatedAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Coach status updated successfully",
    });
  } catch (error) {
    console.error("Update Coach Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update coach status",
    });
  }
};

module.exports = {
  getAllCoaches,
  getCoachById,
  updateCoachStatus,
};