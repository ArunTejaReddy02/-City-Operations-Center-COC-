import { Router } from "express";
import { authenticateJWT, requireRole } from "@vizagops/api";
import { Role } from "@vizagops/prisma";
import { correlateComplaint, suggestTeam } from "./controller";

const router = Router();

// Both endpoints are officer/admin only
router.post("/correlate", authenticateJWT, requireRole([Role.ADMIN, Role.WARD_OFFICER]), correlateComplaint);
router.get("/suggest-team/:complaintId", authenticateJWT, requireRole([Role.ADMIN, Role.WARD_OFFICER]), suggestTeam);

export default router;
