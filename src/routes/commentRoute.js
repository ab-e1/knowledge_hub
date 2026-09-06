import { Router } from "express";
import * as commentController from "../controllers/commentController.js";
import { validate } from "../middleware/validate.js";
import { auth } from "../middleware/auth.js";
import { commentSchema } from "../zSchema/commentSchema.js";

const router = Router();

// Comments on questions
router.post("/questions/:questionId/comments", auth, validate(commentSchema), commentController.createCommentOnQuestion);
router.get("/questions/:questionId/comments", commentController.getCommentsByQuestion);

// Comments on answers
router.post("/answers/:answerId/comments", auth, validate(commentSchema), commentController.createCommentOnAnswer);
router.get("/answers/:answerId/comments", commentController.getCommentsByAnswer);

// Delete a comment
router.delete("/comments/:commentId", auth, commentController.deleteComment);

export default router;
