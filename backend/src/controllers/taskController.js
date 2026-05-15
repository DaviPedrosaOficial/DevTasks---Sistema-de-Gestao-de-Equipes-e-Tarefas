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

            const { status, search } = req.query;

            const tasks = await taskService.listByProject({
                projectId,
                userId,
                status,
                search
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

            return res.json(task);

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

            const result = await taskService.delete({
                taskId: id,
                userId
            })

            return res.json(result);

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });
        
        }
    }
}

module.exports = new TaskController();