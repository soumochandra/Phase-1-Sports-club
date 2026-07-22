const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "profileImage") {
    const allowedImages = [
      "image/jpeg",
      "image/png",
    ];

    if (!allowedImages.includes(file.mimetype)) {
      return cb(
        new Error("Profile image must be JPG or PNG")
      );
    }

    return cb(null, true);
  }

  const allowedDocumentFields = [
    // Athlete
    "birthCertificate",
    "identityDocument",
    "schoolBonafideCertificate",
    "insuranceDocument",

    // Coach
    "coachingCertificate",
  ];

  if (
    allowedDocumentFields.includes(file.fieldname)
  ) {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          "Only PDF, JPG or PNG files are allowed."
        )
      );
    }

    return cb(null, true);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

const uploadMiddleware = upload.fields([
  // Common
  {
    name: "profileImage",
    maxCount: 1,
  },

  // Athlete
  {
    name: "birthCertificate",
    maxCount: 1,
  },
  {
    name: "identityDocument",
    maxCount: 1,
  },
  {
    name: "schoolBonafideCertificate",
    maxCount: 1,
  },
  {
    name: "insuranceDocument",
    maxCount: 1,
  },

  // Coach
  {
    name: "coachingCertificate",
    maxCount: 1,
  },
]);

module.exports = uploadMiddleware;