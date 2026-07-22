export const compressImage = async (file, options = {}) => {
  if (!file || !file.type?.startsWith("image/")) {
    return file;
  }

  const quality = options.quality ?? 0.8;
  const maxWidth = options.maxWidth ?? 1024;

  const reader = new FileReader();

  const readAsDataURL = () =>
    new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Unable to read image file"));
      reader.readAsDataURL(file);
    });

  const dataUrl = await readAsDataURL();

  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Unable to load image"));
    img.src = dataUrl;
  });

  const canvas = document.createElement("canvas");
  const scale = Math.min(1, maxWidth / image.width);
  canvas.width = Math.max(1, Math.floor(image.width * scale));
  canvas.height = Math.max(1, Math.floor(image.height * scale));

  const context = canvas.getContext("2d");

  if (!context) {
    return file;
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) {
          resolve(result);
          return;
        }

        reject(new Error("Image compression failed"));
      },
      "image/jpeg",
      quality
    );
  });

  const compressedFile = new File(
    [blob],
    file.name.replace(/\.[^.]+$/, ".jpg"),
    {
      type: "image/jpeg",
      lastModified: Date.now(),
    }
  );

  return compressedFile;
};
