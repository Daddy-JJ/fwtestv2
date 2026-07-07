import { Router } from "express";
import {
  createForwardTest,
  deleteForwardTestById,
  getForwardTestById,
  getStoreMode,
  listForwardTestsByUser,
  updateForwardTestById,
} from "../store.js";

export const forwardTestRouter = Router();

forwardTestRouter.get("/", async (_req, res) => {
  try {
    const data = await listForwardTestsByUser(_req.auth.userId);
    res.json({ ok: true, mode: getStoreMode(), data });
  } catch (error) {
    res.status(500).json({ ok: false, error: "List forward tests failed", detail: String(error.message || error) });
  }
});

forwardTestRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const row = await getForwardTestById(req.auth.userId, id);
    if (!row) {
      return res.status(404).json({ ok: false, error: "Forward test not found" });
    }

    return res.json({ ok: true, mode: getStoreMode(), data: row });
  } catch (error) {
    return res.status(500).json({ ok: false, error: "Get forward test failed", detail: String(error.message || error) });
  }
});

forwardTestRouter.post("/", async (req, res) => {
  const { emiten, entry_price, take_profit, stop_loss, entry_date, strategy_id, status, notes } = req.body || {};
  if (!emiten || !entry_price || !take_profit || !stop_loss || !entry_date) {
    return res.status(400).json({ ok: false, error: "Required fields are missing" });
  }

  try {
    const created = await createForwardTest(req.auth.userId, {
      emiten,
      entry_price,
      take_profit,
      stop_loss,
      entry_date,
      strategy_id,
      status,
      notes,
    });
    return res.status(201).json({ ok: true, mode: getStoreMode(), data: created });
  } catch (error) {
    return res.status(500).json({ ok: false, error: "Create forward test failed", detail: String(error.message || error) });
  }
});

forwardTestRouter.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const row = await updateForwardTestById(req.auth.userId, id, req.body || {});
    if (!row) {
      return res.status(404).json({ ok: false, error: "Forward test not found" });
    }

    return res.json({ ok: true, mode: getStoreMode(), data: row });
  } catch (error) {
    return res.status(500).json({ ok: false, error: "Update forward test failed", detail: String(error.message || error) });
  }
});

forwardTestRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const deleted = await deleteForwardTestById(req.auth.userId, id);
    if (!deleted) {
      return res.status(404).json({ ok: false, error: "Forward test not found" });
    }

    return res.json({ ok: true, mode: getStoreMode() });
  } catch (error) {
    return res.status(500).json({ ok: false, error: "Delete forward test failed", detail: String(error.message || error) });
  }
});
