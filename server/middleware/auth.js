import crypto from "node:crypto";
import { createSessionRecord, getSessionRecord, revokeSessionRecord } from "../session-store.js";

export async function createSession(user) {
  const token = `fwtestv2-${crypto.randomUUID()}`;
  await createSessionRecord(token, user);
  return token;
}

export async function revokeSession(token) {
  await revokeSessionRecord(token);
}

function parseBearerToken(authorizationHeader) {
  if (!authorizationHeader) return null;
  const [scheme, token] = authorizationHeader.split(" ");
  if (!scheme || !token) return null;
  if (scheme.toLowerCase() !== "bearer") return null;
  return token.trim();
}

export function authSessionMiddleware(req, _res, next) {
  const token = parseBearerToken(req.headers.authorization);
  if (!token) {
    req.auth = null;
    return next();
  }

  return getSessionRecord(token)
    .then((session) => {
      if (!session) {
        req.auth = null;
      } else {
        req.auth = {
          token,
          userId: session.userId,
          role: session.role,
        };
      }
      return next();
    })
    .catch((_error) => {
      req.auth = null;
      return next();
    });
}

export function requireAuth(req, res, next) {
  if (!req.auth?.userId) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }
  return next();
}

export function requireAdmin(req, res, next) {
  if (!req.auth?.userId) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }
  if (req.auth.role !== "admin") {
    return res.status(403).json({ ok: false, error: "Forbidden" });
  }
  return next();
}
