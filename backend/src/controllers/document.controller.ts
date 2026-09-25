import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as storageService from "../services/storage.service";
import { DocumentCategory } from "../types";

const ALLOWED_CATEGORIES: DocumentCategory[] = [
  "USER_DOCUMENT", "LEASE_DOCUMENT", "RECEIPT", "MAINTENANCE_ATTACHMENT",
];

const categoryParamSchema = z.object({
  category: z.enum(ALLOWED_CATEGORIES as [DocumentCategory, ...DocumentCategory[]]),
});

export async function uploadDocument(req: Request, res: Response, next: NextFunction) {
  try {
    const { category } = categoryParamSchema.parse({ category: req.params.category });
    if (!req.file) return res.status(400).json({ message: "No file uploaded." });

    const doc = await storageService.uploadDocument({
      ownerId: req.user!.sub,
      category,
      file: req.file,
    });
    res.status(201).json({ document: doc });
  } catch (err) { next(err); }
}

export async function listMyDocuments(req: Request, res: Response, next: NextFunction) {
  try {
    const category = req.query.category as DocumentCategory | undefined;
    const docs = await storageService.listDocuments({ ownerId: req.user!.sub, category });
    const withUrls = await Promise.all(
      docs.map(async (d) => ({ ...d, url: await storageService.getSignedUrl(d) }))
    );
    res.status(200).json({ documents: withUrls });
  } catch (err) { next(err); }
}

export async function deleteDocument(req: Request, res: Response, next: NextFunction) {
  try {
    await storageService.deleteDocument(req.params.id as string, req.user!.sub);
    res.status(200).json({ message: "Document deleted." });
  } catch (err) { next(err); }
}