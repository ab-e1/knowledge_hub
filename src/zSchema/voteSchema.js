import { z } from "zod";

export const voteSchema = z.object({
  type: z.enum(["UPVOTE", "DOWNVOTE"], {
    errorMap: () => ({ message: "Vote type must be UPVOTE or DOWNVOTE." }),
  }),
});
