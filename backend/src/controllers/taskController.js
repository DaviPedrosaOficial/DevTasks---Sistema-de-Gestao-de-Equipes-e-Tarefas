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
}

module.exports = new TaskController();