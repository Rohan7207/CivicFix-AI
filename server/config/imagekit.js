const ImageKit = require("imagekit");
const sharp = require("sharp");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
});

async function uploadFileToImageKit(file, folderName = "complaints") {
  if (!file || !file.buffer) {
    const error = new Error("No file content provided for upload.");
    error.statusCode = 400;
    error.code = "VALIDATION_ERROR";
    throw error;
  }

  if (
    !process.env.IMAGEKIT_PUBLIC_KEY ||
    !process.env.IMAGEKIT_PRIVATE_KEY ||
    !process.env.IMAGEKIT_URL_ENDPOINT
  ) {
    const error = new Error("ImageKit credentials are not configured.");
    error.statusCode = 500;
    error.code = "CONFIGURATION_ERROR";
    throw error;
  }

  // For creating compressed image
  let uploadBuffer = file.buffer;

  if (file.mimetype.startsWith("image/")) {
    uploadBuffer = await sharp(file.buffer)
      .rotate()
      .resize({
        width: 1600,
        height: 1600,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 80,
        mozjpeg: true,
      })
      .toBuffer();
  }

  const uploaded = await imagekit.upload({
    file: uploadBuffer.toString("base64"),
    fileName: file.originalname || `${Date.now()}-${folderName}`,
    folder: folderName,
    useUniqueFileName: true,
    isPrivateFile: false,
    tags: [folderName],
  });

  return {
    url: uploaded.url,
    fileId: uploaded.fileId,
    name: uploaded.name || uploaded.fileName,
    mimeType: uploaded.mime || file.mimetype,
    size: uploaded.size || uploadBuffer.length,
  };
}

async function deleteFileFromImageKit(fileId) {
  if (!fileId) {
    return null;
  }

  if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    return null;
  }

  try {
    await imagekit.deleteFile(fileId);
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  imagekit,
  uploadFileToImageKit,
  deleteFileFromImageKit,
};
