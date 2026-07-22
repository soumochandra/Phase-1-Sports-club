const fs = require("fs");
const path = require("path");

const { db } = require("../config/firebaseAdmin");
const { FieldValue } = require("firebase-admin/firestore");
const { compressProfileImage } = require("../utils/imageProcessor");
const {
  generatePortalUserId,
  hashPassword,
  verifyPassword,
} = require("../utils/portalAuth");

const COACH_COLLECTION = "coaches";

const getAgeFromDob = (dob) => {
  const birthDate = new Date(`${dob}T00:00:00`);

  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age >= 0 ? age : null;
};

const getDocumentExtension = (file) => {
  const extensions = {
    "application/pdf": ".pdf",
    "image/jpeg": ".jpg",
    "image/png": ".png",
  };

  return extensions[file.mimetype] || ".bin";
};

const removeCoachFolder = (coachFolder) => {
  if (coachFolder && fs.existsSync(coachFolder)) {
    fs.rmSync(coachFolder, { recursive: true, force: true });
  }
};

const createUniquePortalUserId = async (name) => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const portalUserId = generatePortalUserId("coach", name);
    const existingCoach = await db
      .collection(COACH_COLLECTION)
      .where("portalUserId", "==", portalUserId)
      .limit(1)
      .get();

    if (existingCoach.empty) {
      return portalUserId;
    }
  }

  throw new Error("Unable to generate a unique coach portal ID");
};

const registerCoach = async (req, res) => {
  let coachFolder = null;

  try {
    const {
      firstName,
      lastName,
      dob,
      gender,
      bloodGroup,
      mobile,
      email,
      addressLine,
      city,
      district,
      state,
      country,
      pinCode,
      sport,
      specialization,
      qualification,
      experience,
      coachLicenseNumber,
      portalPassword,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !dob ||
      !gender ||
      !mobile ||
      !email ||
      !addressLine ||
      !city ||
      !state ||
      !pinCode ||
      !sport ||
      !qualification
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    if (!/^[6-9]\d{9}$/.test(String(mobile))) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid 10-digit mobile number",
      });
    }

    if (!/^\S+@\S+\.\S+$/.test(String(email))) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address",
      });
    }

    if (!/^\d{6}$/.test(String(pinCode))) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid 6-digit PIN code",
      });
    }

    if (!/^\d{6}$/.test(String(portalPassword || ""))) {
      return res.status(400).json({
        success: false,
        message: "Password must be exactly 6 digits",
      });
    }

    if (
      !req.files?.profileImage?.[0] ||
      !req.files?.identityDocument?.[0] ||
      !req.files?.coachingCertificate?.[0]
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Profile image, identity document and coaching certificate are required",
      });
    }

    const normalizedMobile = String(mobile).trim();
    const normalizedEmail = String(email).trim().toLowerCase();

    const [duplicateMobile, duplicateEmail] = await Promise.all([
      db
        .collection(COACH_COLLECTION)
        .where("mobile", "==", normalizedMobile)
        .limit(1)
        .get(),
      db
        .collection(COACH_COLLECTION)
        .where("email", "==", normalizedEmail)
        .limit(1)
        .get(),
    ]);

    if (!duplicateMobile.empty || !duplicateEmail.empty) {
      return res.status(409).json({
        success: false,
        message: "A coach with this mobile number or email already exists",
      });
    }

    const age = getAgeFromDob(dob);

    if (age === null) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid date of birth",
      });
    }

    const coachReference = db.collection(COACH_COLLECTION).doc();
    const coachId = coachReference.id;
    const portalUserId = await createUniquePortalUserId(
      `${firstName} ${lastName}`
    );
    const portalPasswordHash = hashPassword(String(portalPassword));

    coachFolder = path.join(
      __dirname,
      "..",
      "uploads",
      "coaches",
      coachId
    );
    fs.mkdirSync(coachFolder, { recursive: true });

    const profileImagePath = path.join(coachFolder, "profile-image.jpg");
    const identityFile = req.files.identityDocument[0];
    const certificateFile = req.files.coachingCertificate[0];
    const identityFileName = `identity-document${getDocumentExtension(identityFile)}`;
    const certificateFileName = `coaching-certificate${getDocumentExtension(certificateFile)}`;

    await compressProfileImage(
      req.files.profileImage[0].buffer,
      profileImagePath
    );
    fs.writeFileSync(
      path.join(coachFolder, identityFileName),
      identityFile.buffer
    );
    fs.writeFileSync(
      path.join(coachFolder, certificateFileName),
      certificateFile.buffer
    );

    const coachData = {
      coachId,
      firstName: String(firstName).trim(),
      lastName: String(lastName).trim(),
      dob,
      age,
      gender,
      bloodGroup: bloodGroup || "",
      mobile: normalizedMobile,
      email: normalizedEmail,
      addressLine: String(addressLine).trim(),
      city: String(city).trim(),
      district: district ? String(district).trim() : "",
      state: String(state).trim(),
      country: country ? String(country).trim() : "India",
      pinCode: String(pinCode).trim(),
      sport: String(sport).trim(),
      specialization: specialization ? String(specialization).trim() : "",
      qualification: String(qualification).trim(),
      experience: experience ? String(experience).trim() : "",
      coachLicenseNumber: coachLicenseNumber
        ? String(coachLicenseNumber).trim()
        : "",
      profileImage: `/uploads/coaches/${coachId}/profile-image.jpg`,
      identityDocument: `/uploads/coaches/${coachId}/${identityFileName}`,
      coachingCertificate: `/uploads/coaches/${coachId}/${certificateFileName}`,
      portalRole: "coach",
      portalUserId,
      // Kept for the requested admin-visible credentials flow. Do not return it
      // from dashboard or profile APIs.
      portalPassword: String(portalPassword),
      portalPasswordHash,
      portalPasswordSet: true,
      status: "pending",
      assignedAthletes: [],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await coachReference.set(coachData);

    return res.status(201).json({
      success: true,
      message: "Coach registered successfully",
      data: {
        coachId,
        portalUserId,
        portalPassword: String(portalPassword),
      },
      coachId,
      portalUserId,
      portalPassword: String(portalPassword),
    });
  } catch (error) {
    console.error("Coach registration error:", error);
    removeCoachFolder(coachFolder);

    return res.status(500).json({
      success: false,
      message: "Coach registration failed",
    });
  }
};

const loginCoach = async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({
        success: false,
        message: "Coach ID and password are required",
      });
    }

    const snapshot = await db
      .collection(COACH_COLLECTION)
      .where("portalUserId", "==", String(userId).trim())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({
        success: false,
        message: "Invalid coach credentials",
      });
    }

    const coachDoc = snapshot.docs[0];
    const coachData = coachDoc.data();
    const isValidPassword = verifyPassword(
      String(password),
      coachData.portalPasswordHash
    );

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid coach credentials",
      });
    }

    if (coachData.status === "rejected" || coachData.status === "suspended") {
      return res.status(403).json({
        success: false,
        message: "Your coach account is not active. Please contact the administrator.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: coachDoc.id,
        role: "coach",
        name: `${coachData.firstName || ""} ${coachData.lastName || ""}`.trim(),
        userId: coachData.portalUserId,
      },
    });
  } catch (error) {
    console.error("Coach login error:", error);

    return res.status(500).json({
      success: false,
      message: "Coach login failed",
    });
  }
};

const getCoachDashboard = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Coach ID is required",
      });
    }

    const snapshot = await db
      .collection(COACH_COLLECTION)
      .where("portalUserId", "==", String(userId).trim())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        success: false,
        message: "Coach not found",
      });
    }

    const coachDoc = snapshot.docs[0];
    const coachData = coachDoc.data();
    const assignedAthletes = Array.isArray(coachData.assignedAthletes)
      ? coachData.assignedAthletes
      : [];

    return res.status(200).json({
      success: true,
      dashboard: {
        coachId: coachDoc.id,
        userId: coachData.portalUserId,
        role: "coach",
        name: `${coachData.firstName || ""} ${coachData.lastName || ""}`.trim(),
        status: coachData.status || "pending",
        sport: coachData.sport || "",
        specialization: coachData.specialization || "",
        experience: coachData.experience || "",
        assignedAthleteCount: assignedAthletes.length,
      },
    });
  } catch (error) {
    console.error("Coach dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch coach dashboard",
    });
  }
};

const getCoachProfile = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Coach ID is required",
      });
    }

    const snapshot = await db
      .collection(COACH_COLLECTION)
      .where("portalUserId", "==", String(userId).trim())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        success: false,
        message: "Coach not found",
      });
    }

    const coachDoc = snapshot.docs[0];
    const coachData = coachDoc.data();

    const {
      portalPassword,
      portalPasswordHash,
      ...safeCoachData
    } = coachData;

    return res.status(200).json({
      success: true,
      coach: {
        id: coachDoc.id,
        ...safeCoachData,
        assignedAthletes: Array.isArray(safeCoachData.assignedAthletes)
          ? safeCoachData.assignedAthletes
          : [],
      },
    });
  } catch (error) {
    console.error("Coach profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch coach profile",
    });
  }
};

module.exports = {
  registerCoach,
  loginCoach,
  getCoachDashboard,
  getCoachProfile,
};