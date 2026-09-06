import rateLimit from "express-rate-limit";
import { nodeEnv } from "../config/loadEnv.js";

const isTest = () => nodeEnv === "test" || process.env.NODE_ENV === "test";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skip: isTest,
  message: {
    success: false,
    message: "Too many login attempts. Try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  skip: isTest,
  message: {
    success: false,
    message: "Too many password reset requests. Try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 7,
  skip: isTest,
  message: {
    success: false,
    message: "Too many registration attempts. Try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skip: isTest,
  message: {
    success: false,
    message: "Too many requests. Try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
