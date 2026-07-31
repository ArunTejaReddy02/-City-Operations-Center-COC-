import { Router } from "express";
import { validateRequest } from "@vizagops/api";
import { CreateComplaintSchema } from "@vizagops/validation";
import { createComplaint } from "./controller";

const router = Router();
router.post("/", validateRequest(CreateComplaintSchema), createComplaint);
export default router;
