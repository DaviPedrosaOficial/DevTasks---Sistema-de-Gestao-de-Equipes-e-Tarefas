const taskService = require("../services/taskService");
const ApiResponse = require("../utils/apiResponse");
const { createTaskSchema, listByProjectParamsSchema, listByProjectQuerySchema, getStatsParamsSchema, updateStatusParamsSchema, updateStatusSchema, updateTaskParamsSchema, updateTaskSchema, deleteTaskParamsSchema } = require("../validations/taskValidation");

class TaskController {

    async create(req, res, next) {

        try {

            createTaskSchema.parse(req.body);

            const {
                title,
                description,
                status,
                priority,
                projectId
            } = req.body;

            const userId = req.userId;

            const task = await taskService.create({
                title,
                description,
                status,
                priority,
                projectId,
                userId
            });

            return res.status(201).json(ApiResponse.success(task, "Tarefa criada com sucesso."));
        
        } catch (error) {

            next(error);
        
        }
    }

    async listByProject(req, res, next) {

        try {

            listByProjectParamsSchema.parse(req.params);
            listByProjectQuerySchema.parse(req.query);

            const { projectId } = req.params;

            const userId = req.userId;

            const { status, priority, search, page = 1, limit = 10, orderBy = "createdAt", order = "desc" } = req.query;

            const tasks = await taskService.listByProject({
                projectId,
                userId,
                status,
                priority,
                search,
                page,
                limit,
                orderBy,
                order
            });

            return res.json(ApiResponse.success(tasks));

        } catch (error) {

            next(error);

        }
    }

    async getStats(req, res, next) {

        try {

            getStatsParamsSchema.parse(req.params);

            const {projectId} = req.params;

            const userId = req.userId;

            const stats = await taskService.getStats({
                projectId,
                userId
            });

            return res.json(ApiResponse.success(stats));

        } catch (error) {

            next(error);
        
        }
    }
    
    async updateStatus(req, res, next) {

        try {

            updateStatusParamsSchema.parse(req.params);
            updateStatusSchema.parse(req.body);

            const { id } = req.params;

            const { status } = req.body;

            const userId = req.userId;

            const task = await taskService.updateStatus({
                taskId: id,
                status,
                userId
            });

            return res.json(ApiResponse.success(task, "Status da tarefa atualizado com sucesso."));

        } catch (error) {

            next(error);

        }
    }

    async update(req, res, next) {

        try {

            updateTaskParamsSchema.parse(req.params);
            updateTaskSchema.parse(req.body);

            const { id } = req.params;

            const { title, description, priority } = req.body;

            const userId = req.userId;

            const task = await taskService.update({
                taskId: id,
                title,
                description,
                priority,
                userId
            });

            return res.json(ApiResponse.success(task, "Tarefa atualizada com sucesso."));

        } catch (error) {

            next(error);

        }
    }

    async delete(req, res, next) {

        try {

            deleteTaskParamsSchema.parse(req.params);

            const { id } = req.params;

            const userId = req.userId;

            const result = await taskService.delete({
                taskId: id,
                userId
            })

            return res.json(ApiResponse.success(result, "Tarefa deletada com sucesso."));

        } catch (error) {

            next(error);
        
        }
    }

}

module.exports = new TaskController();