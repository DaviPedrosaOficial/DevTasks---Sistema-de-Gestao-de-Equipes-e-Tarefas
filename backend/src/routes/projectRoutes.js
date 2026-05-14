const express = require("express");

const projectController = require("../controllers/projectController");

const authMiddleware = require("../middlewares/authMiddleware");

const routes = express.Router();

routes.post("/", authMiddleware, projectController.create);

module.exports = routes;