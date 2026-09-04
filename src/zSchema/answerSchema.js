import { z } from "zod";

export const answerSchema = z.object({
  content: z
    .string()
    .min(2, "answer content can not be empty, and greater than 2 characters"),
});
