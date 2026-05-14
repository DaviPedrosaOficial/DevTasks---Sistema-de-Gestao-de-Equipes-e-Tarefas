const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");

const taskController = require("../controllers/taskController");

const routes = express.Router();

routes.post("/", authMiddleware, taskController.create);

module.exports = routes;