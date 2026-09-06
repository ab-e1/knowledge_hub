import { prisma } from "../config/prisma.js";

export const vote = async (userId, type, questionId, answerId) => {
  // Build the unique identifier for this vote
  const where = questionId
    ? { voterId_questionId: { voterId: userId, questionId } }
    : { voterId_answerId: { voterId: userId, answerId } };

  const existing = await prisma.vote.findUnique({ where });

  // If same vote type exists — remove it (toggle off)
  if (existing) {
    if (existing.type === type) {
      await prisma.vote.delete({ where: { id: existing.id } });
      return { ok: true, data: { message: "Vote removed." }, status: 200 };
    }
    // Different vote type — switch it (upvote → downvote or vice versa)
    const updated = await prisma.vote.update({
      where: { id: existing.id },
      data: { type },
      select: { id: true, type: true },
    });
    return { ok: true, data: updated, status: 200 };
  }

  // No existing vote — create a new one
  const newVote = await prisma.vote.create({
    data: {
      type,
      voterId: userId,
      questionId: questionId ?? null,
      answerId: answerId ?? null,
    },
    select: { id: true, type: true },
  });

  return { ok: true, data: newVote, status: 201 };
};
