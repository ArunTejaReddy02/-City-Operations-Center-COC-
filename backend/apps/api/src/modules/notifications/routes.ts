import { Router } from "express";
import { authenticateJWT, requireRole } from "@vizagops/api";
import { Role } from "@vizagops/prisma";
import { getNotifications, createNotification, markNotificationRead } from "./controller";

const router = Router();

router.get("/", authenticateJWT, getNotifications);
router.post("/", authenticateJWT, requireRole([Role.ADMIN, Role.WARD_OFFICER]), createNotification);
router.patch("/:id/read", authenticateJWT, markNotificationRead);

export default router;
