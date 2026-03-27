import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.js"; // your drizzle instance
import * as schema from "../db/schema.js"
import dotenv from "dotenv"
dotenv.config()

export const auth = betterAuth({
    secret:process.env.BETTER_AUTH_SECRET,
    baseURL:process.env.BETTER_AUTH_URL,
    trustedOrigins: ["http://localhost:8080"],
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema
    }),
    emailAndPassword:{
        enabled: true,
        autoSignIn: true
    }
});