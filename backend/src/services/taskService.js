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

    async listByProject({ projectId, userId }) {

        const projectExists = await prisma.project.findFirst({
            where: {
                id: Number(projectId),
                userId
            }
        });

        if (!projectExists) {
            throw new Error("Projeto não encontrado.");
        }

        const tasks = await prisma.task.findMany({
            where: {
                projectId: Number(projectId),
                userId
            }
        });

        return tasks;
    }

    async updateStatus({ taskId, status, userId }) {

        const taskExists = await prisma.task.findFirst({
            where: {
                id: Number(taskId),
                userId
            }
        });

        if (!taskExists) {
            throw new Error("Tarefa não encontrada.");
        }

        const allowedStatus = [
            "pending",
            "in_progress",
            "done"
        ];

        if (!allowedStatus.includes(status)) {
            throw new Error("Status inválido.");
        }

        const updatedTask = await prisma.task.update({
            where: {
                id: Number(taskId)
            },
            data: {
                status
            }
        });

        return updatedTask
    }
}

module.exports = new TaskService();