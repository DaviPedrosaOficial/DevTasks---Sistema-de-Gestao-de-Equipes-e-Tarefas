const projectService = require("../services/projectService");

class ProjectController {

    async create(req, res) {

        try {

            const { name, description } = req.body;

            const userId = req.userId;

            const project = await projectService.create({
                name,
                description,
                userId
            });

            return res.status(201).json(project);

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });

        }
    }

    async list(req, res) {

        try {

            const userId = req.userId;

            const projects = await projectService.listByUser(
                userId
            );

            return res.json(projects);

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });

        }
    }

    async getById(req, res) {

        try {

            const { id } = req.params;

            const userId = req.userId;

            const project = await projectService.getById({
                projectId: id,
                userId
            });

            return res.json(project);
        
        } catch (error) {

            return res.status(404).json({
                error: error.message
            });
        
        }
    }

    async update(req, res) {

        try {

            const { id } = req.params;

            const { name, description } = req.body;

            const userId = req.userId;

            const project = await projectService.update({
                projectId: id,
                name,
                description,
                userId
            });

            return res.json(project);

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });
        
        }
    }

    async delete(req, res) {

        try {

            const { id } = req.params;

            const userId = req.userId;

            const result = await projectService.delete({
                projectId: id,
                userId
            });

            return res.json(result);

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });
            
        }
    }
}

module.exports = new ProjectController();