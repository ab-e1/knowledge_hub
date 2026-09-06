# KnowledgeHub — Question & Answer Platform REST API

KnowledgeHub is a production-ready RESTful API built with Node.js, Express.js, PostgreSQL, and Prisma 7 ORM. It enables users to ask technical questions, submit answers, vote on discussions, accept answers, comment polymorphically, and manage user reputations.

---

## Key Features

* **Authentication & RBAC:** JWT authentication (Access & Refresh tokens), password hashing (argon2), and Role-Based Access Control (USER, ADMIN).
* **Questions & Tagging:** Create, update, and delete questions with many-to-many tag relationships.
* **Answers & Acceptance:** Post, update, and delete answers. Question authors can mark an answer as Accepted (+15 reputation points).
* **Polymorphic Voting System:** Upvote (+2 rep) and Downvote (-1 rep) on both questions and answers with automatic reputation adjustment and vote toggling.
* **Polymorphic Comments:** Post comments directly on questions or answers.
* **Reputation System:** Dynamic reputation points granted/deducted automatically (+5 for asking, +10 for answering, +2 for upvotes, -1 for downvotes, +15 for accepted answer).
* **Search, Filter & Pagination:** Offset pagination (page, limit), search across titles and tags, and sorting (newest, popular, unanswered).
* **User Profile & Cloudinary:** Profile management with avatar image uploads powered by Multer memory storage and Cloudinary.
* **Nodemailer Email Notifications:** Account verification emails, new answer notifications, and accepted answer alerts.
* **Security & Performance:** Configured with helmet, cors, and express-rate-limit.
* **Interactive Swagger Documentation:** Complete OpenAPI 3.0 specs available at /api-docs.
* **Automated Integration Testing:** Full test suite powered by Jest and Supertest (100% pass rate).

---

## Tech Stack

* **Runtime & Framework:** Node.js (ES Modules), Express.js
* **Database & ORM:** PostgreSQL, Prisma ORM 7
* **Validation:** Zod
* **Authentication:** JSON Web Tokens (JWT), Argon2
* **Storage:** Cloudinary, Multer
* **Email:** Nodemailer (SMTP / Ethereal)
* **Testing:** Jest, Supertest, Babel (TypeScript preset for Prisma 7)
* **Documentation:** Swagger UI Express, Swagger JSDoc

---

## Folder Structure

```
knowledge_hub/
├── prisma/
│   ├── schema.prisma       # Prisma Database Schema & Models
│   └── seed.js             # Super Admin Database Seed Script
├── src/
│   ├── config/             # App, Database, Cloudinary, & Swagger setup
│   ├── controllers/        # Route Controllers (Auth, User, Questions, Admin, etc.)
│   ├── middleware/         # Auth, RoleCheck, Upload, Validate, RateLimit, Logger, ErrorHandler
│   ├── routes/             # Express API Routes & Swagger JSDoc Specifications
│   ├── services/           # Business Logic Layer (Prisma Queries & Reputation Logic)
│   ├── utils/              # JWT, Hashing, Response Formatters, Email Helpers
│   └── zSchema/            # Zod Input Validation Schemas
├── tests/
│   └── api.test.js         # Integration Test Suite (Jest + Supertest)
├── .env.example            # Environment Variables Template
└── server.js               # Express Server Entry Point
```

---

## Getting Started

### 1. Prerequisites
* Node.js v20+
* Managed PostgreSQL database instance

### 2. Clone & Install Dependencies
```bash
git clone https://github.com/ab-e1/knowledge_hub.git
cd knowledge_hub
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory based on `.env.example`:
```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@hostname:port/database_name
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=1h
APP_URL=http://localhost:4000

# SMTP Email Config
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASS=your_smtp_password

# Cloudinary Config
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
```

### 4. Database Setup & Seeding
Generate Prisma client and seed the Super Admin account:
```bash
npx prisma generate
npx prisma db seed
```
> **Default Admin Credentials:**
> - **Email:** `admin@knowledgehub.com`
> - **Password:** `AdminPassword123!`

### 5. Run Development Server
```bash
npm run dev
```
Access the server at `http://localhost:4000` and Swagger API docs at `http://localhost:4000/api-docs`.

---

## Running Automated Tests

Run the integration test suite:
```bash
npm test
```

---

## Deploying to Render

To deploy KnowledgeHub to Render:

1. **New Web Service:** Create a new Web Service on Render connected to your GitHub repository.
2. **Root Directory:** Point to the root directory (leave empty or set `./`).
3. **Build Command:**
   ```bash
   npm install && npx prisma generate
   ```
   *Note: `npx prisma generate` generates the Prisma JavaScript Client code so your backend code can run queries against your managed PostgreSQL database. It does not modify or drop your database schema.*

4. **Start Command:**
   ```bash
   npm start
   ```

5. **Environment Variables:** Copy all key-value pairs from `.env.example` into Render's Environment settings in the Render Dashboard. Set `APP_URL` to your production Render URL (e.g. `https://your-app-name.onrender.com`).

---

## License
ISC License © 2026 ab-e1
