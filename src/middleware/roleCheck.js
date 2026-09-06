import { failure } from "../utils/response.js";

export const roleCheck = (...allowedRoles) => {
  const result = (req, res, next) => {
    try {
      if (!allowedRoles.includes(req.user.role)) {
        return failure(
          res,
          `Not authorized. Required role: ${allowedRoles.join(" or ")}.`,
        );
      }
      next();
    } catch (err) {
      next(err);
    }
  };
  return result;
};
