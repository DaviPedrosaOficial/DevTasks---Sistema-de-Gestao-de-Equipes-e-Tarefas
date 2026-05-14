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

}

module.exports = new ProjectService();