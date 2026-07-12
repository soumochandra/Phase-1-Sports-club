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
        new Error(
          "Profile image must be JPG or PNG"
        )
      );
    }
  }

  if (
    file.fieldname === "birthCertificate" ||
    file.fieldname === "identityDocument"
  ) {
    if (file.mimetype !== "application/pdf") {
      return cb(
        new Error("Documents must be PDF files")
      );
    }
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

const athleteUpload = upload.fields([
  {
    name: "profileImage",
    maxCount: 1,
  },
  {
    name: "birthCertificate",
    maxCount: 1,
  },
  {
    name: "identityDocument",
    maxCount: 1,
  },
]);

module.exports = athleteUpload;