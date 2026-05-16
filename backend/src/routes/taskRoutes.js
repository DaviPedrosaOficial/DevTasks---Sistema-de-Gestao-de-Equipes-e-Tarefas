const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");

const taskController = require("../controllers/taskController");

const routes = express.Router();

/**
 * @swagger
 *  /tasks:
 *     post:
 *       summary: Cria uma nova tarefa
 *       tags: [Tasks]
 *       security:
 *         - bearerAuth: []
 *
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateTaskInput'
 *
 *       responses:
 *         201:
 *           description: Tarefa criada com sucesso
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Task'
 *         400:
 *           description: Dados inválidos
 */
routes.post("/", authMiddleware, taskController.create);

/**
 * @swagger
 * /tasks/project/{projectId}:
 *   get:
 *     summary: Lista as tarefas de um projeto
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do projeto
 *
 *       - $ref: '#/components/parameters/PageParam'
 *
 *       - $ref: '#/components/parameters/LimitParam'
 *
 *       - $ref: '#/components/parameters/SearchParam'
 *
 *     responses:
 *       200:
 *         description: Lista de tarefas
 *
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
routes.get("/project/:projectId", authMiddleware, taskController.listByProject);

/**
 * @swagger
 * /tasks/stats/project/{projectId}:
 *   get:
 *     summary: Obtém status das tarefas de um projeto
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do projeto
 *
 *     responses:
 *       200:
 *         description: Status das tarefas
 *
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *               properties:
 *                 
 *                 total:
 *                   type: integer
 *                   example: 10
 * 
 *                 pending:
 *                   type: integer
 *                   example: 3
 * 
 *                 in_progress:
 *                   type: integer
 *                   example: 5
 * 
 *                 done:
 *                   type: integer
 *                   example: 2
 */
routes.get("/stats/project/:projectId", authMiddleware, taskController.getStats);

/**
 * @swagger
 * /tasks/{id}/status:
 *   put:
 *     summary: Atualiza o status de uma tarefa
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da tarefa
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *               status:
 *                 type: string
 *                 example: completed
 *
 *     responses:
 *       200:
 *         description: Status da tarefa atualizado com sucesso
 *
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *
 *       404:
 *         description: Tarefa não encontrada
 */
routes.put("/:id/status", authMiddleware, taskController.updateStatus);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Atualiza uma tarefa
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da tarefa
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskInput'
 *
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 *
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *
 *       404:
 *         description: Tarefa não encontrada
 */
routes.put("/:id", authMiddleware, taskController.update);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Exclui uma tarefa
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da tarefa
 *
 *     responses:
 *       200:
 *         description: Tarefa excluída com sucesso
 *
 *       404:
 *         description: Tarefa não encontrada
 */
routes.delete("/:id", authMiddleware, taskController.delete);



module.exports = routes;