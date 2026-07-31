import { Router } from "express";
import { validateRequest } from "@vizagops/api";
import { CreateAuditSchema } from "@vizagops/validation";
import { createLog, verifyChain, getLog } from "./controller";

const router = Router();

// Internal (Protected in real environment)
router.post("/log", validateRequest(CreateAuditSchema), createLog);

// External (Read-only)
router.get("/verify", verifyChain);
router.get("/:id", getLog);

export default router;
