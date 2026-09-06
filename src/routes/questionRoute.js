import { Router } from "express";
import * as questionController from "../controllers/questionController.js";
import { validate } from "../middleware/validate.js";
import { auth } from "../middleware/auth.js";
import {
  questionSchema,
  updateQuestionSchema,
} from "../zSchema/questionSchema.js";

const router = Router();

router.get("/", questionController.getQuestions);

router.get("/:id", questionController.getQuestionById);

router.post(
  "/",
  auth,
  validate(questionSchema),
  questionController.createQuestion,
);

router.patch(
  "/:id",
  auth,
  validate(updateQuestionSchema),
  questionController.updateQuestion,
);

router.delete("/:id", auth, questionController.deleteQuestion);

export default router;
