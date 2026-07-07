import express from "express";
import cors from "cors";
import { checkDbConnection } from "./db.js";
import { authSessionMiddleware } from "./middleware/auth.js";
import { apiRouter } from "./routes/index.js";

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());
app.use(authSessionMiddleware);

app.get("/health", async (_req, res) => {
  try {
    const dbStatus = await checkDbConnection();
    res.json({ ok: true, db: dbStatus });
  } catch (error) {
    res.status(500).json({ ok: false, error: "Health check failed", detail: String(error.message || error) });
  }
});

app.use("/api", apiRouter);

app.use((_req, res) => {
  res.status(404).json({ ok: false, error: "Not found" });
});

app.listen(port, () => {
  console.log(`[fwtestv2] API running on http://localhost:${port}`);
});
