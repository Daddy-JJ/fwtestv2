import { getDbPool } from "./db.js";

const SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const memorySessions = new Map();

function nowIso() {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

function expiresAtDate() {
  return new Date(Date.now() + SESSION_TTL_MS);
}

function cleanupMemorySessions() {
  const now = Date.now();
  for (const [token, session] of memorySessions.entries()) {
    if (session.expiresAt <= now) {
      memorySessions.delete(token);
    }
  }
}

export async function createSessionRecord(token, user) {
  const db = getDbPool();
  if (!db) {
    cleanupMemorySessions();
    memorySessions.set(token, {
      userId: Number(user.id),
      role: user.role,
      expiresAt: Date.now() + SESSION_TTL_MS,
    });
    return;
  }

  await db.query(
    "INSERT INTO auth_sessions (token, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)",
    [token, Number(user.id), expiresAtDate(), nowIso()],
  );
}

export async function getSessionRecord(token) {
  const db = getDbPool();
  if (!db) {
    cleanupMemorySessions();
    const session = memorySessions.get(token);
    if (!session || session.expiresAt <= Date.now()) {
      memorySessions.delete(token);
      return null;
    }
    return {
      token,
      userId: session.userId,
      role: session.role,
    };
  }

  const [rows] = await db.query(
    "SELECT s.token, s.user_id AS userId, u.role AS role, s.expires_at AS expiresAt FROM auth_sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ? LIMIT 1",
    [token],
  );

  const row = rows[0];
  if (!row) {
    return null;
  }

  if (new Date(row.expiresAt).getTime() <= Date.now()) {
    await db.query("DELETE FROM auth_sessions WHERE token = ?", [token]);
    return null;
  }

  return {
    token: row.token,
    userId: Number(row.userId),
    role: row.role,
  };
}

export async function revokeSessionRecord(token) {
  if (!token) return;

  const db = getDbPool();
  if (!db) {
    memorySessions.delete(token);
    return;
  }

  await db.query("DELETE FROM auth_sessions WHERE token = ?", [token]);
}
