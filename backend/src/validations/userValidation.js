const { z } = require("zod");

const registerSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    email: z.email("Email inválido"),
    password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres")
})

const loginSchema = z.object({
    email: z.email("Email inválido"),
    password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres")
})

module.exports = {
    registerSchema,
    loginSchema
};