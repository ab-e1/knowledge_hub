import express from "express";
import authRoutes from "./routes/authRoute.js";
import questionRoutes from "./routes/questionRoute.js";
import answerRoutes from "./routes/answerRoute.js";

export const app = express();
app.use(express.json());

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/questions", questionRoutes);

app.use("/api/v1/questions/:questionId/answers", answerRoutes);

app.use("/api/v1/answers", answerRoutes);
