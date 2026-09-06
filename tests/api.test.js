import request from "supertest";
import { app } from "../src/app.js";
import { prisma } from "../src/config/prisma.js";

describe("Knowledge Hub API Integration Tests", () => {
  const timestamp = Date.now();
  const testUser = {
    name: "Test User",
    email: `test_${timestamp}@example.com`,
    password: "Password123!",
  };

  let token = "";
  let userId = null;
  let questionId = null;

  afterAll(async () => {
    // Cleanup test user and related data created during tests
    if (userId) {
      await prisma.user.delete({ where: { id: userId } }).catch(() => {});
    }
    await prisma.$disconnect();
  });

  describe("AUTH Endpoints", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.ok).toBe(true);
      expect(res.body.data).toHaveProperty("user");
      expect(res.body.data.user.email).toBe(testUser.email);

      userId = res.body.data.user.id;

      // Verify user's email in database to allow login testing
      await prisma.user.update({
        where: { id: userId },
        data: { emailVerified: true },
      });
    });

    it("should fail signup if email already exists with 409 conflict", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send(testUser);

      expect(res.statusCode).toBe(409);
      expect(res.body.ok).toBe(false);
    });

    it("should login successfully with correct credentials", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body).toHaveProperty("accessToken");
      token = res.body.accessToken;
    });
  });

  describe("USER PROFILE Endpoints", () => {
    it("should get current logged-in user profile", async () => {
      const res = await request(app)
        .get("/api/v1/users/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.email).toBe(testUser.email);
    });

    it("should deny access to profile without authorization header", async () => {
      const res = await request(app).get("/api/v1/users/me");

      expect(res.statusCode).toBe(401);
    });
  });

  describe("QUESTIONS Endpoints", () => {
    it("should create a new question when authenticated", async () => {
      const res = await request(app)
        .post("/api/v1/questions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "How to use Jest with Express and Supertest?",
          description: "I am writing automated integration tests for my Express REST API using Supertest.",
          tags: ["javascript", "jest", "express"],
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.title).toBe("How to use Jest with Express and Supertest?");
      questionId = res.body.data.id;
    });

    it("should list all questions with pagination", async () => {
      const res = await request(app)
        .get("/api/v1/questions?page=1&limit=5");

      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(Array.isArray(res.body.data.questions)).toBe(true);
      expect(res.body.data.pagination).toHaveProperty("total");
    });

    it("should fetch single question by ID", async () => {
      const res = await request(app)
        .get(`/api/v1/questions/${questionId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.id).toBe(questionId);
    });
  });
});
