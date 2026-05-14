const prisma = require("../prisma/prisma");

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
            throw new Error("Projeto não encontrado.")
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
            throw new Error("Projeto não encontrado.");
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

}

module.exports = new ProjectService();