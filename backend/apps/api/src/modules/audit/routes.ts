import { Router } from "express";
import axios from "axios";
const router = Router();
const AUDIT_SVC_URL = "http://localhost:3001/api/v1/audit";
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
