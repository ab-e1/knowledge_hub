export const failure = (res, error, statusCode = 400) => {
  res.status(statusCode).json({
    ok: false,
    error,
  });
};

export const success = (res, data, statusCode = 200, token) => {
  res.status(statusCode).json({
    ok: true,
    data,
    token,
  });
};
