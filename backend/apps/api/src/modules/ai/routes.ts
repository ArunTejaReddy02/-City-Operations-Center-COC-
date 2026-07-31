import { Router } from "express";
import { handleSummarize, handlePrioritize } from "./controller";

const router = Router();

/**
 * @openapi
 * /ai/summarize:
 *   post:
 *     summary: Generate an AI executive summary for a complaint via Groq
 *     tags:
 *       - AI
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               category: { type: string }
 *               ward: { type: string }
 *     responses:
 *       200:
 *         description: AI summary generated
 */
router.post("/summarize", handleSummarize);

/**
 * @openapi
 * /ai/prioritize:
 *   post:
 *     summary: Calculate AI priority score for a complaint via Groq
 *     tags:
 *       - AI
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [complaintTitle, complaintDescription, category]
 *             properties:
 *               complaintTitle: { type: string }
 *               complaintDescription: { type: string }
 *               category: { type: string }
 *     responses:
 *       200:
 *         description: AI priority score calculated
 */
router.post("/prioritize", handlePrioritize);

export default router;
