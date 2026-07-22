const { db } = require("../config/firebaseAdmin");
const { FieldValue } = require("firebase-admin/firestore");

const COACH_COLLECTION = "coaches";
const ATHLETE_COLLECTION = "athletes";

/*
==========================================
Assign Athletes to Coach
==========================================
*/

const assignAthletesToCoach = async (req, res) => {
  try {
    const { coachId } = req.params;
    const { athleteIds } = req.body;

    if (!Array.isArray(athleteIds) || athleteIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Select at least one athlete.",
      });
    }

    const coachRef = db.collection(COACH_COLLECTION).doc(coachId);
    const coachSnap = await coachRef.get();

    if (!coachSnap.exists) {
      return res.status(404).json({
        success: false,
        message: "Coach not found.",
      });
    }

    const coach = coachSnap.data();

    for (const athleteId of athleteIds) {
      const athleteRef = db.collection(ATHLETE_COLLECTION).doc(athleteId);

      await athleteRef.update({
        coachId,
        coachName: `${coach.firstName} ${coach.lastName}`,
        coachSport: coach.sport,
        assignedAt: FieldValue.serverTimestamp(),
      });
    }

    await coachRef.update({
      assignedAthletes: FieldValue.arrayUnion(...athleteIds),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return res.status(200).json({
      success: true,
      message: "Athletes assigned successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Assignment failed.",
    });
  }
};

/*
==========================================
Get Assigned Athletes
==========================================
*/

const getAssignedAthletes = async (req, res) => {
  try {
    const { coachId } = req.params;

    const coachSnap = await db
      .collection(COACH_COLLECTION)
      .doc(coachId)
      .get();

    if (!coachSnap.exists) {
      return res.status(404).json({
        success: false,
        message: "Coach not found.",
      });
    }

    const coach = coachSnap.data();

    const ids = coach.assignedAthletes || [];

    const athletes = [];

    for (const id of ids) {
      const athlete = await db
        .collection(ATHLETE_COLLECTION)
        .doc(id)
        .get();

      if (athlete.exists) {
        athletes.push({
          id: athlete.id,
          ...athlete.data(),
        });
      }
    }

    return res.status(200).json({
      success: true,
      athletes,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch assigned athletes.",
    });
  }
};

/*
==========================================
Get Available Athletes
==========================================
*/

const getAvailableAthletes = async (req, res) => {
  try {
    // Get ALL athletes
    const snapshot = await db
      .collection(ATHLETE_COLLECTION)
      .get();

    // Keep only athletes who don't have a coach assigned
    const athletes = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter(
        (athlete) =>
          !athlete.coachId || athlete.coachId === ""
      );

    return res.status(200).json({
      success: true,
      athletes,
    });
  } catch (error) {
    console.error("Available athletes error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch available athletes.",
    });
  }
};

/*
==========================================
Remove Athlete
==========================================
*/

const removeAssignedAthlete = async (req, res) => {
  try {
    const { coachId, athleteId } = req.params;

    await db.collection(COACH_COLLECTION).doc(coachId).update({
      assignedAthletes: FieldValue.arrayRemove(athleteId),
      updatedAt: FieldValue.serverTimestamp(),
    });

    await db.collection(ATHLETE_COLLECTION).doc(athleteId).update({
      coachId: FieldValue.delete(),
      coachName: FieldValue.delete(),
      coachSport: FieldValue.delete(),
      assignedAt: FieldValue.delete(),
    });

    return res.status(200).json({
      success: true,
      message: "Athlete removed successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to remove athlete.",
    });
  }
};

module.exports = {
  assignAthletesToCoach,
  getAssignedAthletes,
  getAvailableAthletes,
  removeAssignedAthlete,
};