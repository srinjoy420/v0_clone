import { User } from "../db/schema"; // or your user type

declare global {
  namespace Express {
    interface Request {
      user?: any; // or better: User
    }
  }
}