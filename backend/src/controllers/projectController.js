const projectService = require("../services/projectService");
const ApiResponse = require("../utils/apiResponse");

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

            return res.status(201).json(ApiResponse.success(project, "Projeto criado com sucesso."));

        } catch (error) {

            return res.status(400).json(ApiResponse.error(error.message));

        }
    }

    async list(req, res) {

        try {

            const userId = req.userId;

            const projects = await projectService.listByUser(
                userId
            );

            return res.json(ApiResponse.success(projects));

        } catch (error) {

            return res.status(400).json(ApiResponse.error(error.message));

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

            return res.json(ApiResponse.success(project));
        
        } catch (error) {

            return res.status(404).json(ApiResponse.error(error.message));
        
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

            return res.json(ApiResponse.success(project, "Projeto atualizado com sucesso."));

        } catch (error) {

            return res.status(400).json(ApiResponse.error(error.message));
        
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

            return res.json(ApiResponse.success(result, "Projeto deletado com sucesso."));

        } catch (error) {

            return res.status(400).json(ApiResponse.error(error.message));
            
        }
    }
}

module.exports = new ProjectController();