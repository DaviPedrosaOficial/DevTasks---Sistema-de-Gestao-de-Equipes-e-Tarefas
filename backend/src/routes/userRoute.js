const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");

const userController = require("../controllers/userController");

const routes = express.Router();

routes.post("/register", userController.register);
routes.post("/login", userController.login);

routes.get(
  "/profile",
  authMiddleware,
  (req, res) => {

    return res.json({
      message: "Rota privada funcionando 🔥",
      userId: req.userId
    });

  }
);

module.exports = routes;