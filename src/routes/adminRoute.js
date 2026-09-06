import { Router } from "express";
import * as adminController from "../controllers/adminController.js";
import { auth } from "../middleware/auth.js";
import { roleCheck } from "../middleware/roleCheck.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Platform administration and content moderation (Requires ADMIN role)
 */

// All admin routes require auth + ADMIN role
router.use(auth, roleCheck("ADMIN"));

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: Get all users with offset pagination (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Paginated users list
 *       403:
 *         description: Access forbidden (Requires ADMIN role)
 */
router.get("/users", adminController.getAllUsers);

/**
 * @swagger
 * /api/v1/admin/users/{userId}:
 *   delete:
 *     summary: Delete any user account (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete("/users/:userId", adminController.deleteUser);

/**
 * @swagger
 * /api/v1/admin/users/{userId}/block:
 *   patch:
 *     summary: Toggle block / unblock status of a user (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User block status updated
 */
router.patch("/users/:userId/block", adminController.toggleBlockUser);

/**
 * @swagger
 * /api/v1/admin/questions/{questionId}:
 *   delete:
 *     summary: Delete any question (Admin moderation)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Question deleted by admin
 */
router.delete("/questions/:questionId", adminController.adminDeleteQuestion);

/**
 * @swagger
 * /api/v1/admin/answers/{answerId}:
 *   delete:
 *     summary: Delete any answer (Admin moderation)
 *     tags: [Admin]
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
 *         description: Answer deleted by admin
 */
router.delete("/answers/:answerId", adminController.adminDeleteAnswer);

/**
 * @swagger
 * /api/v1/admin/comments/{commentId}:
 *   delete:
 *     summary: Delete any comment (Admin moderation)
 *     tags: [Admin]
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
 *         description: Comment deleted by admin
 */
router.delete("/comments/:commentId", adminController.adminDeleteComment);

/**
 * @swagger
 * /api/v1/admin/tags:
 *   get:
 *     summary: List all tags (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tags
 */
router.get("/tags", adminController.getAllTags);

/**
 * @swagger
 * /api/v1/admin/tags/{tagId}:
 *   delete:
 *     summary: Delete a tag (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tag deleted successfully
 */
router.delete("/tags/:tagId", adminController.deleteTag);

/**
 * @swagger
 * /api/v1/admin/stats:
 *   get:
 *     summary: Get overall platform statistics (Users count, questions count, etc.)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Platform analytics and counts
 */
router.get("/stats", adminController.getStats);

export default router;
