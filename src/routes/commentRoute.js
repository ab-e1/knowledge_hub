import { Router } from "express";
import * as commentController from "../controllers/commentController.js";
import { validate } from "../middleware/validate.js";
import { auth } from "../middleware/auth.js";
import { commentSchema } from "../zSchema/commentSchema.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Polymorphic comments system on Questions and Answers
 */

/**
 * @swagger
 * /api/v1/questions/{questionId}/comments:
 *   post:
 *     summary: Post a comment on a question
 *     tags: [Comments]
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
 *         description: Comment posted successfully
 */
router.post("/questions/:questionId/comments", auth, validate(commentSchema), commentController.createCommentOnQuestion);

/**
 * @swagger
 * /api/v1/questions/{questionId}/comments:
 *   get:
 *     summary: Get comments for a question
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of question comments
 */
router.get("/questions/:questionId/comments", commentController.getCommentsByQuestion);

/**
 * @swagger
 * /api/v1/answers/{answerId}/comments:
 *   post:
 *     summary: Post a comment on an answer
 *     tags: [Comments]
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
 *       201:
 *         description: Comment posted successfully
 */
router.post("/answers/:answerId/comments", auth, validate(commentSchema), commentController.createCommentOnAnswer);

/**
 * @swagger
 * /api/v1/answers/{answerId}/comments:
 *   get:
 *     summary: Get comments for an answer
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of answer comments
 */
router.get("/answers/:answerId/comments", commentController.getCommentsByAnswer);

/**
 * @swagger
 * /api/v1/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 */
router.delete("/comments/:commentId", auth, commentController.deleteComment);

export default router;
