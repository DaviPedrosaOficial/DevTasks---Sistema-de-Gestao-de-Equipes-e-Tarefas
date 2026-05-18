const prisma = require("../prisma/prisma");
const AppError = require("../errors/AppError");

class TaskService {

    async create({ title, description, status, priority, projectId, userId }) {

        const projectExists = await prisma.project.findFirst({
            where: {
                id: Number(projectId),
                userId
            }
        });

        if (!projectExists) {
            throw new AppError("Projeto não encontrado.", 404);
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
            throw new AppError("Projeto não encontrado.", 404);
        }

        const parsedPage = Number(page);

        const parsedLimit = Number(limit);

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
            tasks,

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
            throw new AppError("Projeto não encontrado.", 404);
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
            throw new AppError("Tarefa não encontrada.", 404);
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
            throw new AppError("Tarefa não encontrada.", 404);
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
            throw new AppError("Tarefa não encontrada.", 404);
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