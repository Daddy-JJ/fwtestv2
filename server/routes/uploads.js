import { Router } from "express";
import { createUploadRecord, getStoreMode } from "../store.js";

export const uploadRouter = Router();

uploadRouter.post("/screenshot", async (req, res, next) => {
  if (!req.baseUrl.endsWith("/uploads")) {
    return next();
  }

  const { file_url } = req.body || {};
  if (!file_url) {
    return res.status(400).json({ ok: false, error: "file_url is required" });
  }

  try {
    const created = await createUploadRecord(req.auth.userId, {
      file_url,
      file_type: req.body?.file_type || "image/png",
      ocr_payload: null,
    });
    return res.status(201).json({ ok: true, mode: getStoreMode(), data: created });
  } catch (error) {
    return res.status(500).json({ ok: false, error: "Upload failed", detail: String(error.message || error) });
  }
});

uploadRouter.post("/parse", (req, res, next) => {
  if (!req.baseUrl.endsWith("/ocr")) {
    return next();
  }

  const { text } = req.body || {};
  const payload = {
    emiten: "UNTR",
    entry_price: 24850,
    take_profit: 26300,
    stop_loss: 24000,
    raw_text: text || "mock parsed text",
  };

  return res.json({ ok: true, mode: getStoreMode(), data: payload });
});
