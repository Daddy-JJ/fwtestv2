import crypto from "node:crypto";
import { createSessionRecord, getSessionRecord, revokeSessionRecord } from "../session-store.js";
import { getDbPool } from "../db.js";

const SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const STATELESS_PREFIX = "fwtestv2s";
const SESSION_SECRET = process.env.SESSION_SECRET || "fwtestv2-dev-secret-change-me";

function useStatelessSession() {
  return !getDbPool();
}

function toBase64Url(input) {
  return Buffer.from(input).toString("base64url");
}

function signPayload(payloadB64) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(payloadB64).digest("base64url");
}

function createStatelessToken(user) {
  const payload = {
    uid: Number(user.id),
    role: user.role,
    exp: Date.now() + SESSION_TTL_MS,
  };
  const payloadB64 = toBase64Url(JSON.stringify(payload));
  const signature = signPayload(payloadB64);
  return `${STATELESS_PREFIX}.${payloadB64}.${signature}`;
}

function verifyStatelessToken(token) {
  const parts = String(token || "").split(".");
  if (parts.length !== 3 || parts[0] !== STATELESS_PREFIX) {
    return null;
  }

  const payloadB64 = parts[1];
  const signature = parts[2];
  const expected = signPayload(payloadB64);

  const signatureBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (signatureBuf.length !== expectedBuf.length) {
    return null;
  }
  if (!crypto.timingSafeEqual(signatureBuf, expectedBuf)) {
    return null;
  }

  try {
    const payloadJson = Buffer.from(payloadB64, "base64url").toString("utf8");
    const payload = JSON.parse(payloadJson);
    if (!payload?.uid || !payload?.role || !payload?.exp) {
      return null;
    }
    if (Number(payload.exp) <= Date.now()) {
      return null;
    }

    return {
      token,
      userId: Number(payload.uid),
      role: payload.role,
    };
  } catch (_error) {
    return null;
  }
}

export async function createSession(user) {
  if (useStatelessSession()) {
    return createStatelessToken(user);
  }

  const token = `fwtestv2-${crypto.randomUUID()}`;
  await createSessionRecord(token, user);
  return token;
}

export async function revokeSession(token) {
  if (useStatelessSession()) {
    return;
  }
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

  if (useStatelessSession()) {
    const session = verifyStatelessToken(token);
    req.auth = session
      ? {
          token,
          userId: session.userId,
          role: session.role,
        }
      : null;
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
