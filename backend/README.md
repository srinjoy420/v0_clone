# Better Auth + Drizzle Setup (Step by Step)

This guide explains **what to create**, **which folder to use**, and **the correct order** to set up Better Auth with Drizzle in this backend project.

## 1) Go to backend folder

```bash
cd backend
```

All commands below run inside `backend/`.

## 2) Install dependencies

```bash
npm install better-auth drizzle-orm express pg dotenv
npm install -D drizzle-kit typescript ts-node-dev @types/node @types/express @types/pg
```

## 3) Create environment variables (`backend/.env`)

Create a `.env` file in `backend/`:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/your_db
BETTER_AUTH_SECRET=your_super_secret_key
BETTER_AUTH_URL=http://localhost:8080
```

> Important: Use `DATABASE_URL` (uppercase URL).  
> If your code uses `DATABASE_URl` (lowercase `l` at end), change it to `DATABASE_URL` in:
- `src/db/index.ts`
- `drizzle.config.ts`

## 4) Create Drizzle config (`backend/drizzle.config.ts`)

File path: `drizzle.config.ts`

Use this config:

```ts
import type { Config } from "drizzle-kit";
import dotenv from "dotenv";
dotenv.config();

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

## 5) Create database folder (`backend/src/db/`)

### a) `backend/src/db/index.ts`

```ts
import { drizzle } from "drizzle-orm/node-postgres";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });

export const db = drizzle(pool);
```

### b) `backend/src/db/schema.ts`

Define Better Auth tables here (`user`, `session`, `account`, `verification`).

You already have this file in your project. Keep it as the single source of truth for auth tables.

## 6) Create auth file (`backend/src/lib/auth.ts`)

File path: `src/lib/auth.ts`

```ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.js";
import * as schema from "../db/schema.js";
import dotenv from "dotenv";

dotenv.config();

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: ["http://localhost:8080"],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
});
```

## 7) Mount auth routes in server (`backend/src/server.ts`)

Make sure `src/server.ts` includes:

- `toNodeHandler(auth)` on `/api/auth/{*any}`
- optional middleware to ensure origin
- session test route like `/api/me`

Your current server file already has this flow.

## 8) Generate and run migrations

Add scripts to `backend/package.json`:

```json
{
  "scripts": {
    "dev": "set TS_NODE_TRANSPILE_ONLY=true&& node --loader ts-node/esm --no-warnings src/server.ts",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate"
  }
}
```

Then run:

```bash
npm run db:generate
npm run db:migrate
```

This creates SQL files in `backend/drizzle/` and applies schema to your Postgres DB.

## 9) Run backend

```bash
npm run dev
```

Test endpoints:

- `GET http://localhost:8080/`
- Better Auth routes under `http://localhost:8080/api/auth/*`
- `GET http://localhost:8080/api/me` (session check)

## Folder + file order (quick reference)

1. `backend/.env`
2. `backend/drizzle.config.ts`
3. `backend/src/db/index.ts`
4. `backend/src/db/schema.ts`
5. `backend/src/lib/auth.ts`
6. `backend/src/server.ts`
7. `backend/drizzle/*` (generated migrations)

---

If you want, I can also clean up the existing code to replace all `DATABASE_URl` usages with `DATABASE_URL` automatically.
