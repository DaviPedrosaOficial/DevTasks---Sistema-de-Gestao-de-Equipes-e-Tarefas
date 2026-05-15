const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");

const userController = require("../controllers/userController");

const routes = express.Router();

/**
* @swagger
* /users/register:
*   post:
*     summary: Registrar um novo usuário
*     tags: [Users]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               name:
*                 type: string
*               email:
*                 type: string
*               password:
*                 type: string
*     responses:
*       201:
*         description: Usuário criado com sucesso
*
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*/
routes.post("/register", userController.register);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Realiza login de usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 */
routes.post("/login", userController.login);

module.exports = routes;