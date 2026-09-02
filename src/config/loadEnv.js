import { dotenv } from "dotenv";

dotenv.config();

export const port = process.env.PORT;
export const dbUri = process.env.POSTGRES_URI;
export const jwtSecret = process.env.JWT_SECRET;
export const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
