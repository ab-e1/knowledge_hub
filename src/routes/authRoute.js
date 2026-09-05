import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import {
  registerSchema,
  loginSchema,
  resetPassSchema,
} from "../zSchema/authSchema.js";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);

router.post("/login", validate(loginSchema), authController.login);

router.post("/refreshToken", authController.refreshToken);

router.post("/logout", authController.logout);

router.get("/verify-email/:token", authController.verifyEmail);

router.post("/resend-verification", authController.resendVerification);

router.post("/forgot-password", authController.forgotPassword);

router.post(
  "/reset-password",
  validate(resetPassSchema),
  authController.resetPassword,
);

export default router;
