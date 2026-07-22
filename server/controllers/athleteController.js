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

const loginPortalUser = async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({ success: false, message: "User ID and password are required" });
    }

    const snapshot = await db.collection("athletes").where("portalUserId", "==", userId).limit(1).get();

    if (snapshot.empty) {
      return res.status(401).json({ success: false, message: "Invalid portal credentials" });
    }

    const athleteDoc = snapshot.docs[0];
    const athleteData = athleteDoc.data();

    const { verifyPassword } = require("../utils/portalAuth");
    const isValid = verifyPassword(password, athleteData.portalPasswordHash);

    if (!isValid) {
      return res.status(401).json({ success: false, message: "Invalid portal credentials" });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: athleteDoc.id,
        role: athleteData.portalRole || "athlete",
        name: `${athleteData.firstName || ""} ${athleteData.lastName || ""}`.trim(),
        userId: athleteData.portalUserId,
      },
    });
  } catch (error) {
    console.error("Portal login error:", error);
    return res.status(500).json({ success: false, message: "Portal login failed" });
  }
};

const getPortalDashboard = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const snapshot = await db.collection("athletes").where("portalUserId", "==", userId).limit(1).get();

    if (snapshot.empty) {
      return res.status(404).json({ success: false, message: "Portal user not found" });
    }

    const athleteData = snapshot.docs[0].data();

    return res.status(200).json({
      success: true,
      dashboard: {
        userId: athleteData.portalUserId,
        role: athleteData.portalRole || "athlete",
        name: `${athleteData.firstName || ""} ${athleteData.lastName || ""}`.trim(),
        status: athleteData.status || "pending",
        competition: athleteData.competitionApplied || "",
        paymentStatus: athleteData.paymentStatus || "pending",
      },
    });
  } catch (error) {
    console.error("Portal dashboard error:", error);
    return res.status(500).json({ success: false, message: "Unable to fetch dashboard" });
  }
};

const registerAthlete = async (req, res) => {
  let athleteFolder = null;

  try {
    const {
      firstName,
      lastName,
      dob,
      gender,
      bloodGroup,
      mobile,
      email,

      guardianName,
      guardianMobile,
      guardianRelation,
      guardianEmail,

      addressLine,
      city,
      state,
      country,
      pinCode,

      clubName,
      district,
      representingState,

      competitionApplied,
      category,
      eventLevel,

      declarationConfirmed,
      termsAccepted,
      parentConsent,

      paymentMethod,
      paymentStatus,
      insuranceProvider,
      insurancePolicyNumber,
      insuranceValidTill,
      portalPassword,
    } = req.body;

    if (
  !firstName ||
  !lastName ||
  !dob ||
  !gender ||
  !mobile ||
  !email ||
  !guardianName ||
  !guardianMobile ||
  !guardianRelation ||
  !addressLine ||
  !city ||
  !state ||
  !pinCode ||
  !competitionApplied
) {
  return res.status(400).json({
    success: false,
    message: "Required fields are missing",
  });
}

if (!portalPassword || !/^\d{6}$/.test(portalPassword)) {
  return res.status(400).json({
    success: false,
    message: "Password must be exactly 6 digits.",
  });
}

    if (!req.files?.profileImage || !req.files?.birthCertificate || !req.files?.identityDocument) {
      return res.status(400).json({
        success: false,
        message: "All mandatory documents are required",
      });
    }

    const duplicateMobile = await db.collection("athletes").where("mobile", "==", mobile).limit(1).get();
    const duplicateEmail = await db.collection("athletes").where("email", "==", email).limit(1).get();

    if (!duplicateMobile.empty || !duplicateEmail.empty) {
      return res.status(409).json({
        success: false,
        message: "An athlete with this mobile number or email already exists",
      });
    }

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    let ageGroup = "Senior";

    if (age < 12) ageGroup = "Under 12";
    else if (age < 14) ageGroup = "Under 14";
    else if (age < 16) ageGroup = "Under 16";
    else if (age < 18) ageGroup = "Under 18";

    const athleteReference = db.collection("athletes").doc();
    const athleteId = athleteReference.id;
    const role = "athlete";


   const portalUserId = generatePortalUserId(
  role,
  `${firstName} ${lastName}`
);

const portalPasswordHash = hashPassword(portalPassword);



    athleteFolder = path.join(__dirname, "..", "uploads", "athletes", athleteId);
    fs.mkdirSync(athleteFolder, { recursive: true });



    const profileImagePath = path.join(athleteFolder, "profile-image.jpg");
    const birthCertificatePath = path.join(athleteFolder, "birth-certificate.pdf");
    const identityDocumentPath = path.join(athleteFolder, "identity-document.pdf");

    await compressProfileImage(req.files.profileImage[0].buffer, profileImagePath);
    fs.writeFileSync(birthCertificatePath, req.files.birthCertificate[0].buffer);
    fs.writeFileSync(identityDocumentPath, req.files.identityDocument[0].buffer);

    const optionalFilePaths = {};

    const optionalFiles = [
      ["schoolBonafideCertificate", "school-bonafide.pdf"],
      ["insuranceDocument", "insurance-document.pdf"],
    ];

    for (const [fieldName, fileName] of optionalFiles) {
      const file = req.files?.[fieldName]?.[0];
      if (file) {
        const uploadedPath = path.join(athleteFolder, fileName);
        fs.writeFileSync(uploadedPath, file.buffer);
        optionalFilePaths[fieldName] = `/uploads/athletes/${athleteId}/${fileName}`;
      }
    }

    const athleteData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dob,
      age,
      ageGroup,
      gender,
      bloodGroup: bloodGroup || "",
      mobile,
      email,

      guardianName,
      guardianMobile,
      guardianRelation,
      guardianEmail: guardianEmail || "",

      addressLine,
      city,
      state,
      country: country || "India",
      pinCode,

      clubName: clubName || "",
      district: district || "",
      representingState: representingState || "",

      competitionApplied,
      category: category || "",
      eventLevel: eventLevel || "",

      profileImage: `/uploads/athletes/${athleteId}/profile-image.jpg`,
      birthCertificate: `/uploads/athletes/${athleteId}/birth-certificate.pdf`,
      identityDocument: `/uploads/athletes/${athleteId}/identity-document.pdf`,
      schoolBonafideCertificate: optionalFilePaths.schoolBonafideCertificate || "",
      insuranceDocument: optionalFilePaths.insuranceDocument || "",

      declarationConfirmed: declarationConfirmed === "true" || declarationConfirmed === true,
      termsAccepted: termsAccepted === "true" || termsAccepted === true,
      parentConsent: parentConsent === "true" || parentConsent === true,

      paymentMethod: paymentMethod || "",
      paymentStatus: paymentStatus || "pending",
      insuranceProvider: insuranceProvider || "",
      insurancePolicyNumber: insurancePolicyNumber || "",
      insuranceValidTill: insuranceValidTill || "",

   portalRole: role,
portalUserId,
portalPassword,
portalPasswordHash,
portalPasswordSet: true,

status: "pending",

createdAt: FieldValue.serverTimestamp(),

    };

   console.log("--------------------------------");


console.log("===== SAVING ATHLETE =====");
console.log("Portal User ID:", portalUserId);
console.log("Portal Password:", portalPassword);
console.log("Portal Password Hash:", portalPasswordHash);

await athleteReference.set(athleteData);

console.log("Athlete saved successfully.");

    const registration = {
  athleteId,
  portalUserId,
  portalPassword,
};

    return res.status(201).json({
      success: true,
      message: "Athlete registered successfully",
      data: registration,
      ...registration,
    });
  } catch (error) {
    console.error("Athlete registration error:", error);

    if (athleteFolder && fs.existsSync(athleteFolder)) {
      fs.rmSync(athleteFolder, { recursive: true, force: true });
    }

    return res.status(500).json({
      success: false,
      message: "Athlete registration failed",
    });
  }
};

module.exports = {
  registerAthlete,
  loginPortalUser,
  getPortalDashboard,
};
