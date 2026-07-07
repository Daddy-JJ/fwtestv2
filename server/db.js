import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

let pool;

export function getDbPool() {
  if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
    return null;
  }

  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
    });
  }

  return pool;
}

export async function checkDbConnection() {
  const db = getDbPool();
  if (!db) {
    return { ok: false, mode: "mock", message: "DB env belum diset, backend berjalan mode mock" };
  }

  await db.query("SELECT 1");
  return { ok: true, mode: "mysql", message: "MySQL connection OK" };
}
