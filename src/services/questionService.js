import { prisma } from "../config/prisma.js";

export const createQuestion = async (id, data) => {
  const question = await prisma.question.create({
    data: {
      authorId: id,
      title: data.title,
      description: data.description,
      questionTags: {
        create: data.tags.map((tagName) => ({
          tag: {
            connectOrCreate: {
              where: { name: tagName },
              create: { name: tagName },
            },
          },
        })),
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      questionTags: {
        select: {
          tag: {
            select: { name: true },
          },
        },
      },
    },
  });

  return { ok: true, data: question, status: 201 };
};

export const getQuestions = async (query) => {
  const { search, page = 1, limit = 10 } = query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Build where clause — only apply search filter if search term is provided
  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          {
            questionTags: {
              some: {
                tag: { name: { contains: search, mode: "insensitive" } },
              },
            },
          },
        ],
      }
    : {};

  // Fire count and data queries at the same time
  const [total, questions] = await prisma.$transaction([
    prisma.question.count({ where }),
    prisma.question.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        author: {
          select: { id: true, name: true },
        },
        questionTags: {
          select: {
            tag: { select: { name: true } },
          },
        },
      },
    }),
  ]);

  return {
    ok: true,
    data: {
      questions,
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

export const getQuestionById = async (id) => {
  if (!id) {
    return { ok: false, error: "id is not provided", status: 400 };
  }
  const question = await prisma.question.findUnique({
    where: { id: id },
  });
  if (!question) {
    return {
      ok: false,
      error: "no question found with the provided id",
      status: 404,
    };
  }
  return {
    ok: true,
    data: question,
    status: 200,
  };
};

export const updateQuestion = async (id, questionId, data) => {
  // Check the question exists and belongs to this user before updating
  const existing = await prisma.question.findUnique({
    where: { id: questionId },
  });
  if (!existing) {
    return { ok: false, error: "Question not found.", status: 404 };
  }
  if (existing.authorId !== id) {
    return {
      ok: false,
      error: "Not authorized to update this question.",
      status: 403,
    };
  }

  const question = await prisma.question.update({
    where: { id: questionId },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.tags && {
        questionTags: {
          deleteMany: {}, // wipe existing tags only if new tags are provided
          create: data.tags.map((tagName) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              },
            },
          })),
        },
      }),
    },
    select: {
      id: true,
      title: true,
      description: true,
      updatedAt: true,
      questionTags: {
        select: {
          tag: { select: { name: true } },
        },
      },
    },
  });
  return {
    ok: true,
    data: question,
    status: 200,
  };
};

export const deleteQuestion = async (id, questionId) => {
  const existing = await prisma.question.findUnique({
    where: { id: questionId },
  });
  if (!existing) {
    return { ok: false, error: "Question not found.", status: 404 };
  }
  if (existing.authorId !== id) {
    return {
      ok: false,
      error: "Not authorized to delete this question.",
      status: 403,
    };
  }

  await prisma.question.delete({ where: { id: questionId } });

  return {
    ok: true,
    data: { message: "Question deleted successfully." },
    status: 200,
  };
};
