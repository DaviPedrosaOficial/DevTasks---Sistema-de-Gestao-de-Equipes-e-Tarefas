const request = require("supertest");
const app = require("../src/app");

async function createAuthenticatedUser() {

    const uniqueEmail = `Luis${Date.now()}@email.com`;

    await request(app)

        .post("/users/register")

        .send({
            name: "Luis Otávio",
            email: uniqueEmail,
            password: "12345678"
        });
    
    const loginResponse = await request(app)
    
        .post("/users/login")

        .send({
            email: uniqueEmail,
            password: "12345678"
        });

    return {
        token: loginResponse.body.data.token
    }
}

async function createAuthenticatedProject() {

    const { token } = await createAuthenticatedUser();

    const projectsResponse = await request(app)

        .post("/projects")

        .set("Authorization", `Bearer ${token}`)

        .send({
            name: "Projeto de teste",
            description: "Projeto para que será utilizado nos testes da task."
        });

    return {
        token,
        projectId: projectsResponse.body.data.id
    }
}

async function createProjectWithTasks(
    tasksData = []
) {

    const { token, projectId } =
        await createAuthenticatedProject();

    const defaultTasks = [

        {
            title: "Task 1",
            description: "1ª task",
            status: "pending"
        },

        {
            title: "Task 2",
            description: "2ª task",
            status: "done"
        }
    ];

    const tasksToCreate = tasksData.length > 0 ? tasksData : defaultTasks;

    const createdTasks = await Promise.all(

        tasksToCreate.map(task =>

            request(app)

                .post("/tasks")

                .set(
                    "Authorization",
                    `Bearer ${token}`
                )

                .send({
                    ...task,
                    projectId
                })
        )
    );

    return {

        token,
        projectId,
        tasks: createdTasks.map( task => task.body.data )
    };
}

describe("Task Routes", () => {

    describe("Create Task", () => {

        it("deve criar uma task autenticada com sucesso", async () => {

            const { token, projectId } = await createAuthenticatedProject();

            const response = await request(app)

                .post("/tasks")

                .set("Authorization", `Bearer ${token}`)

                .send({
                    title: "Task para testes",
                    description: "Descrição da task",
                    projectId
                })

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Tarefa criada com sucesso.");
            expect(response.body.data.title).toBe("Task para testes");
            expect(response.body.data.description).toBe("Descrição da task");
            expect(response.body.data.status).toBe("pending");
            expect(response.body.data.projectId).toBe(projectId);
            expect(response.body.data).toHaveProperty("id")
        });

        it("não deve permitir criar task sem autenticação", async () => {

            const { projectId } = await createAuthenticatedProject();

            const response = await request(app)

                .post("/tasks")

                .send({
                    title: "Task para testes",
                    description: "Descrição da task",
                    projectId
                })

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Token de autenticação não fornecido.")
        });

        it("não deve permitir criar task sem fornecer o projectId", async () => {

            const { token } = await createAuthenticatedUser();

            const response = await request(app)

                .post("/tasks")

                .set("Authorization", `Bearer ${token}`)

                .send({
                    title: "Task para testes",
                    description: "Descrição da task"
                })

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Erro de validação dos dados");
            expect(response.body.errors[0].field).toBe("projectId")
        });

        it("não deve permitir criar task no projeto de outro usuário", async () => {

            const { token, projectId } = await createAuthenticatedProject();

            const { token: anotherUserToken } = await createAuthenticatedUser();

            const response = await request(app)

                .post("/tasks")

                .set("Authorization", `Bearer ${anotherUserToken}`)

                .send({
                    title: "Tentativa inválida",
                    description: "Outro usuário",
                    projectId
                });

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Projeto não encontrado.")
        });

        it("não deve permitir criar task em um projeto inexistente", async () => {

            const { token } = await createAuthenticatedUser();

            const response = await request(app)

                .post("/tasks")

                .set("Authorization", `Bearer ${token}`)

                .send({
                    title: "Task sem projectId",
                    description: "Tentando criar task sem fornecer o projectId",
                    projectId: 1234898
                })

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Projeto não encontrado.")
        });

        it("não deve permitir criar task com token inválido", async () => {

            const { projectId } = await createAuthenticatedProject();

            const response = await request(app)

                .post("/tasks")

                .set("Authorization", "Bearer token_inválido")

                .send({
                    title: "Token inválido",
                    description: "Teste de criação de task com token inválido",
                    projectId
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Token de autenticação inválido.")

        });

        it("não deve permitir criar task sem title", async () => {

            const { token, projectId } = await createAuthenticatedProject();

            const response = await request(app)

                .post("/tasks")

                .set("Authorization", `Bearer ${token}`)

                .send({
                    description: "Tentativa de criar task sem title",
                    projectId
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Erro de validação dos dados")
        });
    });

    describe("List Tasks By Project", () => {

        it("deve listar tasks de um projeto", async () => {

            const { token, projectId, tasks } = await createProjectWithTasks();

            const response = await request(app)

                .get(`/tasks/project/${projectId}`)

                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data.tasks)).toBe(true);
            expect(response.body.data.tasks.length).toBe(2);
            expect(response.body.data.tasks[0]).toHaveProperty("id");
            expect(response.body.data.tasks[0].projectId).toBe(projectId);

            const titles = response.body.data.tasks.map( task => task.title );

            expect(titles).toContain("Task 1");
            expect(titles).toContain("Task 2");
        });

        it("deve retornar lista vazia quando o projeto não possuir tasks", async () => {

            const { token, projectId } = await createAuthenticatedProject();

            const response = await request(app)

                .get(`/tasks/project/${projectId}`)

                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data.tasks)).toBe(true);
            expect(response.body.data.tasks.length).toBe(0);
        });

        it("deve filtrar tasks por status", async () => {
            
            const { token, projectId, tasks } = await createProjectWithTasks([
                {
                    title: "Task Pending",
                    description: "Task pendente",
                    status: "pending"
                },
                {
                    title: "Task Done",
                    description: "Task concluída",
                    status: "done"
                }
            ]);

            const response = await request(app)

            .get(`/tasks/project/${projectId}?status=pending`)

            .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.tasks.length).toBe(1);
            expect(response.body.data.tasks[0].status).toBe("pending");
            expect(response.body.data.tasks[0].title).toBe("Task Pending");
        });

        it("deve buscar tasks pelo título", async () => {

            const { token, projectId } = await createProjectWithTasks([

                    {
                        title: "Estudar React",
                        description: "Hooks e componentes"
                    },

                    {
                        title: "Estudar Node",
                        description: "Express e Prisma"
                    },

                    {
                        title: "Banco de dados",
                        description: "MySQL"
                    }

                ]);

            const response = await request(app)

                .get(`/tasks/project/${projectId}?search=React`)

                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.tasks.length).toBe(1);
            expect(response.body.data.tasks[0].title).toBe("Estudar React");
        });

        it("deve paginar tasks corretamente", async () => {

            const { token, projectId } = await createProjectWithTasks([

                    { title: "Task 1" },
                    { title: "Task 2" },
                    { title: "Task 3" },
                    { title: "Task 4" },
                    { title: "Task 5" }

                ]);

            const response = await request(app)

                .get(`/tasks/project/${projectId}?page=2&limit=2`)

                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.tasks.length).toBe(2);
            expect(response.body.data.meta.total).toBe(5);
            expect(response.body.data.meta.page).toBe(2);
            expect(response.body.data.meta.limit).toBe(2);
            expect(response.body.data.meta.totalPages).toBe(3);

        });

        it("deve ordenar tasks por título em ordem crescente", async () => {

            const { token, projectId } = await createProjectWithTasks([

                    { title: "Zebra" },
                    { title: "Banana" },
                    { title: "Abacaxi" }

                ]);

            const response = await request(app)

                .get(`/tasks/project/${projectId}?orderBy=title&order=asc`)

                .set( "Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);

            const titles = response.body.data.tasks.map( task => task.title );
            expect(titles).toEqual([ "Abacaxi", "Banana", "Zebra" ]);

        });

        it("não deve permitir listar tasks de projeto de outro usuário", async () => {

            const { projectId } = await createProjectWithTasks();

            const { token: anotherUserToken } = await createAuthenticatedUser();

            const response = await request(app)

                .get(`/tasks/project/${projectId}`)

                .set("Authorization", `Bearer ${anotherUserToken}`);

                expect(response.status).toBe(404);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Projeto não encontrado.")
        });
    });

    describe("List All Tasks", () => {

        it("deve listar todas as tasks do usuário autenticado", async () => {

            const { token, projectId } = await createAuthenticatedProject();

            await request(app)

                .post("/tasks")

                .set("Authorization", `Bearer ${token}`)

                .send({
                    title: "Task 1",
                    description: "Primeira task",
                    projectId
                });

            await request(app)

                .post("/tasks")

                .set("Authorization", `Bearer ${token}`)

                .send({
                    title: "Task 2",
                    description: "Segunda task",
                    projectId
                });

            const response = await request(app)

                .get("/tasks")

                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBe(2);
            expect(response.body.data[0]).toHaveProperty("id");

            const titles = response.body.data.map(
                task => task.title
            );

            expect(titles).toContain("Task 1");
            expect(titles).toContain("Task 2");
        });

        it("deve retornar lista vazia quando o usuário não possuir tasks", async () => {

            const { token } = await createAuthenticatedUser();

            const response = await request(app)

                .get("/tasks")

                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBe(0);
        });

        it("não deve permitir listar tasks sem autenticação", async () => {

            const response = await request(app)

                .get("/tasks");

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Token de autenticação não fornecido.");
        });

        it("não deve permitir listar tasks com token inválido", async () => {

            const response = await request(app)

                .get("/tasks")

                .set(
                    "Authorization",
                    "Bearer token_inválido"
                );

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Token de autenticação inválido.");
        });

    });

    describe("Get Stats", () => {

        it("deve retornar as estatísticas das tasks do projeto", async () => {

            const { token, projectId } = await createProjectWithTasks([
                {
                    title: "Task 1",
                    status: "pending"
                },
                {
                    title: "Task 2",
                    status: "pending"
                },
                {
                    title: "Task 3",
                    status: "in_progress"
                },
                {
                    title: "Task 4",
                    status: "done"
                }
            ]);

            const response = await request(app)

                .get(`/tasks/stats/project/${projectId}`)

                .set("Authorization", `Bearer ${token}`);

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data.total).toBe(4);
                expect(response.body.data.pending).toBe(2);
                expect(response.body.data.in_progress).toBe(1);
                expect(response.body.data.done).toBe(1);
        });

        it("não deve permitir buscar estatísticas sem autenticação", async () => {

            const { projectId } = await createProjectWithTasks();

            const response = await request(app)
            
                .get(`/tasks/stats/project/${projectId}`);

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Token de autenticação não fornecido.")
        });

        it("não deve permitir buscar estatísticas com token inválido", async () => {

            const { projectId } = await createProjectWithTasks();
        
            const response = await request(app)

                .get(`/tasks/stats/project/${projectId}`)

                .set("Authorization", "Bearer token_inválido");

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Token de autenticação inválido.")
        });

        it("não deve permitir acessar estatísticas de projeto de outro usuário", async () => {

            const { projectId } = await createProjectWithTasks();

            const { token: anotherUserToken } = await createAuthenticatedUser();

            const response = await request(app)

                .get(`/tasks/stats/project/${projectId}`)

                .set("Authorization", `Bearer ${anotherUserToken}`);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Projeto não encontrado.")


        });

        it("não deve permitir buscar estatísticas com projectId inválido", async () => {

            const { token } = await createAuthenticatedUser();

            const response = await request(app)

                .get(`/tasks/stats/project/abc`)

                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Erro de validação dos dados");
        });

        it("não deve permitir buscar estatísticas de projeto inexistente", async () => {

            const { token } = await createAuthenticatedUser();

            const response = await request(app)

                .get(`/tasks/stats/project/99999`)

                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Projeto não encontrado.")
        });
    });

    describe("Update Status", () => {

        it("deve atualizar o status da task com sucesso", async () => {

            const { token, tasks } = await createProjectWithTasks([
                {
                    title: "Task que terá status alterado",
                    status: "pending"
                }
            ]);

            const taskId = tasks[0].id

            const response = await request(app)

                .patch(`/tasks/${taskId}/status`)

                .set("Authorization", `Bearer ${token}`)

                .send({
                    status: "in_progress"
                });
            
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Status da tarefa atualizado com sucesso.")
            expect(response.body.data.status).toBe("in_progress");
            expect(response.body.data.id).toBe(taskId);
        });

        it("não deve permitir atualizar status sem autenticação", async () => {

            const { tasks } = await createProjectWithTasks([
                {
                    title: "Tentativa de alterar status de task sem autenticação",
                    status: "pending"
                }
            ]);

            const taskId = tasks[0].id;

            const response = await request(app)

                .patch(`/tasks/${taskId}/status`);

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Token de autenticação não fornecido.")
        });

        it("não deve permitir atualizar status com token inválido", async () => {

            const { tasks } = await createProjectWithTasks([
                {
                    title: "Tentativa de alterar status de task sem autenticação",
                    status: "pending"
                }
            ]);

            const taskId = tasks[0].id;

            const response = await request(app)

                .patch(`/tasks/${taskId}/status`)

                .set("Authorization", "Bearer token_inválido");

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Token de autenticação inválido.")
        });

        it("não deve permitir atualizar task com status inválido", async () => {

            const { token, tasks } = await createProjectWithTasks([
                {
                    title: "Task teste",
                    status: "pending"
                }
            ]);

            const taskId = tasks[0].id;

            const response = await request(app)

                .patch(`/tasks/${taskId}/status`)

                .set("Authorization", `Bearer ${token}`)

                .send({
                    status: "inválido"
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Erro de validação dos dados");
            expect(response.body.errors[0].field).toBe("status");
        });

        it("não deve permitir atualizar status de task de outro usuário", async () => {

            const { tasks } = await createProjectWithTasks();

            const taskId = tasks[0].id;

            const { token: anotherUserToken } = await createAuthenticatedUser();

            const response = await request(app)

                .patch(`/tasks/${taskId}/status`)

                .set("Authorization", `Bearer ${anotherUserToken}`)

                .send({
                    status: "done"
                });

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Tarefa não encontrada.")
        });

        it("não deve permitir atualizar status de task inexistente", async () => {

            const { token } = await createAuthenticatedUser();

            const response = await request(app)

                .patch("/tasks/9999/status")

                .set("Authorization", `Bearer ${token}`)

                .send({
                    status: "done"
                });

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Tarefa não encontrada.");
        });

        it("não deve permitir atualizar status com id inválido", async () => {

            const { token } = await createAuthenticatedUser();

            const response = await request(app)

                .patch("/tasks/invalido/status")

                .set("Authorization", `Bearer ${token}`)

                .send({
                    status: "done"
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Erro de validação dos dados");
            expect(response.body.errors[0].field).toBe("id");
        });

        it("não deve permitir atualizar status sem fornecer status", async () => {

            const { token, tasks } = await createProjectWithTasks();

            const taskId = tasks[0].id;

            const response = await request(app)

                .patch(`/tasks/${taskId}/status`)

                .set("Authorization", `Bearer ${token}`)

                .send({});

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Erro de validação dos dados");
            expect(response.body.errors[0].field).toBe("status");
        });
    });

    describe("Update Task", () => {

        it("deve atualizar uma task com sucesso", async () => {

            const { token, tasks } = await createProjectWithTasks([
                {
                    title: "Task antiga",
                    description: "Descrição antiga",
                    priority: "low"
                }
            ]);

            const taskId = tasks[0].id;

            const response = await request(app)

                .put(`/tasks/${taskId}`)

                .set("Authorization", `Bearer ${token}`)

                .send({
                    title: "Novo título",
                    description: "Nova descrição",
                    priority: "medium"
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Tarefa atualizada com sucesso.");
            expect(response.body.data.title).toBe("Novo título");
            expect(response.body.data.description).toBe("Nova descrição");
            expect(response.body.data.priority).toBe("medium");
        });

        it("deve permitir atualizar apenas um campo da task", async () => {

            const { token, tasks } = await createProjectWithTasks([
                {
                    title: "Título original",
                    description: "Descrição original",
                    priority: "low"
                }
            ]);

            const taskId = tasks[0].id;

            const response = await request(app)

                .put(`/tasks/${taskId}`)

                .set("Authorization", `Bearer ${token}`)

                .send({
                    title: "Novo título"
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Tarefa atualizada com sucesso.");
            expect(response.body.data.title).toBe("Novo título");
            expect(response.body.data.description).toBe("Descrição original");
            expect(response.body.data.priority).toBe("low");
        });

        it("não deve permitir atualizar task sem fornecer campos", async () => {

            const { token, tasks } = await createProjectWithTasks();

            const taskId = tasks[0].id;

            const response = await request(app)

                .put(`/tasks/${taskId}`)

                .set("Authorization", `Bearer ${token}`)

                .send({});

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Erro de validação dos dados");
            expect(response.body.errors[0].message).toContain("Pelo menos um campo");
        });

        it("não deve permitir atualizar task sem autenticação", async () => {

            const { tasks } = await createProjectWithTasks();

            const taskId = tasks[0].id;

            const response = await request(app)

                .put(`/tasks/${taskId}`)

                .send({
                    title: "Task teste",
                    description: "Task para teste de update sem autenticação"
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Token de autenticação não fornecido.");
        });

         it("não deve permitir atualizar task com token inválido", async () => {

            const { tasks } = await createProjectWithTasks();

            const taskId = tasks[0].id;

            const response = await request(app)

                .put(`/tasks/${taskId}`)

                .set("Authorization", "Bearer token_inválido")

                .send({
                    title: "Task teste",
                    description: "Task para teste de update com token inválido"
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Token de autenticação inválido.");
        });

        it("não deve permitir atualizar task de outro usuário", async () => {

            const { tasks } = await createProjectWithTasks();

            const taskId = tasks[0].id;

            const { token: anotherUserToken } = await createAuthenticatedUser();

            const response = await request(app)

                .put(`/tasks/${taskId}`)

                .set("Authorization", `Bearer ${anotherUserToken}`)

                .send({
                    title: "Task teste",
                    description: "Task para testar se é permitido alterar tasks de outros usuários"
                });

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Tarefa não encontrada.");
        });

        it("não deve permitir atualizar task inexistente", async () => {

            const { token } = await createAuthenticatedUser();

            const response = await request(app)

                .put(`/tasks/99999`)

                .set("Authorization", `Bearer ${token}`)

                .send({
                    title: "Task teste"
                });

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Tarefa não encontrada.");
        });

        it("não deve permitir atualizar task com id inválido", async () => {

            const { token } = await createAuthenticatedUser();

            const response = await request(app)

                .put(`/tasks/invalido`)

                .set("Authorization", `Bearer ${token}`)

                .send({
                    title: "Task com id inválido"
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Erro de validação dos dados");
            expect(response.body.errors[0].field).toBe("id");
        });

        it("não deve permitir atualizar task com prioridade inválida", async () => {

            const { token, tasks } = await createProjectWithTasks([
                {
                    title: "Task teste"
                }
            ]);

            const taskId = tasks[0].id;

            const response = await request(app)

                .put(`/tasks/${taskId}`)

                .set("Authorization", `Bearer ${token}`)

                .send({
                    priority: "invalida"
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Erro de validação dos dados");
            expect(response.body.errors[0].field).toBe("priority");
        });

        it("não deve permitir atualizar task com título vazio", async () => {

            const { token, tasks } = await createProjectWithTasks();

            const tasksId = tasks[0].id;

            const response = await request(app)

                .put(`/tasks/${tasksId}`)

                .set("Authorization", `Bearer ${token}`)

                .send({
                    title: ""
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Erro de validação dos dados");
            expect(response.body.errors[0].field).toBe("title");
            expect(response.body.errors[0].message).toContain("O título da tarefa é obrigatório.");
        });

        it("não deve permitir atualizar task com descrição vazia", async () => {

            const { token, tasks } = await createProjectWithTasks();

            const tasksId = tasks[0].id;

            const response = await request(app)

                .put(`/tasks/${tasksId}`)

                .set("Authorization", `Bearer ${token}`)

                .send({
                    description: ""
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Erro de validação dos dados");
            expect(response.body.errors[0].field).toBe("description");
            expect(response.body.errors[0].message).toContain("A descrição para ser atualizada não pode estar vazia.");
        });
    });

    describe("Delete Task", () => {

        it("deve deletar a tarefa com sucesso", async () => {

            const { token, tasks } = await createProjectWithTasks();

            const taskId = tasks[0].id;

            const response = await request(app)

                .delete(`/tasks/${taskId}`)

                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Tarefa deletada com sucesso.");
        });

        it("não deve permitir deletar task sem autenticação", async () => {

            const { tasks } = await createProjectWithTasks([
                    {
                        title: "Task protegida"
                    }
                ]);

            const taskId = tasks[0].id;

            const response = await request(app)

                .delete(`/tasks/${taskId}`);

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Token de autenticação não fornecido.");
        });

        it("não deve permitir deletar task com token inválido", async () => {

            const { tasks } = await createProjectWithTasks([
                    {
                        title: "Task protegida"
                    }
                ]);

            const taskId = tasks[0].id;

            const response = await request(app)

                .delete(`/tasks/${taskId}`)

                .set("Authorization", "Bearer token_inválido");

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Token de autenticação inválido.");
        });

        it("não deve permitir deletar task de outro usuário", async () => {

            const { tasks } = await createProjectWithTasks([
                    {
                        title: "Task protegida"
                    }
                ]);

            const taskId = tasks[0].id;

            const { token: anotherUserToken } = await createAuthenticatedUser();

            const response = await request(app)

                .delete(`/tasks/${taskId}`)

                .set("Authorization", `Bearer ${anotherUserToken}`);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Tarefa não encontrada.");
        });

        it("não deve permitir deletar task inexistente", async () => {

            const { token } = await createAuthenticatedUser();

            const response = await request(app)

                .delete("/tasks/999999")

                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Tarefa não encontrada.");
        });

        it("não deve permitir deletar task com id inválido", async () => {

            const { token } = await createAuthenticatedUser();

            const response = await request(app)

                .delete("/tasks/abc")

                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Erro de validação dos dados");
            expect(response.body.errors[0].field).toBe("id");
        });

        it("não deve encontrar task após deletá-la", async () => {

            const { token, tasks } = await createProjectWithTasks([
                    {
                        title: "Task temporária"
                    }
                ]);

            const taskId = tasks[0].id;

            await request(app)

                .delete(`/tasks/${taskId}`)

                .set("Authorization", `Bearer ${token}`);

            const response = await request(app)

                .put(`/tasks/${taskId}`)

                .set("Authorization", `Bearer ${token}`)

                .send({
                    title: "Tentativa após delete"
                });

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Tarefa não encontrada.");
        });
    });
});
