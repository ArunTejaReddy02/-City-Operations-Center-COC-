import { Router } from "express";
import { authenticateJWT, requireRole } from "@vizagops/api";
import { Role } from "@vizagops/prisma";
import { getDashboardStats, getWardDistribution } from "./controller";

const router = Router();

// Dashboard analytics — officer/admin only
router.get("/dashboard", authenticateJWT, requireRole([Role.ADMIN, Role.WARD_OFFICER]), getDashboardStats);
router.get("/wards", authenticateJWT, requireRole([Role.ADMIN, Role.WARD_OFFICER]), getWardDistribution);

export default router;
