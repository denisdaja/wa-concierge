import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Lexo të njëjtat sekrete si Next.js
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});