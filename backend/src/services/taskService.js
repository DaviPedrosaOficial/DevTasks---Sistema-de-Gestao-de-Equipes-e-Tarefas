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

    async listByProject({ projectId, userId, status, search, page, limit, orderBy, order }) {

        const projectExists = await prisma.project.findFirst({
            where: {
                id: Number(projectId),
                userId
            }
        });

        if (!projectExists) {
            throw new Error("Projeto não encontrado.");
        }

        const skip = (Number(page) - 1) * Number(limit);

        const total = await prisma.task.count({
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

        const totalPages = Math.ceil(total / Number(limit));

        const allowedOrderBy = [
            "createdAt",
            "priority",
            "status",
            "title"
        ]

        if (!allowedOrderBy.includes(orderBy)) {
            throw new Error("Campo orderBy inválido.");
        }

        const allowedOrder = [
            "asc",
            "desc"
        ]

        if (!allowedOrder.includes(order)) {
            throw new Error("Tipo de ordenação inválido.");
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
            },

            orderBy: {
                [orderBy]: order
            },

            skip,
            
            take: Number(limit)
        });

        return {
            data: tasks,

            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages
            }
        };
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

    async getStats({ projectId, userId }) {

        const projectExists = await prisma.project.findFirst({
            where: {
                id: Number(projectId),
                userId
            }
        });

        if (!projectExists) {
            throw new Error("Projeto não encontrado.");
        }

        const total = await prisma.task.count({
            where: {
                projectId: Number(projectId),
                userId
            }
        });

        const pending = await prisma.task.count({
            where: {
                projectId: Number(projectId),
                userId,
                status: "pending"
            }
        });

        const inProgress = await prisma.task.count({
            where: {
                projectId: Number(projectId),
                userId,
                status: "in_progress"
            }
        });

        const done = await prisma.task.count({
            where: {
                projectId: Number(projectId),
                userId,
                status: "done"
            }
        });

        return {
            total,
            pending,
            in_progress: inProgress,
            done
        };
    }
}

module.exports = new TaskService();