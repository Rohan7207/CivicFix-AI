const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_PHOTO_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_VOICE_SIZE_BYTES = 25 * 1024 * 1024;

const ALLOWED_PHOTO_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const ALLOWED_VOICE_MIME_TYPES = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/webm",
  "audio/ogg",
  "audio/mp4",
  "audio/m4a",
]);

function pickLocation(body = {}) {
  if (body.location && typeof body.location === "object") {
    return body.location;
  }

  return {};
}

function normalizeUploadedFiles(files = []) {
  if (!files) {
    return [];
  }

  if (Array.isArray(files)) {
    return files;
  }

  return Object.values(files).flat();
}

function getUploadedFile(files, fieldName) {
  const candidates = normalizeUploadedFiles(files);
  const file = candidates.find((item) => item && item.fieldname === fieldName);
  return file || null;
}

function validateComplaintPayload({ body = {}, files = [] } = {}) {
  const location = pickLocation(body);
  const rawLatitude = body.latitude ?? location.latitude;
  const rawLongitude = body.longitude ?? location.longitude;

  if (
    rawLatitude == null ||
    (typeof rawLatitude !== "string" && typeof rawLatitude !== "number") ||
    (typeof rawLatitude === "string" && rawLatitude.trim() === "")
  ) {
    return {
      valid: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Latitude must be a number between -90 and 90.",
      },
    };
  }

  if (
    rawLongitude == null ||
    (typeof rawLongitude !== "string" && typeof rawLongitude !== "number") ||
    (typeof rawLongitude === "string" && rawLongitude.trim() === "")
  ) {
    return {
      valid: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Longitude must be a number between -180 and 180.",
      },
    };
  }

  const latitude = Number(rawLatitude);
  const longitude = Number(rawLongitude);

  if (body.description != null && typeof body.description !== "string") {
    return {
      valid: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Description must be a string.",
      },
    };
  }

  if (body.address != null && typeof body.address !== "string") {
    return {
      valid: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Address must be a string.",
      },
    };
  }

  if (location.address != null && typeof location.address !== "string") {
    return {
      valid: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Address must be a string.",
      },
    };
  }

  const description = body.description == null ? null : body.description.trim();

  const address =
    body.address == null
      ? location.address == null
        ? null
        : location.address.trim()
      : body.address.trim();

  if (description && description.length > MAX_DESCRIPTION_LENGTH) {
    return {
      valid: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Description must be 1000 characters or fewer.",
      },
    };
  }

  const photo = getUploadedFile(files, "photo");
  if (!photo) {
    return {
      valid: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "A photo is required.",
      },
    };
  }

  if (
    !ALLOWED_PHOTO_MIME_TYPES.has(String(photo.mimetype || "").toLowerCase())
  ) {
    return {
      valid: false,
      error: {
        code: "UNSUPPORTED_FILE_TYPE",
        message: "Photo must be a JPEG, PNG, or WEBP file.",
      },
    };
  }

  if ((photo.size || 0) > MAX_PHOTO_SIZE_BYTES) {
    return {
      valid: false,
      error: {
        code: "FILE_TOO_LARGE",
        message: "Photo must be 10 MB or smaller.",
      },
    };
  }

  const voice = getUploadedFile(files, "voice");
  if (voice) {
    if (
      !ALLOWED_VOICE_MIME_TYPES.has(String(voice.mimetype || "").toLowerCase())
    ) {
      return {
        valid: false,
        error: {
          code: "UNSUPPORTED_FILE_TYPE",
          message: "Voice must be an audio file in a supported format.",
        },
      };
    }

    if ((voice.size || 0) > MAX_VOICE_SIZE_BYTES) {
      return {
        valid: false,
        error: {
          code: "FILE_TOO_LARGE",
          message: "Voice file must be 25 MB or smaller.",
        },
      };
    }
  }

  return {
    valid: true,
    data: {
      description: description || null,
      latitude,
      longitude,
      address: address || null,
      photo,
      voice,
    },
  };
}

module.exports = {
  validateComplaintPayload,
  MAX_DESCRIPTION_LENGTH,
  MAX_PHOTO_SIZE_BYTES,
  MAX_VOICE_SIZE_BYTES,
  ALLOWED_PHOTO_MIME_TYPES,
  ALLOWED_VOICE_MIME_TYPES,
};
