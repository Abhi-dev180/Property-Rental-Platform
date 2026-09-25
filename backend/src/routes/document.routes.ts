import { Router } from "express";
import * as documentController from "../controllers/document.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { uploadSingleDocument } from "../middleware/upload.middleware";

const router = Router();
router.use(requireAuth);

router.post("/:category", uploadSingleDocument, documentController.uploadDocument);
router.get("/", documentController.listMyDocuments);
router.delete("/:id", documentController.deleteDocument);

export default router;

