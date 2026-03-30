import {Router} from "express"
import { authenticate } from "../middleware/auth.middleware.js";
import { createProject, deleteProject, getallProjects, getProjectById, updateProject } from "../controller/project.controller.js";

const projectRouter=Router();
projectRouter.post("/create-project",authenticate,createProject)
projectRouter.get("/allprojects",authenticate,getallProjects)
projectRouter.get("/project/:id",authenticate,getProjectById)
projectRouter.delete("/delete/:id",authenticate,deleteProject)
projectRouter.put("/update/:id",authenticate,updateProject)

export default projectRouter