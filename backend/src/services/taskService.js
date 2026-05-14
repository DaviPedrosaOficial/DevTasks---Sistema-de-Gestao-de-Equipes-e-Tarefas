const prisma = require("../prisma/prisma");

class TaskService {

    async create({ title, description, status, priority, projectId, userId }) {

        const projectExists = await prisma.project.findFirst({
            where: {
                id: Number(projectId),
                userId
            }
        });

        if (!projectExists) {
            throw new Error("Projeto não encontrado.");
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                status,
                priority,
                projectId: Number(projectId),
                userId
            }
        });

        return task;
    }
}

module.exports = new TaskService();