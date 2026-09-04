export const failure = (res, error, statusCode = 400) => {
  res.status(statusCode).json({
    ok: false,
    error,
  });
};

export const success = (
  res,
  data,
  statusCode = 200,
  accessToken,
  refreshToken,
) => {
  res.status(statusCode).json({
    ok: true,
    data,
    accessToken,
    refreshToken,
  });
};

export const visibleInfo = (data) => {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    bio: data.bio,
    avatarUrl: data.avatarUrl,
    reputation: data.reputation,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};
