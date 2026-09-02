import jwt from "jsonwebtoken";
import { jwtExpiresIn, jwtSecret } from "../config/loadEnv.js";

export const signToken = async (payload) => {
  return jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });
};

export const verifyToken = async (token) => {
  return jwt.verify(token, jwtSecret);
};
