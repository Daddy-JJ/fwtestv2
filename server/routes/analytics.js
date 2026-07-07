import { Router } from "express";
import { getAnalyticsDistribution, getAnalyticsStats, getStoreMode } from "../store.js";

export const analyticsRouter = Router();

analyticsRouter.get("/stats", async (_req, res) => {
  try {
    const data = await getAnalyticsStats(_req.auth.userId);
    res.json({ ok: true, mode: getStoreMode(), data });
  } catch (error) {
    res.status(500).json({ ok: false, error: "Analytics stats failed", detail: String(error.message || error) });
  }
});

analyticsRouter.get("/win-rate-trend", (_req, res) => {
  res.json({
    ok: true,
    data: [
      { month: "Jan", value: 54 },
      { month: "Feb", value: 57 },
      { month: "Mar", value: 61 },
      { month: "Apr", value: 65 },
      { month: "May", value: 68 },
    ],
  });
});

analyticsRouter.get("/duration", (_req, res) => {
  res.json({ ok: true, data: { tp_days_avg: 11, sl_days_avg: 7 } });
});

analyticsRouter.get("/distribution", async (_req, res) => {
  try {
    const data = await getAnalyticsDistribution(_req.auth.userId);
    res.json({ ok: true, mode: getStoreMode(), data });
  } catch (error) {
    res.status(500).json({ ok: false, error: "Analytics distribution failed", detail: String(error.message || error) });
  }
});
