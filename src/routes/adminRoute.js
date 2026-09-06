import { Router } from "express";
import * as adminController from "../controllers/adminController.js";
import { auth } from "../middleware/auth.js";
import { roleCheck } from "../middleware/roleCheck.js";

const router = Router();

// All admin routes require auth + ADMIN role
router.use(auth, roleCheck("ADMIN"));

// Users
router.get("/users", adminController.getAllUsers);
router.delete("/users/:userId", adminController.deleteUser);
router.patch("/users/:userId/block", adminController.toggleBlockUser);

// Content moderation
router.delete("/questions/:questionId", adminController.adminDeleteQuestion);
router.delete("/answers/:answerId", adminController.adminDeleteAnswer);
router.delete("/comments/:commentId", adminController.adminDeleteComment);

// Tags
router.get("/tags", adminController.getAllTags);
router.delete("/tags/:tagId", adminController.deleteTag);

// Statistics
router.get("/stats", adminController.getStats);

export default router;
