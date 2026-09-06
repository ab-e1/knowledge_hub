import { prisma } from "../config/prisma.js";

const REPUTATION_ASK_QUESTION = 5;

export const createQuestion = async (id, data) => {
  const [question] = await prisma.$transaction([
    prisma.question.create({
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
    }),
    prisma.user.update({
      where: { id },
      data: { reputation: { increment: REPUTATION_ASK_QUESTION } },
    }),
  ]);

  return { ok: true, data: question, status: 201 };
};

export const getQuestions = async (query) => {
  const { search, sort = "newest", page = 1, limit = 10 } = query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Build base where clause — filter search term if provided
  const where = {
    ...(search && {
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
    }),
    ...(sort === "unanswered" && {
      answers: { none: {} },
    }),
  };

  // Determine ordering
  let orderBy = { createdAt: "desc" };

  // Fire count and data queries at the same time
  const [total, rawQuestions] = await prisma.$transaction([
    prisma.question.count({ where }),
    prisma.question.findMany({
      where,
      skip: sort === "popular" ? 0 : skip,
      take: sort === "popular" ? undefined : limitNum,
      orderBy,
      select: {
        id: true,
        title: true,
        description: true,
        acceptedAnswerId: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: { id: true, name: true, avatarUrl: true, reputation: true },
        },
        questionTags: {
          select: {
            tag: { select: { name: true } },
          },
        },
        votes: {
          select: { type: true },
        },
        _count: {
          select: { answers: true, comments: true },
        },
      },
    }),
  ]);

  // Format questions with upvotes, downvotes, and net score
  let questions = rawQuestions.map((q) => {
    const upvotesCount = q.votes.filter((v) => v.type === "UPVOTE").length;
    const downvotesCount = q.votes.filter((v) => v.type === "DOWNVOTE").length;
    const { votes, ...rest } = q;
    return {
      ...rest,
      upvotesCount,
      downvotesCount,
      votesScore: upvotesCount - downvotesCount,
    };
  });

  // If sort=popular, sort array by votesScore descending and paginate
  if (sort === "popular") {
    questions.sort((a, b) => b.votesScore - a.votesScore);
    questions = questions.slice(skip, skip + limitNum);
  }

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
    select: {
      id: true,
      title: true,
      description: true,
      acceptedAnswerId: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: { id: true, name: true, avatarUrl: true, reputation: true },
      },
      questionTags: {
        select: {
          tag: { select: { name: true } },
        },
      },
      votes: {
        select: { id: true, type: true, voterId: true },
      },
      comments: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          author: { select: { id: true, name: true, avatarUrl: true } },
        },
        orderBy: { createdAt: "asc" },
      },
      answers: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          author: { select: { id: true, name: true, avatarUrl: true, reputation: true } },
          votes: { select: { type: true } },
          comments: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              author: { select: { id: true, name: true, avatarUrl: true } },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!question) {
    return {
      ok: false,
      error: "no question found with the provided id",
      status: 404,
    };
  }

  // Format vote counts and net score for the question
  const upvotesCount = question.votes.filter((v) => v.type === "UPVOTE").length;
  const downvotesCount = question.votes.filter((v) => v.type === "DOWNVOTE").length;

  // Format vote counts for each answer
  const formattedAnswers = question.answers.map((ans) => {
    const ansUp = ans.votes.filter((v) => v.type === "UPVOTE").length;
    const ansDown = ans.votes.filter((v) => v.type === "DOWNVOTE").length;
    const { votes, ...restAns } = ans;
    return {
      ...restAns,
      isAccepted: question.acceptedAnswerId === ans.id,
      upvotesCount: ansUp,
      downvotesCount: ansDown,
      votesScore: ansUp - ansDown,
    };
  });

  const { votes, answers, ...restQuestion } = question;

  return {
    ok: true,
    data: {
      ...restQuestion,
      upvotesCount,
      downvotesCount,
      votesScore: upvotesCount - downvotesCount,
      answers: formattedAnswers,
    },
    status: 200,
  };
};

export const updateQuestion = async (id, questionId, data) => {
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
          deleteMany: {},
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
