const express = require("express");

const projectController = require("../controllers/projectController");

const authMiddleware = require("../middlewares/authMiddleware");

const routes = express.Router();

routes.post("/", authMiddleware, projectController.create);
routes.get("/", authMiddleware, projectController.list);
routes.get("/:id", authMiddleware, projectController.getById);
routes.put("/:id", authMiddleware, projectController.update);
routes.delete("/:id", authMiddleware, projectController.delete);

module.exports = routes;