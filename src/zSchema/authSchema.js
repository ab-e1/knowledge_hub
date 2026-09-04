import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registerSchema = z.object({
  name: z.string().min(1, "name can not be empty"),
  email: z
    .string()
    .min(1, "email can not be empty")
    .regex(emailRegex, "Invalid email"),
  password: z
    .string()
    .min(8, "password must be atleast 8 characters long")
    .regex(/[A-Z]/, "password must contain atleast one capital letter")
    .regex(/[a-z]/, "password must contain atleast one small letter")
    .regex(/\d/, "password must contain at least one number")
    .regex(
      /[!@#$%^&*+-_]/,
      "password msut contain atleast one special character",
    ),
});

export const loginSchema = z.object({
  email: z.string().min(1, "email cannot be empty"),
  password: z.string().min(1, "password can not be empty"),
});
