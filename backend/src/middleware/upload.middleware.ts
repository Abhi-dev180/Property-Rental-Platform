import multer from "multer";

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const DOCUMENT_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024; // 10MB

// Files are held in memory only long enough to stream straight into
// Supabase Storage - nothing touches disk.
export const uploadProfileImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!IMAGE_TYPES.has(file.mimetype)) {
      return cb(new Error("Profile image must be a JPEG, PNG, or WEBP file."));
    }
    cb(null, true);
  },
}).single("image");

export const uploadVerificationDocuments = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_DOCUMENT_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!DOCUMENT_TYPES.has(file.mimetype)) {
      return cb(new Error("Documents must be a JPEG, PNG, WEBP, or PDF file."));
    }
    cb(null, true);
  },
}).fields([
  { name: "governmentIdDocument", maxCount: 1 },
  { name: "proofOfOwnership", maxCount: 1 },
]);

const MAX_PROPERTY_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB
const MAX_PROPERTY_IMAGES = 8;

export const uploadPropertyImages = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_PROPERTY_IMAGE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!IMAGE_TYPES.has(file.mimetype)) {
      return cb(new Error("Photos must be a JPEG, PNG, or WEBP file."));
    }
    cb(null, true);
  },
}).array("images", MAX_PROPERTY_IMAGES);

const MAX_GENERIC_DOCUMENT_BYTES = 10 * 1024 * 1024; // 10MB

export const uploadSingleDocument = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_GENERIC_DOCUMENT_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!DOCUMENT_TYPES.has(file.mimetype)) {
      return cb(new Error("File must be a JPEG, PNG, WEBP, or PDF."));
    }
    cb(null, true);
  },
}).single("file");

export const uploadApplicationDocuments = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_GENERIC_DOCUMENT_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!DOCUMENT_TYPES.has(file.mimetype)) {
      return cb(new Error("Documents must be a JPEG, PNG, WEBP, or PDF file."));
    }
    cb(null, true);
  },
}).fields([
  { name: "idProof", maxCount: 1 },
  { name: "incomeProof", maxCount: 1 },
  { name: "referenceLetter", maxCount: 1 },
]);

export const uploadMaintenancePhotos = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_PROPERTY_IMAGE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!IMAGE_TYPES.has(file.mimetype)) {
      return cb(new Error("Photos must be a JPEG, PNG, or WEBP file."));
    }
    cb(null, true);
  },
}).array("photos", 5);