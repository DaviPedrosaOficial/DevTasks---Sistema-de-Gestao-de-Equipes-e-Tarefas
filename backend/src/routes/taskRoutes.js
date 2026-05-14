const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");

const taskController = require("../controllers/taskController");

const routes = express.Router();

routes.post("/", authMiddleware, taskController.create);
routes.get("/project/:projectId", authMiddleware, taskController.listByProject);
routes.put("/:id/status", authMiddleware, taskController.updateStatus);
routes.put("/:id", authMiddleware, taskController.update);
routes.delete("/:id", authMiddleware, taskController.delete);

module.exports = routes;