import { Router } from "express";
import { authRouter } from "./auth.js";
import { membershipRouter } from "./membership.js";
import { strategyRouter } from "./strategies.js";
import { forwardTestRouter } from "./forward-tests.js";
import { analyticsRouter } from "./analytics.js";
import { stockRouter } from "./stocks.js";
import { uploadRouter } from "./uploads.js";
import { adminRouter } from "./admin.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/stocks", stockRouter);
apiRouter.use(requireAuth);
apiRouter.use("/membership", membershipRouter);
apiRouter.use("/strategies", strategyRouter);
apiRouter.use("/forward-tests", forwardTestRouter);
apiRouter.use("/analytics", analyticsRouter);
apiRouter.use("/uploads", uploadRouter);
apiRouter.use("/ocr", uploadRouter);
apiRouter.use("/admin", requireAdmin, adminRouter);
