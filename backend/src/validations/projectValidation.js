const { z } = require("zod");

const createProjectSchema = z.object({
    name: z.string().min(1, "O nome do projeto é obrigatório"),
    description: z.string().optional()
});

const getProjectByIdSchema = z.object({
    id: z.coerce.number().int().positive("ID do projeto inválido")
});

const updateProjectParamsSchema = z.object({
    id: z.coerce.number().int().positive("ID do projeto inválido")
});

const updateProjectSchema = z.object({
    name: z.string().min(1, "O nome do projeto é obrigatório").optional(),
    description: z.string().optional()
});

const deleteProjectSchema = z.object({
    id: z.coerce.number().int().positive("ID do projeto inválido")
});

module.exports = {
    createProjectSchema,
    getProjectByIdSchema,
    updateProjectParamsSchema,
    updateProjectSchema,
    deleteProjectSchema
};