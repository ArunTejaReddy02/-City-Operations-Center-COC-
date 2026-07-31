import { Router } from "express";
import { getComplaintStatus } from "./controller";

const router = Router();

// Public endpoint — no authentication required
// Citizens can track their complaint status with just the ID
router.get("/:complaintId", getComplaintStatus);

export default router;
