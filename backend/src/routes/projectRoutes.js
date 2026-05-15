const express = require("express");

const projectController = require("../controllers/projectController");

const authMiddleware = require("../middlewares/authMiddleware");

const routes = express.Router();

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Cria um novo projeto
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Projeto DevTasks
 *               description:
 * 
 *                 type: string
 *                 example: Sistema de gerenciamento de tarefas
 *
 *     responses:
 *       201:
 *         description: Projeto criado com sucesso
 * 
 *         content:
 *          application/json:
 *            schema:
 *             $ref: '#/components/schemas/Project'
 * 
 *       400:
 *         description: Dados inválidos
 */
routes.post("/", authMiddleware, projectController.create);

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Lista os projetos do usuário
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Lista de projetos
 *
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *
 *               items:
 *                 $ref: '#/components/schemas/Project'
 */
routes.get("/", authMiddleware, projectController.list);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Obtém um projeto pelo ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do projeto
 * 
 *     responses:
 *       200:
 *         description: Projeto encontrado
 * 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Projeto não encontrado
 */
routes.get("/:id", authMiddleware, projectController.getById);

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Atualiza um projeto
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do projeto
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *               name:
 *                 type: string
 *                 example: Novo nome do projeto
 *
 *               description:
 *                 type: string
 *                 example: Nova descrição do projeto
 *
 *     responses:
 *       200:
 *         description: Projeto atualizado com sucesso
 *
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *
 *       404:
 *         description: Projeto não encontrado
 */
routes.put("/:id", authMiddleware, projectController.update);

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Exclui um projeto
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do projeto
 *
 *     responses:
 *       200:
 *         description: Projeto excluído com sucesso
 *
 *       404:
 *         description: Projeto não encontrado
 */
routes.delete("/:id", authMiddleware, projectController.delete);

module.exports = routes;