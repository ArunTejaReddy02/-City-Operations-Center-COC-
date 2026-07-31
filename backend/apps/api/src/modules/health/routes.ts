import { Router } from "express";
import { sendSuccess } from "@vizagops/api";
import { config } from "@vizagops/config";

const router = Router();
router.get("/", (req, res) => sendSuccess(res, {
  status: "UP",
  service: "api-gateway",
  version: "1.0.0",
  environment: config.NODE_ENV,
  uptime: process.uptime()
}));
router.get("/ready", (req, res) => sendSuccess(res, { status: "READY", service: "api-gateway" }));
export default router;
