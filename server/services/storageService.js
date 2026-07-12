const fs = require("fs");
const path = require("path");

const { compressImage } = require("./imageService");

const uploadFile = async (file, athleteId, fileName) => {
  const athleteFolder = path.join(
    __dirname,
    "..",
    "uploads",
    "athletes",
    athleteId
  );

  if (!fs.existsSync(athleteFolder)) {
    fs.mkdirSync(athleteFolder, {
      recursive: true,
    });
  }

  let fileBuffer = file.buffer;
  let extension = "pdf";

  if (file.mimetype.startsWith("image/")) {
    fileBuffer = await compressImage(file.buffer);
    extension = "jpg";
  }

  const finalFileName = `${fileName}.${extension}`;

  const filePath = path.join(
    athleteFolder,
    finalFileName
  );

  fs.writeFileSync(filePath, fileBuffer);

  return `/uploads/athletes/${athleteId}/${finalFileName}`;
};

module.exports = {
  uploadFile,
};