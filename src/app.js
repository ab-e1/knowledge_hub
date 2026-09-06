import express from "express";
import helmet from "helmet";
import cors from "cors";
import { generalLimiter } from "./middleware/rateLimit.js";
import authRoutes from "./routes/authRoute.js";
import questionRoutes from "./routes/questionRoute.js";
import answerRoutes from "./routes/answerRoute.js";
import userRoutes from "./routes/userRoute.js";
import voteRoutes from "./routes/voteRoute.js";
import commentRoutes from "./routes/commentRoute.js";
import adminRoutes from "./routes/adminRoute.js";
import { logger } from "./middleware/logger.js";
import { errorHandeler } from "./middleware/errorHandeler.js";
import { setupSwagger } from "./config/swagger.js";

import { appUrl } from "./config/loadEnv.js";

export const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: appUrl || "http://localhost:4000",
    credentials: true,
  }),
);
app.use(generalLimiter); // Apply global rate limiter

app.use(express.json());

app.use(logger);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use("/api/v1/questions", questionRoutes);
app.use("/api/v1/questions/:questionId/answers", answerRoutes);
app.use("/api/v1/answers", answerRoutes);

app.use("/api/v1", voteRoutes);
app.use("/api/v1", commentRoutes);

setupSwagger(app);

app.use(errorHandeler);
