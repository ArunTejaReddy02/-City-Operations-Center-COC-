import express from "express";
import helmet from "helmet";
import cors from "cors";
import { config } from "@vizagops/config";
import { logger, requestLogger } from "@vizagops/logger";
import { globalErrorHandler, sendSuccess } from "@vizagops/api";
import auditRoutes from "./routes";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(requestLogger);

app.get("/health", (req, res) => sendSuccess(res, {
  status: "UP",
  service: "audit",
  version: "1.0.0",
  environment: config.NODE_ENV,
  uptime: process.uptime()
}));
app.get("/ready", (req, res) => sendSuccess(res, { status: "READY", service: "audit" }));

app.use("/api/v1/audit", auditRoutes);

app.use(globalErrorHandler);

const PORT = 3001;
app.listen(PORT, () => {
  logger.info({ message: "Audit Service started", port: PORT, env: config.NODE_ENV });
});
