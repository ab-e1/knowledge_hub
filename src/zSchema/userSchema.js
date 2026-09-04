import { z } from "zod";

export const userSchema = z.object({
  bio: z
    .string()
    .max(50, "bio too long it should be less than 50 characters")
    .optional(),
  avatarUrl: z.string().url().optional(),
});
