import { Router } from "express";
import { validateRequest, authenticateJWT } from "@vizagops/api";
import { CreateComplaintSchema } from "@vizagops/validation";
import { createComplaint, getComplaints } from "./controller";

const router = Router();
router.post("/", authenticateJWT, validateRequest(CreateComplaintSchema), createComplaint);
router.get("/", authenticateJWT, getComplaints);
export default router;
