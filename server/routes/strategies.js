import { Router } from "express";
import { createStrategy, deleteStrategyById, getStoreMode, listStrategiesByUser, updateStrategyById } from "../store.js";

export const strategyRouter = Router();

strategyRouter.get("/", async (_req, res) => {
  try {
    const rows = await listStrategiesByUser(_req.auth.userId);
    res.json({ ok: true, mode: getStoreMode(), data: rows });
  } catch (error) {
    res.status(500).json({ ok: false, error: "List strategies failed", detail: String(error.message || error) });
  }
});

strategyRouter.post("/", async (req, res) => {
  const { name, description } = req.body || {};
  if (!name) {
    return res.status(400).json({ ok: false, error: "name is required" });
  }

  try {
    const created = await createStrategy(req.auth.userId, { name, description });
    return res.status(201).json({ ok: true, mode: getStoreMode(), data: created });
  } catch (error) {
    return res.status(500).json({ ok: false, error: "Create strategy failed", detail: String(error.message || error) });
  }
});

strategyRouter.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const row = await updateStrategyById(req.auth.userId, id, req.body || {});
    if (!row) {
      return res.status(404).json({ ok: false, error: "Strategy not found" });
    }
    return res.json({ ok: true, mode: getStoreMode(), data: row });
  } catch (error) {
    return res.status(500).json({ ok: false, error: "Update strategy failed", detail: String(error.message || error) });
  }
});

strategyRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const deleted = await deleteStrategyById(req.auth.userId, id);
    if (!deleted) {
      return res.status(404).json({ ok: false, error: "Strategy not found" });
    }
    return res.json({ ok: true, mode: getStoreMode() });
  } catch (error) {
    return res.status(500).json({ ok: false, error: "Delete strategy failed", detail: String(error.message || error) });
  }
});
