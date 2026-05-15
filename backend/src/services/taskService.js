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

    async listByProject({ projectId, userId, status, search }) {

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
                userId,
                ...(status && { status }),
                ...(search && {
                    OR: [
                        {
                            title: {
                                contains: search
                            }
                        },
                        {
                            description: {
                                contains: search
                            }
                        }
                    ]
                })
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

    async update({ taskId, title, description, priority, userId }) {

        const taskExists =  await prisma.task.findFirst({
            where: {
                id: Number(taskId),
                userId
            }
        });

        if (!taskExists) {
            throw new Error("Tarefa não encontrada.");
        }

        const allowedPriorities = [
            "low",
            "medium",
            "high"
        ];

        if (priority && !allowedPriorities.includes(priority)) {
            throw new Error("Prioridade inválida.");
        }

        const updatedTask = await prisma.task.update({
            where: {
                id: Number(taskId)
            },
            data: {
                title,
                description,
                priority
            }
        });

        return updatedTask;
    }

    async delete({ taskId, userId }) {

        const taskExists = await prisma.task.findFirst({
            where: {
                id: Number(taskId),
                userId
            }
        });

        if (!taskExists) {
            throw new Error("Tarefa não encontrada.");
        }

        await prisma.task.delete({
            where: {
                id: Number(taskId)
            }
        });

        return {
            message: "Tarefa deletada com sucesso."
        };
    }
}

module.exports = new TaskService();