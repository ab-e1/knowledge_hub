import { prisma } from "../config/prisma.js";
import cloudinary from "../utils/cloudinary.js";
import { avatarFolder } from "../config/loadEnv.js";

export const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      avatarUrl: true,
      role: true,
      reputation: true,
      createdAt: true,
      _count: {
        select: {
          questions: true,
          answers: true,
        },
      },
    },
  });

  if (!user) return { ok: false, error: "User not found.", status: 404 };

  // Count accepted answers for this user
  const acceptedAnswersCount = await prisma.answer.count({
    where: {
      authorId: userId,
      acceptedFor: { isNot: null },
    },
  });

  const { _count, ...rest } = user;

  return {
    ok: true,
    data: {
      ...rest,
      questionsCount: _count.questions,
      answersCount: _count.answers,
      acceptedAnswersCount,
    },
    status: 200,
  };
};

export const updateProfile = async (userId, data) => {
  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.bio  && { bio: data.bio }),
    },
    select: {
      id: true,
      name: true,
      bio: true,
      avatarUrl: true,
      updatedAt: true,
    },
  });

  return { ok: true, data: updated, status: 200 };
};

export const uploadAvatar = async (userId, fileBuffer) => {
  // Upload buffer to Cloudinary using a stream
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: avatarFolder,
        public_id: `user_${userId}`,
        overwrite: true,
        transformation: [{ width: 300, height: 300, crop: "fill", gravity: "face" }],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    stream.end(fileBuffer);
  });

  await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl: result.secure_url },
  });

  return { ok: true, data: { avatarUrl: result.secure_url }, status: 200 };
};

export const deleteAccount = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { ok: false, error: "User not found.", status: 404 };

  await prisma.user.delete({ where: { id: userId } });
  return { ok: true, data: { message: "Account deleted successfully." }, status: 200 };
};
