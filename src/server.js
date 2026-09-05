import { port } from "./config/loadEnv.js";
import { app } from "./app.js";
import { prisma } from "./config/prisma.js";
try {
  await prisma.$connect();
  console.log("database connected successfully");
  app.listen(port, () => {
    console.log(`server running on port ${port}`);
  });
} catch (err) {
  console.log("failed to connect to database: ", err);
}
