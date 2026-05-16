const projectService = require("../services/projectService");
const ApiResponse = require("../utils/apiResponse");
const { createProjectSchema, getProjectByIdSchema, updateProjectParamsSchema, updateProjectSchema, deleteProjectSchema } = require("../validations/projectValidation");

class ProjectController {

    async create(req, res, next) {

        try {

            createProjectSchema.parse(req.body);

            const { name, description } = req.body;

            const userId = req.userId;

            const project = await projectService.create({
                name,
                description,
                userId
            });

            return res.status(201).json(ApiResponse.success(project, "Projeto criado com sucesso."));

        } catch (error) {

            next(error);
        }
    }

    async list(req, res, next) {

        try {

            const userId = req.userId;

            const projects = await projectService.listByUser(
                userId
            );

            return res.json(ApiResponse.success(projects));

        } catch (error) {

            next(error);
        }
    }

    async getById(req, res, next) {

        try {

            getProjectByIdSchema.parse(req.params);

            const { id } = req.params;

            const userId = req.userId;

            const project = await projectService.getById({
                projectId: id,
                userId
            });

            return res.json(ApiResponse.success(project));
        
        } catch (error) {

            next(error);
        
        }
    }

    async update(req, res, next) {

        try {
            
            updateProjectParamsSchema.parse(req.params);
            updateProjectSchema.parse(req.body);
            
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

            next(error);
        
        }
    }

    async delete(req, res, next) {

        try {

            deleteProjectSchema.parse(req.params);

            const { id } = req.params;

            const userId = req.userId;

            const result = await projectService.delete({
                projectId: id,
                userId
            });

            return res.json(ApiResponse.success(result, "Projeto deletado com sucesso."));

        } catch (error) {

            next(error);

        }
    }
}

module.exports = new ProjectController();