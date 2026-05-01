import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import express, { Request, Response } from "express";
import { serve } from "inngest/express";
import { inngest,functions } from "./integration/inngest/index.js";

import { auth } from "./lib/auth.js";

import dotenv from "dotenv";
import cors from "cors";
import projectRouter from "./routes/projects.routes.js";


dotenv.config();

const app = express();
const PORT = 8080;
app.use(express.json());
app.use(
  cors({
    // all origins
    origin: ["*"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Range", "X-Total-Count"],
    maxAge: 86400,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);

// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use("/api/inngest", serve({ client: inngest, functions }));

// Global middleware - no path filter
app.use("/api/auth/{*any}", (req, _res, next) => {
    console.log("HEADERS:", req.headers);
  if (!req.headers.origin) {
    req.headers["origin"] = `http://localhost:${PORT}`;
  }
  next();
});

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.get("/", (req: Request, res: Response) => {
  res.send("hello");
});
app.get("/api/me", async (req, res) => {
 	const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
	return res.json(session);
});
app.use("/api/projects",projectRouter)
app.listen(PORT, () => {
  console.log(`app is running on http://localhost:${PORT}`);
});