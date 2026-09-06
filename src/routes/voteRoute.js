import { Router } from "express";
import * as voteController from "../controllers/voteController.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { voteSchema } from "../zSchema/voteSchema.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Votes
 *   description: Upvoting and downvoting system
 */

/**
 * @swagger
 * /api/v1/questions/{questionId}/vote:
 *   post:
 *     summary: Vote on a question (UPVOTE or DOWNVOTE)
 *     tags: [Votes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [UPVOTE, DOWNVOTE]
 *     responses:
 *       200:
 *         description: Vote toggled or updated
 */
router.post("/questions/:questionId/vote", auth, validate(voteSchema), voteController.voteOnQuestion);

/**
 * @swagger
 * /api/v1/answers/{answerId}/vote:
 *   post:
 *     summary: Vote on an answer (UPVOTE or DOWNVOTE)
 *     tags: [Votes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [UPVOTE, DOWNVOTE]
 *     responses:
 *       200:
 *         description: Vote toggled or updated
 */
router.post("/answers/:answerId/vote", auth, validate(voteSchema), voteController.voteOnAnswer);

export default router;
