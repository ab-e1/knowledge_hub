import { failure } from "../utils/response.js";

export const roleCheck = (...allowedRoles) => {
  const result = (req, res, next) => {
    try {
      if (!allowedRoles.includes(req.user.role)) {
        return failure(
          res,
          `not ahtorized it needs ine of this roles ${allowedRoles}`,
        );
      }
      next();
    } catch (err) {
      next(err);
    }
  };
  return result;
};
