import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

const pool = new pg.Pool({
  connectionString,
  // Support SSL if required or in production
  ssl: process.env.NODE_ENV === "production" || connectionString?.includes("sslmode=") 
    ? { rejectUnauthorized: false } 
    : undefined
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
