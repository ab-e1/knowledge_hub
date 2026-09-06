import { prisma } from "../config/prisma.js";

const REPUTATION_UPVOTE = 2;
const REPUTATION_DOWNVOTE = -1;

export const vote = async (userId, type, questionId, answerId) => {
  // Find author ID of target question or answer
  let targetAuthorId = null;
  if (questionId) {
    const q = await prisma.question.findUnique({ where: { id: questionId }, select: { authorId: true } });
    if (!q) return { ok: false, error: "Question not found.", status: 404 };
    targetAuthorId = q.authorId;
  } else if (answerId) {
    const a = await prisma.answer.findUnique({ where: { id: answerId }, select: { authorId: true } });
    if (!a) return { ok: false, error: "Answer not found.", status: 404 };
    targetAuthorId = a.authorId;
  }

  // Build the unique identifier for this vote
  const where = questionId
    ? { voterId_questionId: { voterId: userId, questionId } }
    : { voterId_answerId: { voterId: userId, answerId } };

  const existing = await prisma.vote.findUnique({ where });

  if (existing) {
    // Case 1: Same vote type exists — remove it (toggle off)
    if (existing.type === type) {
      const repDelta = existing.type === "UPVOTE" ? -REPUTATION_UPVOTE : -REPUTATION_DOWNVOTE;
      await prisma.$transaction([
        prisma.vote.delete({ where: { id: existing.id } }),
        prisma.user.update({
          where: { id: targetAuthorId },
          data: { reputation: { increment: repDelta } },
        }),
      ]);
      return { ok: true, data: { message: "Vote removed." }, status: 200 };
    }

    // Case 2: Different vote type — switch it (UPVOTE <-> DOWNVOTE)
    const repDelta = type === "UPVOTE" 
      ? (REPUTATION_UPVOTE - REPUTATION_DOWNVOTE)  // +3 (+2 upvote minus -1 downvote)
      : (REPUTATION_DOWNVOTE - REPUTATION_UPVOTE); // -3 (-1 downvote minus +2 upvote)

    const [updated] = await prisma.$transaction([
      prisma.vote.update({
        where: { id: existing.id },
        data: { type },
        select: { id: true, type: true },
      }),
      prisma.user.update({
        where: { id: targetAuthorId },
        data: { reputation: { increment: repDelta } },
      }),
    ]);

    return { ok: true, data: updated, status: 200 };
  }

  // Case 3: No existing vote — create a new one
  const repDelta = type === "UPVOTE" ? REPUTATION_UPVOTE : REPUTATION_DOWNVOTE;
  const [newVote] = await prisma.$transaction([
    prisma.vote.create({
      data: {
        type,
        voterId: userId,
        questionId: questionId ?? null,
        answerId: answerId ?? null,
      },
      select: { id: true, type: true },
    }),
    prisma.user.update({
      where: { id: targetAuthorId },
      data: { reputation: { increment: repDelta } },
    }),
  ]);

  return { ok: true, data: newVote, status: 201 };
};
