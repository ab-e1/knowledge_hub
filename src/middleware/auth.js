import { verifyAccessToken } from "../utils/jwt.js";
import { failure } from "../utils/response.js";

export const auth = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return failure(res, "no token provided", 401);
  }

  const bearer = header.split(" ")[1];
  try {
    const token = verifyAccessToken(bearer);
    req.user = token;
    next();
  } catch (err) {
    failure(
      res,
      "invalid token or expired: refresh or login to get a new access token",
    );
  }
};
