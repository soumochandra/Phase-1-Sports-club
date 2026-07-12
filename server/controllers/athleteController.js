const fs = require("fs");
const path = require("path");

const {
  db,
} = require("../config/firebaseAdmin");

const {
  FieldValue,
} = require("firebase-admin/firestore");

const {
  compressProfileImage,
} = require("../utils/imageProcessor");

const registerAthlete = async (req, res) => {
  let athleteFolder = null;

  try {
    const {
      firstName,
      lastName,
      dob,
      gender,
      mobile,
      email,

      guardianName,
      guardianMobile,
      guardianRelation,

      addressLine,
      city,
      state,
      pinCode,

      clubName,
      representingState,

      competitionApplied,
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

    if (
      !req.files?.profileImage ||
      !req.files?.birthCertificate ||
      !req.files?.identityDocument
    ) {
      return res.status(400).json({
        success: false,
        message: "All documents are required",
      });
    }

    const birthDate = new Date(dob);
    const today = new Date();

    let age =
      today.getFullYear() -
      birthDate.getFullYear();

    const monthDifference =
      today.getMonth() -
      birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    let ageGroup = "Senior";

    if (age < 12) ageGroup = "Under 12";
    else if (age < 14) ageGroup = "Under 14";
    else if (age < 16) ageGroup = "Under 16";
    else if (age < 18) ageGroup = "Under 18";

    const athleteReference = db
      .collection("athletes")
      .doc();

    const athleteId = athleteReference.id;

    athleteFolder = path.join(
      __dirname,
      "..",
      "uploads",
      "athletes",
      athleteId
    );

    fs.mkdirSync(athleteFolder, {
      recursive: true,
    });

    const profileImagePath = path.join(
      athleteFolder,
      "profile-image.jpg"
    );

    const birthCertificatePath = path.join(
      athleteFolder,
      "birth-certificate.pdf"
    );

    const identityDocumentPath = path.join(
      athleteFolder,
      "identity-document.pdf"
    );

    await compressProfileImage(
      req.files.profileImage[0].buffer,
      profileImagePath
    );

    fs.writeFileSync(
      birthCertificatePath,
      req.files.birthCertificate[0].buffer
    );

    fs.writeFileSync(
      identityDocumentPath,
      req.files.identityDocument[0].buffer
    );

    const athleteData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dob,
      age,
      ageGroup,
      gender,
      mobile,
      email,

      guardianName,
      guardianMobile,
      guardianRelation,

      addressLine,
      city,
      state,
      pinCode,

      clubName: clubName || "",
      representingState:
        representingState || "",

      competitionApplied,

      profileImage: `/uploads/athletes/${athleteId}/profile-image.jpg`,

      birthCertificate: `/uploads/athletes/${athleteId}/birth-certificate.pdf`,

      identityDocument: `/uploads/athletes/${athleteId}/identity-document.pdf`,

      status: "pending",

      createdAt: FieldValue.serverTimestamp(),
    };

    await athleteReference.set(athleteData);

    return res.status(201).json({
      success: true,
      message:
        "Athlete registered successfully",
      athleteId,
    });
  } catch (error) {
    console.error(
      "Athlete registration error:",
      error
    );

    if (
      athleteFolder &&
      fs.existsSync(athleteFolder)
    ) {
      fs.rmSync(athleteFolder, {
        recursive: true,
        force: true,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Athlete registration failed",
    });
  }
};

module.exports = {
  registerAthlete,
};