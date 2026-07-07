import { Router } from "express";
import { getStoreMode, listMemberships, listUsers, updateMembershipById, updateUserRole } from "../store.js";

export const adminRouter = Router();

adminRouter.get("/users", async (_req, res) => {
  try {
    const data = await listUsers();
    res.json({ ok: true, mode: getStoreMode(), data });
  } catch (error) {
    res.status(500).json({ ok: false, error: "List users failed", detail: String(error.message || error) });
  }
});

adminRouter.put("/users/:id/role", async (req, res) => {
  const id = Number(req.params.id);
  if (!["user", "admin"].includes(req.body?.role)) {
    return res.status(400).json({ ok: false, error: "role must be user|admin" });
  }

  try {
    const user = await updateUserRole(id, req.body.role);
    if (!user) {
      return res.status(404).json({ ok: false, error: "User not found" });
    }

    return res.json({ ok: true, mode: getStoreMode(), data: user });
  } catch (error) {
    return res.status(500).json({ ok: false, error: "Update user role failed", detail: String(error.message || error) });
  }
});

adminRouter.get("/memberships", async (_req, res) => {
  try {
    const data = await listMemberships();
    res.json({ ok: true, mode: getStoreMode(), data });
  } catch (error) {
    res.status(500).json({ ok: false, error: "List memberships failed", detail: String(error.message || error) });
  }
});

adminRouter.put("/memberships/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const row = await updateMembershipById(id, req.body || {});
    if (!row) {
      return res.status(404).json({ ok: false, error: "Membership not found" });
    }

    return res.json({ ok: true, mode: getStoreMode(), data: row });
  } catch (error) {
    return res.status(500).json({ ok: false, error: "Update membership failed", detail: String(error.message || error) });
  }
});
