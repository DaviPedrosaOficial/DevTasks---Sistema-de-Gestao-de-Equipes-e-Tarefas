const request = require("supertest");
const app = require("../src/app");

async function createAuthenticatedUser() {

    const uniqueEmail = `luisotavio${Date.now()}@email.com`;

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

describe("Project Routes", () => {

    describe("Create Project", () => {

        it("deve criar um projeto autenticado com sucesso", async () => {

            const { token } = await createAuthenticatedUser();

            const response = await request(app)

                .post("/projects")

                .set("Authorization", `Bearer ${token}`)

                .send({
                    name: "Projeto Teste",
                    description: "Descrição do projeto teste"
                });

                expect(response.status).toBe(201);
                expect(response.body.success).toBe(true);
                expect(response.body.data).toHaveProperty("id");
                expect(response.body.data.name).toBe("Projeto Teste");
                expect(response.body.data.description).toBe("Descrição do projeto teste");
        });

        it("deve retornar erro ao criar projeto sem autenticação", async () => {

            const response = await request(app)

                .post("/projects")

                .send({
                    name: "Projeto Teste",
                    description: "Descrição do projeto teste"
                });

                expect(response.status).toBe(401);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Token de autenticação não fornecido.");
        });

        it("deve retornar erro ao criar projeto com token inválido", async () => {

            const response = await request(app)

                .post("/projects")

                .set("Authorization", "Bearer token_invalido")

                .send({
                    name: "Projeto Teste",
                    description: "Descrição do projeto teste"
                });

                expect(response.status).toBe(401);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Token de autenticação inválido.");
        });

        it("deve retornar erro ao criar projeto com nome invalido", async () => {

            const { token } = await createAuthenticatedUser();

            const response = await request(app)

                .post("/projects")

                .set("Authorization", `Bearer ${token}`)

                .send({
                    name: "",
                    description: "Descrição do projeto teste"
                });

                expect(response.status).toBe(400);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Erro de validação dos dados");
                expect(response.body.errors[0].field).toBe("name");
            });
    });

    describe("Get Project By ID", () => {

        it("deve retornar um projeto existente por ID", async () => {

            const { token } = await createAuthenticatedUser();

            const createResponse = await request(app)

                .post("/projects")

                .set("Authorization", `Bearer ${token}`)

                .send({
                    name: "Projeto para Consulta",
                    description: "Descrição do projeto para consulta"
                });

            const projectId = createResponse.body.data.id;

            const response = await request(app)

                .get(`/projects/${projectId}`)

                .set("Authorization", `Bearer ${token}`);

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data).toHaveProperty("id");
                expect(response.body.data.name).toBe("Projeto para Consulta");
                expect(response.body.data.description).toBe("Descrição do projeto para consulta");
        });

        it("deve retornar erro ao consultar projeto sem autenticação", async () => {

            const response = await request(app)

                .get("/projects/1");

                expect(response.status).toBe(401);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Token de autenticação não fornecido.");
        });

        it("deve retornar erro ao consultar projeto com token inválido", async () => {
            
            const response = await request(app)

                .get("/projects/1")

                .set("Authorization", "Bearer token_invalido");

                expect(response.status).toBe(401);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Token de autenticação inválido.");
        });

        it("deve retornar erro ao consultar projeto com ID inválido", async () => {

            const { token } = await createAuthenticatedUser();

            const response = await request(app)

                .get("/projects/abc")

                .set("Authorization", `Bearer ${token}`);

                expect(response.status).toBe(400);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Erro de validação dos dados");
                expect(response.body.errors[0].field).toBe("id");
        });

        it("não deve permitir consultar projeto de outro usuário", async () => {

            const { token } = await createAuthenticatedUser();

            const createResponse = await request(app)

                .post("/projects")

                .set("Authorization", `Bearer ${token}`)

                .send({
                    name: "Projeto Privado",
                    description: "Projeto do usuário 1"
                });

            const projectId = createResponse.body.data.id;

            const { token: anotherUserToken } = await createAuthenticatedUser();

            const response = await request(app)

                .get(`/projects/${projectId}`)

                .set(
                    "Authorization",
                    `Bearer ${anotherUserToken}`
                );

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Projeto não encontrado.");

        });
    });

    describe("Get All Projects", () => {

        it("deve retornar a lista de projetos do usuário autenticado", async () => {

            const { token } = await createAuthenticatedUser();

            await request(app)

                .post("/projects")

                .set("Authorization", `Bearer ${token}`)

                .send({
                    name: "Projeto 1",
                    description: "Descrição do projeto 1"
                });

            await request(app)

                .post("/projects")

                .set("Authorization", `Bearer ${token}`)

                .send({
                    name: "Projeto 2",
                    description: "Descrição do projeto 2"
                });

            const response = await request(app)

                .get("/projects")

                .set("Authorization", `Bearer ${token}`);

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(Array.isArray(response.body.data)).toBe(true);
        });

        it("deve retornar erro ao listar projetos sem autenticação", async () => {

            const response = await request(app)

                .get("/projects");

                expect(response.status).toBe(401);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Token de autenticação não fornecido.");
        });

        it("deve retornar erro ao listar projetos com token inválido", async () => {

            const response = await request(app)

                .get("/projects")

                .set("Authorization", "Bearer token_invalido");

                expect(response.status).toBe(401);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Token de autenticação inválido.");
        });

        it("deve retornar lista vazia quando usuário não possuir projetos", async () => {

            const { token } = await createAuthenticatedUser();

            const response = await request(app)

                .get("/projects")

                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBe(0);
        });

        it("deve retornar erro ao consultar projeto inexistente", async () => {

            const { token } = await createAuthenticatedUser();

            const response = await request(app)

                .get("/projects/999999")

                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Projeto não encontrado.");
        });
    });



    describe("Update Project", () => {

        it("deve atualizar um projeto existente com sucesso", async () => {

            const { token } = await createAuthenticatedUser();

            const createResponse = await request(app)

                .post("/projects")

                .set("Authorization", `Bearer ${token}`)

                .send({
                    name: "Projeto para Atualização",
                    description: "Descrição do projeto para atualização"
                });

            const projectId = createResponse.body.data.id;

            const response = await request(app)

                .put(`/projects/${projectId}`)

                .set("Authorization", `Bearer ${token}`)

                .send({
                    name: "Projeto Atualizado",
                    description: "Descrição do projeto atualizada"
                });

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data).toHaveProperty("id");
                expect(response.body.data.name).toBe("Projeto Atualizado");
                expect(response.body.data.description).toBe("Descrição do projeto atualizada");
        });

        it("deve retornar erro ao atualizar projeto sem autenticação", async () => {

            const response = await request(app)

                .put("/projects/1")

                .send({
                    name: "Projeto Atualizado",
                    description: "Descrição do projeto atualizada"
                });

                expect(response.status).toBe(401);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Token de autenticação não fornecido.");
        });

        it("deve retornar erro ao atualizar projeto com token inválido", async () => {

            const response = await request(app)

                .put("/projects/1")

                .set("Authorization", "Bearer token_invalido")

                .send({
                    name: "Projeto Atualizado",
                    description: "Descrição do projeto atualizada"
                });

                expect(response.status).toBe(401);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Token de autenticação inválido.");
        });

        it("deve retornar erro ao atualizar projeto com ID inválido", async () => {

            const { token } = await createAuthenticatedUser();

            const response = await request(app)

                .put("/projects/abc")

                .set("Authorization", `Bearer ${token}`)

                .send({
                    name: "Projeto Atualizado",
                    description: "Descrição do projeto atualizada"
                });

                expect(response.status).toBe(400);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Erro de validação dos dados");
                expect(response.body.errors[0].field).toBe("id");
        });

        it("deve retornar erro ao atualizar projeto com nome invalido", async () => {

            const { token } = await createAuthenticatedUser();

            const createResponse = await request(app)

                .post("/projects")

                .set("Authorization", `Bearer ${token}`)

                .send({
                    name: "Projeto para Atualização",
                    description: "Descrição do projeto para atualização"
                });

            const projectId = createResponse.body.data.id;

            const response = await request(app)

                .put(`/projects/${projectId}`)

                .set("Authorization", `Bearer ${token}`)

                .send({
                    name: "",
                    description: "Descrição do projeto atualizada"
                });

                expect(response.status).toBe(400);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Erro de validação dos dados");
                expect(response.body.errors[0].field).toBe("name");
        });

        it("deve retornar erro ao tentar atualizar um projeto que não é do usuário", async () => {

            const { token } = await createAuthenticatedUser();

            const createdResponse = await request(app)

                .post("/projects")

                .set("Authorization", `Bearer ${token}`)

                .send({
                    name: "Projeto de um usuário",
                    description: "Projeto privado"
                });

            const projectId = createdResponse.body.data.id;

            const { token: anotherUserToken } = await createAuthenticatedUser();

            const response = await request(app)

                .put(`/projects/${projectId}`)

                .set(
                    "Authorization",
                    `Bearer ${anotherUserToken}`
                )

                .send({
                    name: "Tentativa inválida",
                    description: "Outro usuário"
                });

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Projeto não encontrado.");

        });
    });

    describe("Delete Project", () => {

        it("deve deletar um projeto existente com sucesso", async () => {

            const { token } = await createAuthenticatedUser();

            const createResponse = await request(app)

                .post("/projects")

                .set("Authorization", `Bearer ${token}`)

                .send({
                    name: "Projeto para Deleção",
                    description: "Descrição do projeto para deleção"
                });

            const projectId = createResponse.body.data.id;

            const response = await request(app)

                .delete(`/projects/${projectId}`)

                .set("Authorization", `Bearer ${token}`);

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(response.body.message).toBe("Projeto deletado com sucesso.");
        });

        it("deve retornar erro ao deletar projeto sem autenticação", async () => {

            const response = await request(app)

                .delete("/projects/1");

                expect(response.status).toBe(401);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Token de autenticação não fornecido.");
        });

        it("deve retornar erro ao deletar projeto com token inválido", async () => {

            const response = await request(app)

                .delete("/projects/1")

                .set("Authorization", "Bearer token_invalido");

                expect(response.status).toBe(401);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Token de autenticação inválido.");
        });

        it("deve retornar erro ao deletar projeto com ID inválido", async () => {

            const { token } = await createAuthenticatedUser();

            const response = await request(app)

                .delete("/projects/abc")

                .set("Authorization", `Bearer ${token}`);

                expect(response.status).toBe(400);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Erro de validação dos dados");
                expect(response.body.errors[0].field).toBe("id");
        });

        it("não deve permitir deletar projeto de outro usuário", async () => {

            const { token } =
                await createAuthenticatedUser();

            const createResponse = await request(app)

                .post("/projects")

                .set("Authorization", `Bearer ${token}`)

                .send({
                    name: "Projeto Privado",
                    description: "Projeto do usuário 1"
                });

            const projectId = createResponse.body.data.id;

            const { token: anotherUserToken } =
                await createAuthenticatedUser();

            const response = await request(app)

                .delete(`/projects/${projectId}`)

                .set(
                    "Authorization",
                    `Bearer ${anotherUserToken}`
                );

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Projeto não encontrado.");

        });

    });
});