import { z } from "zod";

export const answerSchema = z.object({
  content: z
    .string()
    .min(2, "answer must be at least 2 characters long"),
});
