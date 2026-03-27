import {Router} from "express"
import { authenticate } from "../middleware/auth.middleware.js";
import { createProject } from "../controller/project.controller.js";

const projectRouter=Router();
projectRouter.post("/",authenticate,createProject)
// projectRouter.get("/")
// projectRouter.get("/:id")
// projectRouter.post("/")

export default projectRouter