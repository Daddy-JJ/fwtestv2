import { Router } from "express";
import { getStockCurrent, getStockHistorical, getStoreMode, searchStocks } from "../store.js";

export const stockRouter = Router();

stockRouter.get("/search", async (req, res) => {
  try {
    const data = await searchStocks(req.query.q);
    res.json({ ok: true, mode: getStoreMode(), data });
  } catch (error) {
    res.status(500).json({ ok: false, error: "Stock search failed", detail: String(error.message || error) });
  }
});

stockRouter.get("/:emiten/historical", async (req, res) => {
  try {
    const data = await getStockHistorical(req.params.emiten, req.query.days);
    res.json({ ok: true, mode: getStoreMode(), data });
  } catch (error) {
    res.status(500).json({ ok: false, error: "Stock historical failed", detail: String(error.message || error) });
  }
});

stockRouter.get("/:emiten/current", async (req, res) => {
  try {
    const data = await getStockCurrent(req.params.emiten);
    res.json({ ok: true, mode: getStoreMode(), data });
  } catch (error) {
    res.status(500).json({ ok: false, error: "Stock current failed", detail: String(error.message || error) });
  }
});
