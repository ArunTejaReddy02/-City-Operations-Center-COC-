import { Router } from "express";
import { authenticateJWT } from "@vizagops/api";
import { createSensorEvent, getSensorEvents } from "./controller";

const router = Router();
router.post("/", authenticateJWT, createSensorEvent);
router.get("/", authenticateJWT, getSensorEvents);
export default router;
