import { Router } from "express";
import * as questionController from "../controllers/questionController.js";
import { validate } from "../middleware/validate.js";
import { auth } from "../middleware/auth.js";
import {
  questionSchema,
  updateQuestionSchema,
} from "../zSchema/questionSchema.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Question management and search
 */

/**
 * @swagger
 * /api/v1/questions:
 *   get:
 *     summary: List all questions with pagination and search
 *     tags: [Questions]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword for titles and tags
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Paginated questions list
 */
router.get("/", questionController.getQuestions);

/**
 * @swagger
 * /api/v1/questions/{id}:
 *   get:
 *     summary: Get single question details by ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Question details
 *       404:
 *         description: Question not found
 */
router.get("/:id", questionController.getQuestionById);

/**
 * @swagger
 * /api/v1/questions:
 *   post:
 *     summary: Post a new question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, tags]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Question created successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  auth,
  validate(questionSchema),
  questionController.createQuestion,
);

/**
 * @swagger
 * /api/v1/questions/{id}:
 *   patch:
 *     summary: Update an existing question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Question updated successfully
 *       403:
 *         description: Not authorized to update this question
 */
router.patch(
  "/:id",
  auth,
  validate(updateQuestionSchema),
  questionController.updateQuestion,
);

/**
 * @swagger
 * /api/v1/questions/{id}:
 *   delete:
 *     summary: Delete a question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Question deleted successfully
 *       403:
 *         description: Not authorized to delete this question
 */
router.delete("/:id", auth, questionController.deleteQuestion);

export default router;
