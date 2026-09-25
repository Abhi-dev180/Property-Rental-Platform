import { Router } from "express";
import * as propertyController from "../controllers/property.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { uploadPropertyImages } from "../middleware/upload.middleware";

const router = Router();

// Landlord-only for now — tenant browsing is a separate future feature.
router.use(requireAuth, requireRole("LANDLORD"));

router.get("/", propertyController.listProperties);
router.post("/", propertyController.createProperty);

router.get("/:id", propertyController.getProperty);
router.patch("/:id", propertyController.updateProperty);
router.delete("/:id", propertyController.deleteProperty);

router.post("/:id/images", uploadPropertyImages, propertyController.uploadPropertyImages);
router.delete("/:id/images", propertyController.removePropertyImage);

export default router;