import { prisma } from "../config/prisma.js";

export const createComment = async (userId, content, questionId, answerId) => {
  const comment = await prisma.comment.create({
    data: {
      content,
      authorId: userId,
      questionId: questionId ?? null,
      answerId: answerId ?? null,
    },
    select: {
      id: true,
      content: true,
      questionId: true,
      answerId: true,
      author: { select: { id: true, name: true } },
      createdAt: true,
    },
  });

  return { ok: true, data: comment, status: 201 };
};

export const getCommentsByQuestion = async (questionId) => {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
  });
  if (!question) {
    return { ok: false, error: "Question not found.", status: 404 };
  }

  const comments = await prisma.comment.findMany({
    where: { questionId },
    select: {
      id: true,
      content: true,
      author: { select: { id: true, name: true } },
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return { ok: true, data: comments, status: 200 };
};

export const getCommentsByAnswer = async (answerId) => {
  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
  });
  if (!answer) {
    return { ok: false, error: "Answer not found.", status: 404 };
  }

  const comments = await prisma.comment.findMany({
    where: { answerId },
    select: {
      id: true,
      content: true,
      author: { select: { id: true, name: true } },
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return { ok: true, data: comments, status: 200 };
};

export const deleteComment = async (userId, commentId) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });
  if (!comment) {
    return { ok: false, error: "Comment not found.", status: 404 };
  }
  if (comment.authorId !== userId) {
    return { ok: false, error: "Not authorized to delete this comment.", status: 403 };
  }

  await prisma.comment.delete({ where: { id: commentId } });

  return { ok: true, data: { message: "Comment deleted successfully." }, status: 200 };
};
