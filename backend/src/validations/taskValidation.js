const { z } = require("zod");

const createTaskSchema = z.object({
    title: z.string().min(2, "O título da tarefa é obrigatório."),
    description: z.string().optional(),
    
    status: z.enum([
        "pending",
        "in_progress",
        "done"
    ], "Status inválido.").optional(),
    
    priority: z.enum([
        "low",
        "medium",
        "high"
    ], "Prioridade inválida.").optional(),
    
    projectId: z.coerce.number().int().positive("O ID do projeto é inválido.")
});

const listByProjectParamsSchema = z.object({
    projectId: z.coerce.number().int().positive("O ID do projeto é inválido.")
});

const listByProjectQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(50, "O limite máximo de resultados permitidos é 50.").optional(),
  
  order: z.enum([
    "asc",
    "desc"
  ]).optional(),

  orderBy: z.enum([
    "createdAt",
    "priority",
    "status",
    "title"
  ]).optional(),

  status: z.enum([
    "pending",
    "in_progress",
    "done"
  ]).optional(),

  search: z.string().optional()
});

const getStatsParamsSchema = z.object({
    projectId: z.coerce.number().int().positive("O ID do projeto é inválido.")
});

const updateStatusParamsSchema = z.object({
    id: z.coerce.number().int().positive("O ID da tarefa é inválido.")
});

const updateStatusSchema = z.object({
    status: z.enum([
        "pending",
        "in_progress",
        "done"
    ], "Status inválido.")
});

const updateTaskParamsSchema = z.object({
    id: z.coerce.number().int().positive("O ID da tarefa é inválido.")
});

const updateTaskSchema = z.object({
    
    title: z.string().min(2, "O título da tarefa é obrigatório.").optional(),
    description: z.string().optional(),
    priority: z.enum([
        "low",
        "medium",
        "high"
    ], "Prioridade inválida.").optional()

}).refine(

    data =>
        data.title !== undefined ||
        data.description !== undefined ||
        data.priority !== undefined,
    {
        message: "Pelo menos um campo (título, descrição ou prioridade) deve ser fornecido para atualização."
    }
);

const deleteTaskParamsSchema = z.object({
    id: z.coerce.number().int().positive("O ID da tarefa é inválido.")
});

module.exports = {
    createTaskSchema,
    listByProjectParamsSchema,
    listByProjectQuerySchema,
    getStatsParamsSchema,
    updateStatusParamsSchema,
    updateStatusSchema,
    updateTaskParamsSchema,
    updateTaskSchema,
    deleteTaskParamsSchema
};