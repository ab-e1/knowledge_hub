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

export const signEmailVerficationToken = (payload) => {
  return jwt.sign(payload, jwtSecret, {
    expiresIn: "24h",
  });
};

export const signPasswordResetToken = (payload) => {
  return jwt.sign(payload, jwtSecret, {
    expiresIn: "15m",
  });
};
