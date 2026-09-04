import jwt from "jsonwebtoken";
import { jwtExpiresIn, jwtSecret } from "../config/loadEnv.js";

export const signAccessToken = (payload) => {
  return jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, jwtSecret);
};

export const signRefreshToken = (payload) => {
  return jwt.sign(payload, jwtSecret, {
    expiresIn: "7d",
  });
};

export const verifyRefreshToken = (refreshToken) => {
  return jwt.verify(refreshToken, jwtSecret);
};
