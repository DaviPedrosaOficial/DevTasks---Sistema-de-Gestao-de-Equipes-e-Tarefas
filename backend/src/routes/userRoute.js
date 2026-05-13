const express = require("express");

const userController = require("../controllers/userController");

const routes = express.Router();

routes.post("/register", userController.register);
routes.post("/login", userController.login);

module.exports = routes;