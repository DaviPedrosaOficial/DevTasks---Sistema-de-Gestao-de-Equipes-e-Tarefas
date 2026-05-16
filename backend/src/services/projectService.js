const prisma = require("../prisma/prisma");
const AppError = require("../errors/AppError");

class ProjectService {

    async create ({ name, description, userId }) {

        const project = await prisma.project.create({
            data: {
                name,
                description,
                userId
            }
        });

        return project;
    
    }

    async listByUser(userId) {

        const projects = await prisma.project.findMany({
            where: {
                userId
            }
        });

        return projects;

    }

    async getById({ projectId, userId }){

        const project = await prisma.project.findFirst({
            where: {
                id: Number(projectId),
                userId
            }
        });

        if (!project) {
            throw new AppError("Projeto não encontrado.", 404);
        }

        return project;
    }

    async update({ projectId, name, description, userId }) {

        const projectExists = await prisma.project.findFirst({
            where: {
                id: Number(projectId),
                userId
            }
        });

        if(!projectExists) {
            throw new AppError("Projeto não encontrado.", 404);
        }

        const project = await prisma.project.update({
           where: {
            id: Number(projectId)
           },
           data: {
            name,
            description
           }
        });

        return project;

    }

    async delete({ projectId, userId }) {

        const projectExists = await prisma.project.findFirst({
            where: {
                id: Number(projectId),
                userId
            }
        });

        if(!projectExists) {
            throw new AppError("Projeto não encontrado.", 404);
        }

        await prisma.project.delete({
            where: {
                id: Number(projectId)
            }
        });

        return {
            message: "Projeto deletado com sucesso."
        };
    }
}

module.exports = new ProjectService();