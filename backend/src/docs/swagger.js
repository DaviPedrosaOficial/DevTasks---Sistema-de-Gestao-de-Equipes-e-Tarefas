const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "DevTasks API",
            version: "1.0.0",
            description: "API de gerenciamento de tarefas"
        },

        servers: [
            {
                url: "http://localhost:3000"
            }
        ],

        components: {

            schemas: {

                User: {

                    type: "object",
                    
                    properties: {
                        
                        id: {
                            type: "integer",
                            example: 1
                        },

                        name: {
                            type: "string",
                            example: "John Doe"
                        },

                        email: {
                            type: "string",
                            example: "john.doe@example.com"
                        },

                        createdAt: {
                            type: "string",
                            example: "2026-05-15T12:00:00.000Z"
                        }
                    }
                },

                LoginResponse: {

                    type: "object",

                    properties: {

                        success: {
                            type: "boolean",
                            example: true
                        },

                        message: {
                            type: "string",
                            example: "Usuário logado com sucesso"
                        },

                        data: {
                            type: "object",

                            properties: {

                                token: {
                                    type: "string",
                                    example: "eyJhbGciOi..."
                                }
                            }
                        }
                    }
                },

                Project: {
                    
                    type: "object",

                    properties: {
                        
                        id: {
                            type: "integer",
                            example: 1
                        },

                        name: {
                            type: "string",
                            example: "Projeto DevTasks"
                        },

                        description: {
                            type: "string",
                            example: "Sistema de gerenciamento de tarefas"
                        },

                        createdAt: {
                            type: "string",
                            example: "2026-05-15T12:00:00.000Z"
                        }
                    }
                },

                Task: {

                    type: "object",

                    properties: {

                        id: {
                            type: "integer",
                            example: 1
                        },

                        title: {
                            type: "string",
                            example: "Criar documentação Swagger"
                        },

                        description: {
                            type: "string",
                            example: "Documentar todas as rotas da API"
                        },

                        status: {
                            type: "string",
                            example: "pending"
                        },

                        priority: {
                            type: "string",
                            example: "high"
                        },

                        projectId: {
                            type: "integer",
                            example: 1
                        },

                        userId: {
                            type: "integer",
                            example: 1
                        },

                        createdAt: {
                            type: "string",
                            example: "2026-05-15T12:00:00.000Z"
                        }
                    }
                },

                CreateTaskInput: {

                    type: "object",

                    required: ["title", "projectId"],

                    properties: {

                        title: {
                            type: "string",
                            example: "Criar botão de delete para tarefas"
                        },

                        description: {
                            type: "string",
                            example: "Permitir que o usuário delete tarefas diretamente da interface"
                        },

                        status: {
                            type: "string",
                            example: "pending"
                        },

                        priority: {
                            type: "string",
                            example: "high"
                        },

                        projectId: {
                            type: "integer",
                            example: 1
                        }
                    }
                },

                UpdateTaskInput: {

                    type: "object",

                    properties: {

                        title: {
                            type: "string",
                            example: "Criar página de estatísticas"
                        },

                        description: {
                            type: "string",
                            example: "Adicionar uma página com gráficos e estatísticas sobre as tarefas"
                        },

                        priority: {
                            type: "string",
                            example: "medium"
                        }
                    }
                }
            },

            parameters: {

                PageParam: {
                    in: "query",
                    name: "page",

                    required: false,

                    schema: {
                        type: "integer"
                    },

                    description: "Página da listagem"
                },

                LimitParam: {
                    in: "query",
                    name: "limit",

                    required: false,

                    schema: {
                        type: "integer"
                    },

                    description: "Limite de itens por página"
                },

                SearchParam: {
                    in: "query",
                    name: "search",

                    required: false,

                    schema: {
                        type: "string"
                    },

                    description: "Buscar por texto"
                }

            },

            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            },
        },

        security: [
            {
                bearerAuth: []
            }
        ]
    },

    apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;