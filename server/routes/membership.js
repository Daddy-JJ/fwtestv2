import { Router } from "express";
import { getCurrentMembership, getStoreMode, upgradeMembership } from "../store.js";

export const membershipRouter = Router();

membershipRouter.get("/current", async (_req, res) => {
  try {
    const current = await getCurrentMembership(_req.auth.userId);
    res.json({ ok: true, mode: getStoreMode(), membership: current || null });
  } catch (error) {
    res.status(500).json({ ok: false, error: "Membership lookup failed", detail: String(error.message || error) });
  }
});

membershipRouter.post("/upgrade", async (_req, res) => {
  try {
    const current = await upgradeMembership(_req.auth.userId);
    if (!current) {
      return res.status(404).json({ ok: false, error: "Membership not found" });
    }

    return res.json({ ok: true, mode: getStoreMode(), membership: current });
  } catch (error) {
    return res.status(500).json({ ok: false, error: "Membership upgrade failed", detail: String(error.message || error) });
  }
});

membershipRouter.get("/check-limit", async (_req, res) => {
  try {
    const current = await getCurrentMembership(_req.auth.userId);
    if (!current) {
      return res.status(404).json({ ok: false, error: "Membership not found" });
    }

    const limit = current.max_forward_tests;
    return res.json({
      ok: true,
      mode: getStoreMode(),
      tier: current.tier,
      max_forward_tests: limit,
      unlimited: limit < 0,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: "Check limit failed", detail: String(error.message || error) });
  }
});
