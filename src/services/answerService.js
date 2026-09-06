import { prisma } from "../config/prisma.js";
import {
  sendNewAnswerNotificationEmail,
  sendAnswerAcceptedNotificationEmail,
} from "../utils/email.js";

const REPUTATION_ANSWER_QUESTION = 10;
const REPUTATION_ACCEPTED_ANSWER = 15;

export const createAnswer = async (userId, questionId, content) => {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: { author: true },
  });
  if (!question) {
    return { ok: false, error: "Question not found.", status: 404 };
  }

  // Create answer and grant +10 reputation to answer author
  const [answer] = await prisma.$transaction([
    prisma.answer.create({
      data: {
        content,
        authorId: userId,
        questionId,
      },
      select: {
        id: true,
        content: true,
        questionId: true,
        author: { select: { id: true, name: true, reputation: true } },
        createdAt: true,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { reputation: { increment: REPUTATION_ANSWER_QUESTION } },
    }),
  ]);

  // Send email notification to question author (if question author is not the same user)
  if (question.author && question.author.email && question.author.id !== userId) {
    sendNewAnswerNotificationEmail(question.author.email, question.title, content).catch(() => {});
  }

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
      author: { select: { id: true, name: true, reputation: true } },
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

export const acceptAnswer = async (userId, answerId) => {
  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
    include: { question: true, author: true },
  });

  if (!answer) {
    return { ok: false, error: "Answer not found.", status: 404 };
  }

  // Only question author can accept an answer for their question
  if (answer.question.authorId !== userId) {
    return { ok: false, error: "Only the question author can accept an answer.", status: 403 };
  }

  const previousAcceptedId = answer.question.acceptedAnswerId;
  let previousAuthorId = null;

  if (previousAcceptedId && previousAcceptedId !== answerId) {
    const prevAnswer = await prisma.answer.findUnique({
      where: { id: previousAcceptedId },
      select: { authorId: true },
    });
    if (prevAnswer) previousAuthorId = prevAnswer.authorId;
  }

  // Perform transaction: set acceptedAnswerId, grant +15 rep to new answer author, revoke -15 rep from prev author if needed
  await prisma.$transaction(async (tx) => {
    if (previousAcceptedId === answerId) {
      // Toggle off accepted status
      await tx.question.update({
        where: { id: answer.questionId },
        data: { acceptedAnswerId: null },
      });
      await tx.user.update({
        where: { id: answer.authorId },
        data: { reputation: { decrement: REPUTATION_ACCEPTED_ANSWER } },
      });
    } else {
      // Accept new answer
      if (previousAuthorId) {
        await tx.user.update({
          where: { id: previousAuthorId },
          data: { reputation: { decrement: REPUTATION_ACCEPTED_ANSWER } },
        });
      }
      await tx.question.update({
        where: { id: answer.questionId },
        data: { acceptedAnswerId: answerId },
      });
      await tx.user.update({
        where: { id: answer.authorId },
        data: { reputation: { increment: REPUTATION_ACCEPTED_ANSWER } },
      });
    }
  });

  // Notify answer author by email when answer is accepted
  if (previousAcceptedId !== answerId && answer.author && answer.author.email) {
    sendAnswerAcceptedNotificationEmail(answer.author.email, answer.question.title).catch(() => {});
  }

  return {
    ok: true,
    data: { message: previousAcceptedId === answerId ? "Answer unaccepted." : "Answer accepted successfully." },
    status: 200,
  };
};
