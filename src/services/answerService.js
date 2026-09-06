import { prisma } from "../config/prisma.js";

export const createAnswer = async (userId, questionId, content) => {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
  });
  if (!question) {
    return { ok: false, error: "Question not found.", status: 404 };
  }

  const answer = await prisma.answer.create({
    data: {
      content,
      authorId: userId,
      questionId,
    },
    select: {
      id: true,
      content: true,
      questionId: true,
      author: { select: { id: true, name: true } },
      createdAt: true,
    },
  });

  return { ok: true, data: answer, status: 201 };
};

export const getAnswers = async (questionId) => {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
  });
  if (!question) {
    return { ok: false, error: "Question not found.", status: 404 };
  }

  const answers = await prisma.answer.findMany({
    where: { questionId },
    select: {
      id: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      author: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return { ok: true, data: answers, status: 200 };
};

export const updateAnswer = async (userId, answerId, content) => {
  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
  });
  if (!answer) {
    return { ok: false, error: "Answer not found.", status: 404 };
  }
  if (answer.authorId !== userId) {
    return { ok: false, error: "Not authorized to update this answer.", status: 403 };
  }

  const updated = await prisma.answer.update({
    where: { id: answerId },
    data: { content },
    select: {
      id: true,
      content: true,
      questionId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return { ok: true, data: updated, status: 200 };
};

export const deleteAnswer = async (userId, answerId) => {
  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
  });
  if (!answer) {
    return { ok: false, error: "Answer not found.", status: 404 };
  }
  if (answer.authorId !== userId) {
    return { ok: false, error: "Not authorized to delete this answer.", status: 403 };
  }

  await prisma.answer.delete({ where: { id: answerId } });

  return { ok: true, data: { message: "Answer deleted successfully." }, status: 200 };
};
