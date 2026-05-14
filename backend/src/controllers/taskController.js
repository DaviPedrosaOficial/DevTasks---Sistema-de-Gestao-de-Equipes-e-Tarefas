const taskService = require("../services/taskService");

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

            return res.status(201).json(task);
        
        } catch (error) {

            return res.status(400).json({
                error: error.message
            });
        
        }
    }

    async listByProject(req, res) {

        try {

            const { projectId } = req.params;

            const userId = req.userId;

            const tasks = await taskService.listByProject({
                projectId,
                userId
            });

            return res.json(tasks);

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });

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

            return res.json(task);

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });
            
        }
    }
}

module.exports = new TaskController();