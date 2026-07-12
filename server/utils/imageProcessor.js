const sharp = require("sharp");

const compressProfileImage = async (
  imageBuffer,
  outputPath
) => {
  await sharp(imageBuffer)
    .rotate()
    .resize({
      width: 1200,
      height: 1200,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({
      quality: 80,
    })
    .toFile(outputPath);
};

module.exports = {
  compressProfileImage,
};