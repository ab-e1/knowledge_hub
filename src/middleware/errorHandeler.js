export const errorHandeler = async (err, req, res, next) => {
  res.status(err.status || 500).json({
    ok: false,
    error: err.message || "internal server error",
  });
};
