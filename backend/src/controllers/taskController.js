const taskService = require("../services/taskService");
const ApiResponse = require("../utils/apiResponse");

class TaskController {

    async create(req, res) {

        try {

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

            return res.status(400).json(ApiResponse.error(error.message));
        
        }
    }

    async listByProject(req, res) {

        try {

            const { projectId } = req.params;

            const userId = req.userId;

            const { status, search, page = 1, limit = 10, orderBy = "createdAt", order = "desc" } = req.query;

            const tasks = await taskService.listByProject({
                projectId,
                userId,
                status,
                search,
                page,
                limit,
                orderBy,
                order
            });

            return res.json(ApiResponse.success(tasks));

        } catch (error) {

            return res.status(400).json(ApiResponse.error(error.message));

        }
    }

    async updateStatus(req, res) {

        try {

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

            return res.status(400).json(ApiResponse.error(error.message));

        }
    }

    async update(req, res) {

        try {

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

            return res.status(400).json(ApiResponse.error(error.message));

        }
    }

    async delete(req, res) {

        try {

            const { id } = req.params;

            const userId = req.userId;

            const result = await taskService.delete({
                taskId: id,
                userId
            })

            return res.json(ApiResponse.success(result, "Tarefa deletada com sucesso."));

        } catch (error) {

            return res.status(400).json(ApiResponse.error(error.message));
        
        }
    }

    async getStats(req, res) {

        try {

            const {projectId} = req.params;

            const userId = req.userId;

            const stats = await taskService.getStats({
                projectId,
                userId
            });

            return res.json(ApiResponse.success(stats));

        } catch (error) {

            return res.status(400).json(ApiResponse.error(error.message));
        
        }
    }
}

module.exports = new TaskController();