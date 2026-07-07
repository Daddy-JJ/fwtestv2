import { getDbPool } from "./db.js";
import { forwardTests, memberships, strategies, uploads, users } from "./data.js";

function toSafeUser(user) {
  if (!user) return null;
  return {
    id: Number(user.id),
    union_id: user.union_id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function getMode() {
  return getDbPool() ? "mysql" : "mock";
}

export async function authByCredentials(email, password) {
  const db = getDbPool();
  if (!db) {
    const user = users.find((item) => item.email === email && item.password === password);
    return toSafeUser(user || null);
  }

  const [rows] = await db.query(
    "SELECT id, union_id, name, email, role, password_plain FROM users WHERE email = ? LIMIT 1",
    [email],
  );
  const row = rows[0];
  if (!row || row.password_plain !== password) {
    return null;
  }

  await db.query("UPDATE users SET last_sign_in_at = NOW() WHERE id = ?", [row.id]);
  return toSafeUser(row);
}

export async function getUserById(userId) {
  const db = getDbPool();
  if (!db) {
    return toSafeUser(users.find((item) => item.id === userId) || null);
  }

  const [rows] = await db.query("SELECT id, union_id, name, email, role FROM users WHERE id = ? LIMIT 1", [userId]);
  return toSafeUser(rows[0] || null);
}

export async function getCurrentMembership(userId) {
  const db = getDbPool();
  if (!db) {
    return memberships.find((item) => item.user_id === userId) || null;
  }

  const [rows] = await db.query("SELECT id, user_id, tier, max_forward_tests, expires_at FROM memberships WHERE user_id = ? LIMIT 1", [userId]);
  return rows[0] || null;
}

export async function upgradeMembership(userId) {
  const db = getDbPool();
  if (!db) {
    const current = memberships.find((item) => item.user_id === userId);
    if (!current) return null;
    current.tier = "premium";
    current.max_forward_tests = -1;
    return current;
  }

  await db.query("UPDATE memberships SET tier = 'premium', max_forward_tests = -1 WHERE user_id = ?", [userId]);
  return getCurrentMembership(userId);
}

export async function listStrategiesByUser(userId) {
  const db = getDbPool();
  if (!db) {
    return strategies.filter((item) => item.user_id === userId);
  }

  const [rows] = await db.query("SELECT id, user_id, name, description, created_at FROM strategies WHERE user_id = ? ORDER BY id DESC", [userId]);
  return rows;
}

export async function createStrategy(userId, payload) {
  const db = getDbPool();
  if (!db) {
    const created = {
      id: strategies.length ? Math.max(...strategies.map((item) => item.id)) + 1 : 1,
      user_id: userId,
      name: payload.name,
      description: payload.description || "",
    };
    strategies.push(created);
    return created;
  }

  const [result] = await db.query("INSERT INTO strategies (user_id, name, description) VALUES (?, ?, ?)", [
    userId,
    payload.name,
    payload.description || null,
  ]);
  const [rows] = await db.query("SELECT id, user_id, name, description, created_at FROM strategies WHERE id = ? LIMIT 1", [
    result.insertId,
  ]);
  return rows[0];
}

export async function updateStrategyById(userId, id, payload) {
  const db = getDbPool();
  if (!db) {
    const row = strategies.find((item) => item.id === id && item.user_id === userId);
    if (!row) return null;
    row.name = payload.name ?? row.name;
    row.description = payload.description ?? row.description;
    return row;
  }

  await db.query(
    "UPDATE strategies SET name = COALESCE(?, name), description = COALESCE(?, description) WHERE id = ? AND user_id = ?",
    [payload.name ?? null, payload.description ?? null, id, userId],
  );
  const [rows] = await db.query("SELECT id, user_id, name, description, created_at FROM strategies WHERE id = ? AND user_id = ? LIMIT 1", [
    id,
    userId,
  ]);
  return rows[0] || null;
}

export async function deleteStrategyById(userId, id) {
  const db = getDbPool();
  if (!db) {
    const idx = strategies.findIndex((item) => item.id === id && item.user_id === userId);
    if (idx < 0) return false;
    strategies.splice(idx, 1);
    return true;
  }

  const [result] = await db.query("DELETE FROM strategies WHERE id = ? AND user_id = ?", [id, userId]);
  return result.affectedRows > 0;
}

export async function listForwardTestsByUser(userId) {
  const db = getDbPool();
  if (!db) {
    return forwardTests.filter((item) => item.user_id === userId);
  }

  const [rows] = await db.query(
    "SELECT id, user_id, strategy_id, emiten, entry_price, take_profit, stop_loss, entry_date, status, notes, created_at, updated_at FROM forward_tests WHERE user_id = ? ORDER BY id DESC",
    [userId],
  );
  return rows;
}

export async function getForwardTestById(userId, id) {
  const db = getDbPool();
  if (!db) {
    return forwardTests.find((item) => item.id === id && item.user_id === userId) || null;
  }

  const [rows] = await db.query(
    "SELECT id, user_id, strategy_id, emiten, entry_price, take_profit, stop_loss, entry_date, status, notes, created_at, updated_at FROM forward_tests WHERE id = ? AND user_id = ? LIMIT 1",
    [id, userId],
  );
  return rows[0] || null;
}

export async function createForwardTest(userId, payload) {
  const db = getDbPool();
  if (!db) {
    const created = {
      id: forwardTests.length ? Math.max(...forwardTests.map((item) => item.id)) + 1 : 1,
      user_id: userId,
      strategy_id: payload.strategy_id || null,
      emiten: String(payload.emiten).toUpperCase(),
      entry_price: Number(payload.entry_price),
      take_profit: Number(payload.take_profit),
      stop_loss: Number(payload.stop_loss),
      entry_date: payload.entry_date,
      status: payload.status || "active",
      notes: payload.notes || "",
    };
    forwardTests.push(created);
    return created;
  }

  const [result] = await db.query(
    "INSERT INTO forward_tests (user_id, strategy_id, emiten, entry_price, take_profit, stop_loss, entry_date, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      userId,
      payload.strategy_id || null,
      String(payload.emiten).toUpperCase(),
      Number(payload.entry_price),
      Number(payload.take_profit),
      Number(payload.stop_loss),
      payload.entry_date,
      payload.status || "active",
      payload.notes || null,
    ],
  );
  return getForwardTestById(userId, result.insertId);
}

export async function updateForwardTestById(userId, id, payload) {
  const db = getDbPool();
  if (!db) {
    const row = forwardTests.find((item) => item.id === id && item.user_id === userId);
    if (!row) return null;
    Object.assign(row, {
      strategy_id: payload.strategy_id ?? row.strategy_id,
      emiten: payload.emiten ? String(payload.emiten).toUpperCase() : row.emiten,
      entry_price: payload.entry_price ?? row.entry_price,
      take_profit: payload.take_profit ?? row.take_profit,
      stop_loss: payload.stop_loss ?? row.stop_loss,
      entry_date: payload.entry_date ?? row.entry_date,
      status: payload.status ?? row.status,
      notes: payload.notes ?? row.notes,
    });
    return row;
  }

  await db.query(
    "UPDATE forward_tests SET strategy_id = COALESCE(?, strategy_id), emiten = COALESCE(?, emiten), entry_price = COALESCE(?, entry_price), take_profit = COALESCE(?, take_profit), stop_loss = COALESCE(?, stop_loss), entry_date = COALESCE(?, entry_date), status = COALESCE(?, status), notes = COALESCE(?, notes) WHERE id = ? AND user_id = ?",
    [
      payload.strategy_id ?? null,
      payload.emiten ? String(payload.emiten).toUpperCase() : null,
      payload.entry_price ?? null,
      payload.take_profit ?? null,
      payload.stop_loss ?? null,
      payload.entry_date ?? null,
      payload.status ?? null,
      payload.notes ?? null,
      id,
      userId,
    ],
  );

  return getForwardTestById(userId, id);
}

export async function deleteForwardTestById(userId, id) {
  const db = getDbPool();
  if (!db) {
    const idx = forwardTests.findIndex((item) => item.id === id && item.user_id === userId);
    if (idx < 0) return false;
    forwardTests.splice(idx, 1);
    return true;
  }

  const [result] = await db.query("DELETE FROM forward_tests WHERE id = ? AND user_id = ?", [id, userId]);
  return result.affectedRows > 0;
}

export async function getAnalyticsStats(userId) {
  const db = getDbPool();
  if (!db) {
    const rows = forwardTests.filter((item) => item.user_id === userId);
    const total = rows.length;
    const wins = rows.filter((item) => item.status === "tp_hit").length;
    const losses = rows.filter((item) => item.status === "sl_hit").length;
    const win_rate = total ? Number(((wins / total) * 100).toFixed(2)) : 0;
    return { total, wins, losses, win_rate };
  }

  const [rows] = await db.query(
    "SELECT COUNT(*) AS total, SUM(CASE WHEN status = 'tp_hit' THEN 1 ELSE 0 END) AS wins, SUM(CASE WHEN status = 'sl_hit' THEN 1 ELSE 0 END) AS losses FROM forward_tests WHERE user_id = ?",
    [userId],
  );
  const row = rows[0] || {};
  const total = Number(row.total || 0);
  const wins = Number(row.wins || 0);
  const losses = Number(row.losses || 0);
  const win_rate = total ? Number(((wins / total) * 100).toFixed(2)) : 0;
  return { total, wins, losses, win_rate };
}

export async function getAnalyticsDistribution(userId) {
  const db = getDbPool();
  if (!db) {
    const rows = forwardTests.filter((item) => item.user_id === userId);
    const total = rows.length || 1;
    const tp = rows.filter((item) => item.status === "tp_hit").length;
    const sl = rows.filter((item) => item.status === "sl_hit").length;
    const active = rows.filter((item) => item.status === "active").length;
    const manual = rows.filter((item) => item.status === "manual_close").length;
    return {
      tp_hit: Number(((tp / total) * 100).toFixed(2)),
      sl_hit: Number(((sl / total) * 100).toFixed(2)),
      active: Number(((active / total) * 100).toFixed(2)),
      manual_close: Number(((manual / total) * 100).toFixed(2)),
    };
  }

  const [rows] = await db.query(
    "SELECT status, COUNT(*) AS total FROM forward_tests WHERE user_id = ? GROUP BY status",
    [userId],
  );
  const totalCount = rows.reduce((sum, item) => sum + Number(item.total), 0) || 1;
  const grouped = Object.fromEntries(rows.map((item) => [item.status, Number(item.total)]));
  return {
    tp_hit: Number((((grouped.tp_hit || 0) / totalCount) * 100).toFixed(2)),
    sl_hit: Number((((grouped.sl_hit || 0) / totalCount) * 100).toFixed(2)),
    active: Number((((grouped.active || 0) / totalCount) * 100).toFixed(2)),
    manual_close: Number((((grouped.manual_close || 0) / totalCount) * 100).toFixed(2)),
  };
}

export async function listUsers() {
  const db = getDbPool();
  if (!db) {
    return users.map((item) => toSafeUser(item));
  }
  const [rows] = await db.query("SELECT id, union_id, name, email, role FROM users ORDER BY id ASC");
  return rows;
}

export async function updateUserRole(userId, role) {
  const db = getDbPool();
  if (!db) {
    const user = users.find((item) => item.id === userId);
    if (!user) return null;
    user.role = role;
    return toSafeUser(user);
  }

  await db.query("UPDATE users SET role = ? WHERE id = ?", [role, userId]);
  const [rows] = await db.query("SELECT id, union_id, name, email, role FROM users WHERE id = ? LIMIT 1", [userId]);
  return rows[0] || null;
}

export async function listMemberships() {
  const db = getDbPool();
  if (!db) {
    return memberships;
  }
  const [rows] = await db.query("SELECT id, user_id, tier, max_forward_tests, expires_at FROM memberships ORDER BY id ASC");
  return rows;
}

export async function updateMembershipById(id, payload) {
  const db = getDbPool();
  if (!db) {
    const row = memberships.find((item) => item.id === id);
    if (!row) return null;
    row.tier = payload.tier ?? row.tier;
    row.max_forward_tests = payload.max_forward_tests ?? row.max_forward_tests;
    return row;
  }

  await db.query("UPDATE memberships SET tier = COALESCE(?, tier), max_forward_tests = COALESCE(?, max_forward_tests) WHERE id = ?", [
    payload.tier ?? null,
    payload.max_forward_tests ?? null,
    id,
  ]);
  const [rows] = await db.query("SELECT id, user_id, tier, max_forward_tests, expires_at FROM memberships WHERE id = ? LIMIT 1", [id]);
  return rows[0] || null;
}

export async function createUploadRecord(userId, payload) {
  const db = getDbPool();
  if (!db) {
    const created = {
      id: uploads.length ? Math.max(...uploads.map((item) => item.id)) + 1 : 1,
      user_id: userId,
      file_url: payload.file_url,
      file_type: payload.file_type || "image/png",
      ocr_payload: payload.ocr_payload || null,
    };
    uploads.push(created);
    return created;
  }

  const [result] = await db.query("INSERT INTO uploads (user_id, file_url, file_type, ocr_payload) VALUES (?, ?, ?, ?)", [
    userId,
    payload.file_url,
    payload.file_type || "image/png",
    payload.ocr_payload ? JSON.stringify(payload.ocr_payload) : null,
  ]);
  const [rows] = await db.query("SELECT id, user_id, file_url, file_type, ocr_payload, created_at FROM uploads WHERE id = ? LIMIT 1", [
    result.insertId,
  ]);
  return rows[0];
}

export async function searchStocks(query) {
  const q = String(query || "").toUpperCase();
  const db = getDbPool();
  if (!db) {
    const universe = ["BBCA", "TLKM", "ASII", "UNTR", "BMRI", "ADRO"];
    return universe.filter((item) => item.includes(q));
  }

  if (!q) {
    const [rows] = await db.query("SELECT DISTINCT emiten FROM stock_prices ORDER BY emiten ASC LIMIT 20");
    return rows.map((row) => row.emiten);
  }

  const [rows] = await db.query("SELECT DISTINCT emiten FROM stock_prices WHERE emiten LIKE ? ORDER BY emiten ASC LIMIT 20", [
    `%${q}%`,
  ]);
  return rows.map((row) => row.emiten);
}

export async function getStockHistorical(emiten, days) {
  const normalized = String(emiten).toUpperCase();
  const limitDays = Math.max(1, Math.min(Number(days || 30), 365));
  const db = getDbPool();
  if (!db) {
    return Array.from({ length: limitDays }).map((_, idx) => ({
      emiten: normalized,
      price_date: `2026-06-${String((idx % 30) + 1).padStart(2, "0")}`,
      open: 1000 + idx * 5,
      high: 1015 + idx * 5,
      low: 990 + idx * 5,
      close: 1008 + idx * 5,
      volume: 1000000 + idx * 5000,
    }));
  }

  const [rows] = await db.query(
    "SELECT emiten, price_date, open_price AS open, high_price AS high, low_price AS low, close_price AS close, volume FROM stock_prices WHERE emiten = ? ORDER BY price_date DESC LIMIT ?",
    [normalized, limitDays],
  );

  return [...rows].reverse();
}

export async function getStockCurrent(emiten) {
  const normalized = String(emiten).toUpperCase();
  const db = getDbPool();
  if (!db) {
    return { emiten: normalized, close: 9875, change_percent: 1.28 };
  }

  const [rows] = await db.query(
    "SELECT close_price, price_date FROM stock_prices WHERE emiten = ? ORDER BY price_date DESC LIMIT 2",
    [normalized],
  );

  if (!rows.length) {
    return { emiten: normalized, close: null, change_percent: 0 };
  }

  const latest = Number(rows[0].close_price);
  const previous = rows[1] ? Number(rows[1].close_price) : latest;
  const change_percent = previous ? Number((((latest - previous) / previous) * 100).toFixed(2)) : 0;
  return { emiten: normalized, close: latest, change_percent };
}

export function getStoreMode() {
  return getMode();
}
