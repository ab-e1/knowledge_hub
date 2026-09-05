import jwt from "jsonwebtoken";
import { jwtExpiresIn, jwtSecret } from "../config/loadEnv.js";

export const signAccessToken = (payload) => {
  return jwt.sign({ ...payload, type: "access" }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });
};

export const signRefreshToken = (payload) => {
  return jwt.sign({ ...payload, type: "refresh" }, jwtSecret, {
    expiresIn: "7d",
  });
};

export const signEmailVerficationToken = (payload) => {
  return jwt.sign({ ...payload, type: "email_verification" }, jwtSecret, {
    expiresIn: "24h",
  });
};

export const signPasswordResetToken = (payload) => {
  return jwt.sign({ ...payload, type: "password_reset" }, jwtSecret, {
    expiresIn: "15m",
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, jwtSecret);
};
