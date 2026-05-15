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

        const parsedPage = Number(page);

        const parsedLimit = Number(limit);

        if (isNaN(parsedPage) || parsedPage < 1) {
            throw new Error("Página inválida. Deve ser um número inteiro maior que 0.");
        }

        if (isNaN(parsedLimit) || parsedLimit < 1) {
            throw new Error("Limite inválido. Deve ser um número inteiro maior que 0.");
        }

        if (parsedLimit > 50) {
            throw new Error("Limite máximo permitido é 50.");
        }

        const skip = (parsedPage - 1) * parsedLimit;

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

        const totalPages = Math.ceil(total / Number(parsedLimit));

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
            
            take: Number(parsedLimit)
        });

        return {
            data: tasks,

            meta: {
                total,
                page: Number(parsedPage),
                limit: Number(parsedLimit),
                totalPages
            }
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