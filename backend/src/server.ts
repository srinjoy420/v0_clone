import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import express, { Request, Response } from "express";
import { auth } from "./lib/auth.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 8080;

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

app.listen(PORT, () => {
  console.log(`app is running on http://localhost:${PORT}`);
});