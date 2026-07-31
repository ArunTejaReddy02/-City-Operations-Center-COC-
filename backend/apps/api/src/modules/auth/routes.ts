import { Router } from "express";
import { validateRequest, authenticateJWT } from "@vizagops/api";
import { RegisterUserSchema, LoginUserSchema } from "@vizagops/validation";
import { register, login, me } from "./controller";

const router = Router();
router.post("/register", validateRequest(RegisterUserSchema), register);
router.post("/login", validateRequest(LoginUserSchema), login);
router.get("/me", authenticateJWT, me);

export default router;
