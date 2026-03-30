import express, { Request, Response } from "express";
import { db } from "../db/index.js"
import { message, project } from "../db/schema.js";
import { randomUUID } from "node:crypto"
import { generateSlug } from "random-word-slugs";
import { and, eq } from "drizzle-orm";
export const createProject = async (req: Request, res: Response) => {
    try {
        const { content } = req.body
        const userId = req.user.id;



        const [newProject] = await db.insert(project).values({
            id: randomUUID(),
            name: generateSlug(),
            userId
        }).returning()
        await db.insert(message).values({
            id: randomUUID(),
            content,
            role: "USER",
            type: "RESULT",
            projectId: newProject.id
        })
        //todod :background jobs

        return res.status(200).json(newProject)
    } catch (error) {
        console.log("some problem in creating a project");
        return res.status(500).json({ message: "some problem in creating a project" })


    }
}


export const getallProjects = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(400).json({ message: "user not found" })

        }
        const projects = await db.select().from(project).where(eq(project.userId, userId))
        res.status(200).json({ message: "projects found succesfulluy", projects })

    } catch (error) {
        console.log("some problem in getting all project");
        return res.status(500).json({ message: "some problem in getting all project" })
    }
}


export const getProjectById = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({ message: "user not found" });
        }

        const { id } = req.params;


        if (!id) {
            return res.status(400).json({ message: "project id required" });
        }
        const projectId = id

        const projectData = await db
            .select()
            .from(project)
            .where(
                and(
                    eq(project.id, id),
                    eq(project.userId, userId)
                )
            );

        return res.status(200).json(projectData);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
export const deleteProject = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "project id required" })
        }
        await db.delete(project).where(and(eq(project.id, id), eq(project.userId, userId)))
        res.status(200).json({ message: "project deleted successfully" })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "internal server error deleting problem " })
    }
}
export const updateProject = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "project id required" })
        }
        const { name } = req.body
        if (!name) {
            return res.status(400).json({ message: "project name required" })
        }
        const [updateProject] = await db.update(project).set({ name }).where(and(eq(project.id, id), eq(project.userId, userId))).returning()
        if (!updateProject) {
            return res.status(400).json({ message: "project not found" })
        }
        res.status(200).json({ message: "project updated successfully", updateProject })
    } catch (error) {
        console.log("some problem in creating a project", error);
        return res.status(500).json({ message: "some problem in creating a project" })


    }


};