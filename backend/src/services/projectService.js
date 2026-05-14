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

}

module.exports = new ProjectService();