import { prisma } from "../config/prisma.js";

export const getAllUsers = async (query) => {
  const { page = 1, limit = 20 } = query;
  const pageNum  = parseInt(page);
  const limitNum = parseInt(limit);
  const skip     = (pageNum - 1) * limitNum;

  const [total, users] = await prisma.$transaction([
    prisma.user.count(),
    prisma.user.findMany({
      skip,
      take: limitNum,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBlocked: true,
        emailVerified: true,
        reputation: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    ok: true,
    data: {
      users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    },
    status: 200,
  };
};

export const deleteUser = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { ok: false, error: "User not found.", status: 404 };

  await prisma.user.delete({ where: { id: userId } });
  return { ok: true, data: { message: "User deleted successfully." }, status: 200 };
};

export const toggleBlockUser = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { ok: false, error: "User not found.", status: 404 };

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { isBlocked: !user.isBlocked },
    select: { id: true, name: true, isBlocked: true },
  });

  const message = updated.isBlocked ? "User blocked." : "User unblocked.";
  return { ok: true, data: { message, user: updated }, status: 200 };
};

export const adminDeleteQuestion = async (questionId) => {
  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question) return { ok: false, error: "Question not found.", status: 404 };

  await prisma.question.delete({ where: { id: questionId } });
  return { ok: true, data: { message: "Question deleted." }, status: 200 };
};

export const adminDeleteAnswer = async (answerId) => {
  const answer = await prisma.answer.findUnique({ where: { id: answerId } });
  if (!answer) return { ok: false, error: "Answer not found.", status: 404 };

  await prisma.answer.delete({ where: { id: answerId } });
  return { ok: true, data: { message: "Answer deleted." }, status: 200 };
};

export const adminDeleteComment = async (commentId) => {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) return { ok: false, error: "Comment not found.", status: 404 };

  await prisma.comment.delete({ where: { id: commentId } });
  return { ok: true, data: { message: "Comment deleted." }, status: 200 };
};

export const getAllTags = async () => {
  const tags = await prisma.tag.findMany({
    select: {
      id: true,
      name: true,
      _count: { select: { questionTags: true } },
    },
    orderBy: { name: "asc" },
  });
  return { ok: true, data: tags, status: 200 };
};

export const deleteTag = async (tagId) => {
  const tag = await prisma.tag.findUnique({ where: { id: tagId } });
  if (!tag) return { ok: false, error: "Tag not found.", status: 404 };

  await prisma.tag.delete({ where: { id: tagId } });
  return { ok: true, data: { message: "Tag deleted." }, status: 200 };
};

export const getStats = async () => {
  const [totalUsers, totalQuestions, totalAnswers, totalComments] =
    await prisma.$transaction([
      prisma.user.count(),
      prisma.question.count(),
      prisma.answer.count(),
      prisma.comment.count(),
    ]);

  return {
    ok: true,
    data: { totalUsers, totalQuestions, totalAnswers, totalComments },
    status: 200,
  };
};
