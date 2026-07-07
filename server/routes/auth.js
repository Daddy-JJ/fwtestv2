import { Router } from "express";
import { authByCredentials, getStoreMode, getUserById } from "../store.js";
import { createSession, requireAuth, revokeSession } from "../middleware/auth.js";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ ok: false, error: "email and password are required" });
  }

  try {
    const user = await authByCredentials(email, password);
    if (!user) {
      return res.status(401).json({ ok: false, error: "Invalid credentials" });
    }

    const token = await createSession(user);
    return res.json({ ok: true, token, mode: getStoreMode(), user });
  } catch (error) {
    return res.status(500).json({ ok: false, error: "Login failed", detail: String(error.message || error) });
  }
});

authRouter.post("/logout", requireAuth, async (req, res) => {
  await revokeSession(req.auth?.token);
  res.json({ ok: true, message: "Logged out" });
});

authRouter.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await getUserById(req.auth.userId);
    return res.json({ ok: true, mode: getStoreMode(), user: user || null });
  } catch (error) {
    return res.status(500).json({ ok: false, error: "Get profile failed", detail: String(error.message || error) });
  }
});
