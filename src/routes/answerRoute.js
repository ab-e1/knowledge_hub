import { Router } from "express";
import * as answerController from "../controllers/answerController.js";
import { validate } from "../middleware/validate.js";
import { auth } from "../middleware/auth.js";
import { answerSchema, updateAnswerSchema } from "../zSchema/answerSchema.js";

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Answers
 *   description: Question answer management
 */

/**
 * @swagger
 * /api/v1/questions/{questionId}/answers:
 *   get:
 *     summary: Get all answers for a question
 *     tags: [Answers]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of answers for the question
 */
router.get("/", answerController.getAnswers);

/**
 * @swagger
 * /api/v1/questions/{questionId}/answers:
 *   post:
 *     summary: Submit an answer to a question
 *     tags: [Answers]
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
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Answer posted successfully
 */
router.post("/", auth, validate(answerSchema), answerController.createAnswer);

/**
 * @swagger
 * /api/v1/answers/{answerId}:
 *   patch:
 *     summary: Update an answer
 *     tags: [Answers]
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
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Answer updated successfully
 */
router.patch("/:answerId", auth, validate(updateAnswerSchema), answerController.updateAnswer);

/**
 * @swagger
 * /api/v1/answers/{answerId}:
 *   delete:
 *     summary: Delete an answer
 *     tags: [Answers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Answer deleted successfully
 */
router.delete("/:answerId", auth, answerController.deleteAnswer);

export default router;
