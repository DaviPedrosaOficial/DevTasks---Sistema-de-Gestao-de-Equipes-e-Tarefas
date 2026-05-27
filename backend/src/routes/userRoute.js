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
*
*     requestBody:
*       required: true
*
*       content:
*         application/json:
*           schema:
*             type: object
*
*             properties:
*               name:
*                 type: string
*               email:
*                 type: string
*               password:
*                 type: string
*
*     responses:
*       201:
*         description: Usuário criado com sucesso
*
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*
*       400:
*         description: Erro de validação
*/
routes.post("/register", userController.register);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Realiza login de usuário
 *     tags: [Users]
 * 
 *     requestBody:
 *       required: true
 * 
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 * 
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 * 
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 * 
 *       401:
 *         description: Credenciais inválidas
 */
routes.post("/login", userController.login);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Retorna os dados do usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Dados do usuário retornados com sucesso
 *
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 *       401:
 *         description: Token inválido ou não fornecido
 */
routes.get("/me", authMiddleware, userController.me);

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Atualiza os dados do usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *               name:
 *                 type: string
 *                 example: Davi Pedrosa
 *
 *               email:
 *                 type: string
 *                 example: davi@email.com
 *
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 *       401:
 *         description: Token inválido ou não fornecido
 */
routes.patch("/me", authMiddleware, userController.update);

/**
 * @swagger
 * /users/me/password:
 *   patch:
 *     summary: Atualiza a senha do usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: senha123
 *
 *               newPassword:
 *                 type: string
 *                 example: novaSenha123
 *
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso
 *
 *       401:
 *         description: Senha atual incorreta ou token inválido
 */
routes.patch("/me/password", authMiddleware, userController.updatePassword);

/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Deleta a conta do usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Conta deletada com sucesso
 *
 *       401:
 *         description: Token inválido ou não fornecido
 */
routes.delete("/me", authMiddleware, userController.delete);


module.exports = routes;