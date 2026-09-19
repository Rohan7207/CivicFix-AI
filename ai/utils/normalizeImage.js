const fs = require("fs");
const path = require("path");

function extensionToMimeType(filePath) {
  const extension = path.extname(filePath).toLowerCase();

  const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
  };

  return mimeTypes[extension] || "image/jpeg";
}

function toImageInput(image) {
  if (!image) {
    throw new Error("Image input is required.");
  }

  if (typeof image === "string") {
    if (/^https?:\/\//i.test(image)) {
      return image;
    }

    if (!fs.existsSync(image)) {
      throw new Error("Image file not found.");
    }

    const buffer = fs.readFileSync(image);
    const mimeType = extensionToMimeType(image);

    return `data:${mimeType};base64,${buffer.toString("base64")}`;
  }

  if (Buffer.isBuffer(image)) {
    return `data:image/jpeg;base64,${image.toString("base64")}`;
  }

  if (image.buffer && Buffer.isBuffer(image.buffer)) {
    const mimeType = image.mimetype || "image/jpeg";
    return `data:${mimeType};base64,${image.buffer.toString("base64")}`;
  }

  if (image.path && typeof image.path === "string") {
    return toImageInput(image.path);
  }

  throw new Error("Unsupported image input.");
}

module.exports = toImageInput;
