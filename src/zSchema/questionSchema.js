import { z } from "zod";

export const questionSchema = z.object({
  title: z
    .string()
    .min(10, "question can not be empty, and canot be to less than 5 chracters")
    .max(200, "title too long continue the rest in the description"),
  description: z.string("description must be a string"),
  tags: z
    .array(z.string().min(1, "tag cannot be empty"))
    .min(1, "at least one tag is required"),
});
