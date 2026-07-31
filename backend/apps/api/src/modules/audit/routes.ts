import { Router } from "express";
import axios from "axios";
import { config } from "@vizagops/config";
const router = Router();
const AUDIT_SVC_URL = config.AUDIT_SERVICE_URL;
router.get("/verify", async (req, res, next) => {
  try {
    const { data } = await axios.get(`${AUDIT_SVC_URL}/verify`);
    res.json(data);
  } catch (err) { next(err); }
});
router.get("/:id", async (req, res, next) => {
  try {
    const { data } = await axios.get(`${AUDIT_SVC_URL}/${req.params.id}`);
    res.json(data);
  } catch (err) { next(err); }
});
export default router;
