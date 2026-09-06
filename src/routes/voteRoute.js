import { Router } from "express";
import * as voteController from "../controllers/voteController.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { voteSchema } from "../zSchema/voteSchema.js";

const router = Router();

router.post("/questions/:questionId/vote", auth, validate(voteSchema), voteController.voteOnQuestion);
router.post("/answers/:answerId/vote", auth, validate(voteSchema), voteController.voteOnAnswer);

export default router;
