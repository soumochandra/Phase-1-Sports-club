const sharp = require("sharp");

const compressImage = async (buffer) => {
  const compressedImage = await sharp(buffer)
    .resize({
      width: 1200,
      withoutEnlargement: true,
    })
    .jpeg({
      quality: 80,
    })
    .toBuffer();

  if (compressedImage.length > 1024 * 1024) {
    return sharp(buffer)
      .resize({
        width: 800,
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 60,
      })
      .toBuffer();
  }

  return compressedImage;
};

module.exports = {
  compressImage,
};