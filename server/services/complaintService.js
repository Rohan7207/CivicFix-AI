const { pool } = require("../config/database");
const {
  analyzeAndStoreComplaint,
} = require("./aiServices/complaintAnalysisService");

const {
  uploadFileToImageKit,
  deleteFileFromImageKit,
} = require("../config/imagekit");
const {
  validateComplaintPayload,
} = require("../validators/complaintValidator");
const {
  createComplaint,
  findById,
  findAllForUser,
} = require("../models/complaintModel");
const {
  createEvidence,
  findByComplaintId,
} = require("../models/complaintEvidenceModel");

const DEFAULT_STATUS = "PENDING_AI_ANALYSIS";

function buildNotFoundError() {
  const error = new Error("Complaint not found or not accessible.");
  error.statusCode = 404;
  error.code = "NOT_FOUND";
  return error;
}

function normalizeUserRoleAllowed(user) {
  if (!user || !user.role) {
    const error = new Error("Authentication required.");
    error.statusCode = 401;
    error.code = "UNAUTHORIZED";
    throw error;
  }

  return String(user.role).toUpperCase();
}

async function uploadComplaintFiles(payload) {
  const uploaded = {
    photo: null,
    voice: null,
  };

  uploaded.photo = await uploadFileToImageKit(
    payload.photo,
    "complaints/photos",
  );

  if (payload.voice) {
    uploaded.voice = await uploadFileToImageKit(
      payload.voice,
      "complaints/voice",
    );
  }

  return uploaded;
}

async function createComplaintRecord({ user, body, files }) {
  const role = normalizeUserRoleAllowed(user);
  if (role !== "CITIZEN") {
    const error = new Error("Only citizens can create complaints.");
    error.statusCode = 403;
    error.code = "FORBIDDEN";
    throw error;
  }

  const validation = validateComplaintPayload({ body, files });
  if (!validation.valid) {
    const error = new Error(validation.error.message);
    error.statusCode = 400;
    error.code = validation.error.code || "VALIDATION_ERROR";
    throw error;
  }

  const payload = validation.data;

  let fileUploads;
  try {
    fileUploads = await uploadComplaintFiles(payload);
  } catch (error) {
    const uploadError = new Error(error.message || "Photo upload failed.");
    uploadError.statusCode = error.statusCode || 400;
    uploadError.code = error.code || "UPLOAD_FAILED";
    throw uploadError;
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const complaint = await createComplaint(
      {
        citizen_id: user.id,
        description: payload.description,
        latitude: payload.latitude,
        longitude: payload.longitude,
        address: payload.address,
        master_issue_id: null,
        status: DEFAULT_STATUS,
      },
      connection,
    );

    const evidence = [];

    evidence.push(
      await createEvidence(
        {
          complaint_id: complaint.id,
          type: "PHOTO",
          imagekit_url: fileUploads.photo.url,
          imagekit_file_id: fileUploads.photo.fileId,
          original_filename: payload.photo.originalname,
          mime_type: fileUploads.photo.mimeType,
          file_size: fileUploads.photo.size,
        },
        connection,
      ),
    );

    if (fileUploads.voice) {
      evidence.push(
        await createEvidence(
          {
            complaint_id: complaint.id,
            type: "VOICE",
            imagekit_url: fileUploads.voice.url,
            imagekit_file_id: fileUploads.voice.fileId,
            original_filename: payload.voice.originalname,
            mime_type: fileUploads.voice.mimeType,
            file_size: fileUploads.voice.size,
          },
          connection,
        ),
      );
    }

    await connection.commit();

    const aiAnalysis = await analyzeAndStoreComplaint({
      complaintId: complaint.id,
      complaintText: payload.description,
    });

    return {
      complaint,
      evidence,
      aiAnalysis,
    };
  } catch (error) {
    await connection.rollback();

    const uploadedFileIds = [];
    if (fileUploads?.photo?.fileId) {
      uploadedFileIds.push(fileUploads.photo.fileId);
    }
    if (fileUploads?.voice?.fileId) {
      uploadedFileIds.push(fileUploads.voice.fileId);
    }

    for (const fileId of uploadedFileIds) {
      try {
        await deleteFileFromImageKit(fileId);
      } catch (cleanupError) {
        console.warn(
          "ImageKit cleanup failed after complaint transaction error:",
          cleanupError.message,
        );
      }
    }

    const wrappedError = new Error(
      error.message || "Complaint creation failed.",
    );
    wrappedError.statusCode = error.statusCode || 500;
    wrappedError.code = error.code || "INTERNAL_SERVER_ERROR";
    throw wrappedError;
  } finally {
    connection.release();
  }
}

async function listComplaintsForUser({
  user,
  status = null,
  page = 1,
  limit = 20,
}) {
  const role = normalizeUserRoleAllowed(user);
  if (role !== "CITIZEN" && role !== "ADMIN") {
    const error = new Error("You are not authorized to view complaints.");
    error.statusCode = 403;
    error.code = "FORBIDDEN";
    throw error;
  }

  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(Math.max(1, Number(limit) || 20), 100);
  const offset = (safePage - 1) * safeLimit;

  const complaints = await findAllForUser(
    { user, status, limit: safeLimit, offset },
    pool,
  );

  const result = [];
  for (const complaint of complaints) {
    const evidence = await findByComplaintId(complaint.id, pool);
    result.push({
      ...complaint,
      evidence,
    });
  }

  return {
    complaints: result,
    pagination: {
      page: safePage,
      limit: safeLimit,
      offset,
    },
  };
}

async function getComplaintByIdForUser({ user, complaintId }) {
  const role = normalizeUserRoleAllowed(user);
  if (role !== "CITIZEN" && role !== "ADMIN") {
    const error = new Error("You are not authorized to view this complaint.");
    error.statusCode = 403;
    error.code = "FORBIDDEN";
    throw error;
  }

  const complaint = await findById(complaintId, pool);
  if (!complaint) {
    throw buildNotFoundError();
  }

  if (role === "CITIZEN" && complaint.citizen_id !== user.id) {
    throw buildNotFoundError();
  }

  const evidence = await findByComplaintId(complaint.id, pool);

  return {
    complaint,
    evidence,
  };
}

module.exports = {
  createComplaintRecord,
  listComplaintsForUser,
  getComplaintByIdForUser,
  DEFAULT_STATUS,
};
