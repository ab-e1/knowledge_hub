import { Router } from "express";
import * as answerController from "../controllers/answerController.js";
import { validate } from "../middleware/validate.js";
import { auth } from "../middleware/auth.js";
import { answerSchema, updateAnswerSchema } from "../zSchema/answerSchema.js";

const router = Router({ mergeParams: true });

router.get("/", answerController.getAnswers);
router.post("/", auth, validate(answerSchema), answerController.createAnswer);
router.patch("/:answerId", auth, validate(updateAnswerSchema), answerController.updateAnswer);
router.delete("/:answerId", auth, answerController.deleteAnswer);

export default router;
