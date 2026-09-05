import dotenv from "dotenv";

dotenv.config();

export const port = process.env.PORT || 4000;
export const dbUri = process.env.DATABASE_URL;
export const jwtSecret = process.env.JWT_SECRET;
export const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
export const smtpHost = process.env.SMTP_HOST;
export const smtpPort = process.env.SMTP_PORT;
export const smtpUser = process.env.SMTP_USER;
export const smtpPass = process.env.SMTP_PASS;
export const nodeEnv = process.env.NODE_ENV || "development";
export const appUrl = process.env.APP_URL || `http://localhost:${port}`;
