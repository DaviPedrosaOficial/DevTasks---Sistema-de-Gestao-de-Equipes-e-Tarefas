const request = require("supertest");
const app = require("../src/app");

async function createAuthenticatedUser() {

    const uniqueEmail =
        `luis${Date.now()}@email.com`;

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
        token: loginResponse.body.data.token,
        email: uniqueEmail
    };
}

describe("User Routes", () => {

    // Rotas de registro de usuário
    describe("Register Routes", () => {

        it("deve registrar um usuário com sucesso", async() => {

        const uniqueEmail = `luisotavio${Date.now()}@email.com`;
        
        const response = await request(app)

            .post("/users/register")

            .send({
                name: "Luis Otávio",
                email: uniqueEmail,
                password: "12345678"
            });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty("id");
            expect(response.body.data.email).toBe(uniqueEmail);
        });

        it("deve retornar erro ao tentar registrar email já existente", async () => {

            const email = `luisotavio${Date.now()}@email.com`;

            await request(app)

                .post("/users/register")

                .send({
                    name: "Luis Otávio",
                    email,
                    password: "12345678"
                });

            const response = await request(app)

                .post("/users/register")

                .send({
                    name: "Luis Otávio",
                    email,
                    password: "12345678"
                });

                expect(response.status).toBe(409);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Usuário já existe.");
        });

        it("deve retornar erro ao registrar email inválido", async () => {
            const response = await request(app)

                .post("/users/register")

                .send({
                    name: "Luis Otávio",
                    email: "luisotavio.com",
                    password: "12345678"
                });

                expect(response.status).toBe(400);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Erro de validação dos dados");
        });

        it("deve retornar erro ao tentar registrar senha muito curta", async () => {

            const response = await request(app)

                .post("/users/register")

                .send({
                    name: "Luis Otávio",
                    email: `luisotavio${Date.now()}@email.com`,
                    password: "123"
                });

                expect(response.status).toBe(400);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Erro de validação dos dados");
        });

        it("deve retornar erro ao tentar registrar sem nome", async () => {

            const response = await request(app)
                
                .post("/users/register")

                .send({
                    email: `luisotavio${Date.now()}@email.com`,
                    password: "12345678"
                });

                expect(response.status).toBe(400);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Erro de validação dos dados");
        });
    });

    // Rotas de login de usuário
    describe("Login Routes", () => {

        it("deve realizar o login com sucesso", async () => {

            const email = `luisotavio${Date.now()}@email.com`;

            await request(app)

                .post("/users/register")

                .send({
                    name: "Luis Otávio",
                    email,
                    password: "12345678"
                });

            const response = await request(app)

                .post("/users/login")

                .send({
                    email,
                    password: "12345678"
                });

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data).toHaveProperty("token");
                expect(typeof response.body.data.token).toBe("string");
                expect(response.body.data.user.email).toBe(email);
                expect(response.body.data.user.password).toBeUndefined();
        });

        it("deve retornar erro ao tentar fazer login com a senha inválida", async () => {

            const email = `luisotavio${Date.now()}@email.com`;

            await request(app)

                .post("/users/register")

                .send({
                    name: "Luis Otávio",
                    email,
                    password: "12345678"
                });

            const response = await request(app)

                .post("/users/login")

                .send({
                    email,
                    password: "senhaerrada"
                });

                expect(response.status).toBe(401);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Email ou senha inválidos.");
        });

        it("deve retornar erro ao tentar fazer login com email não registrado", async () => {

            const response = await request(app)

                .post("/users/login")

                .send({
                    email: "naoregistrado@email.com",
                    password: "12345678"
                });

                expect(response.status).toBe(401);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Email ou senha inválidos.");
        });

        it("deve retornar erro ao tentar fazer login com email inválido", async () => {

            const response = await request(app)

                .post("/users/login")

                .send({
                    email: "emailinvalido.com",
                    password: "12345678"
                });

                expect(response.status).toBe(400);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Erro de validação dos dados");
                expect(response.body.errors[0].field).toBe("email");
        });

        it("deve retornar erro ao tentar fazer login com senha muito curta", async () => {

            const response = await request(app)

                .post("/users/login")

                .send({
                    email: "luisotavio@example.com",
                    password: "123"
                });

                expect(response.status).toBe(400);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Erro de validação dos dados");
                expect(response.body.errors[0].field).toBe("password");
        });
    });

    describe("Profile Routes", () => {

        describe("Get Me Routes", () => {

            it("deve retornar o perfil do usuário autenticado", async () => {

                const { token, email } = await createAuthenticatedUser();

                const response = await request(app)

                    .get("/users/me")

                    .set(
                        "Authorization", `Bearer ${token}`
                    );

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data.email).toBe(email);
                expect(response.body.data.password).toBeUndefined();
            });

            it("não deve permitir acessar perfil sem autenticação", async () => {

                const response = await request(app)

                    .get("/users/me");

                expect(response.status).toBe(401);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Token de autenticação não fornecido.");
            });

            it("não deve permitir acessar perfil com token inválido", async () => {

                const response = await request(app)

                    .get("/users/me")

                    .set(
                        "Authorization", "Bearer token_inválido"
                    );

                expect(response.status).toBe(401);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Token de autenticação inválido.");
            });
        });

        describe("Update Me Routes", () => {

            it("deve atualizar perfil com sucesso", async () => {

                const { token } = await createAuthenticatedUser();

                const response = await request(app)

                    .patch("/users/me")

                    .set(
                        "Authorization", `Bearer ${token}`
                    )

                    .send({
                        name: "Novo Nome",
                        email: `novo${Date.now()}@email.com`
                    });

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(response.body.message).toBe("Perfil atualizado com sucesso.");
                expect(response.body.data.name).toBe("Novo Nome");
            });

            it("deve alterar senha com sucesso", async () => {

                const { token, email } = await createAuthenticatedUser();

                const response = await request(app)

                    .patch("/users/me/password")

                    .set(
                        "Authorization", `Bearer ${token}`
                    )

                    .send({
                        currentPassword: "12345678",
                        newPassword: "novasenha123"
                    });

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(response.body.message).toBe("Senha atualizada com sucesso.");

                const loginResponse = await request(app)

                    .post("/users/login")

                    .send({
                        email,
                        password: "novasenha123"
                    });

                expect(loginResponse.status).toBe(200);
                expect(loginResponse.body.success).toBe(true);
            });

            it("não deve permitir alterar senha com senha atual incorreta", async () => {

                const { token } = await createAuthenticatedUser();

                const response = await request(app)

                    .patch("/users/me/password")

                    .set(
                        "Authorization", `Bearer ${token}`
                    )

                    .send({
                        currentPassword: "senhaerrada",
                        newPassword: "novasenha123"
                    });

                expect(response.status).toBe(401);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Senha atual incorreta.");
            });

            it("não deve permitir atualizar perfil sem autenticação", async () => {

                const response = await request(app)

                    .patch("/users/me")

                    .send({
                        name: "Novo Nome"
                    });

                expect(response.status).toBe(401);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Token de autenticação não fornecido.");
            });

            it("não deve permitir atualizar perfil com token inválido", async () => {

                const response = await request(app)

                    .patch("/users/me")

                    .set(
                        "Authorization", "Bearer token_inválido"
                    )

                    .send({
                        name: "Novo Nome"
                    });

                expect(response.status).toBe(401);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Token de autenticação inválido.");
            });

            it("não deve permitir alterar senha sem autenticação", async () => {

                const response = await request(app)

                    .patch("/users/me/password")

                    .send({
                        currentPassword: "12345678",
                        newPassword: "novasenha123"
                    });

                expect(response.status).toBe(401);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Token de autenticação não fornecido.");
            });

            it("não deve permitir alterar senha com token inválido", async () => {

                const response = await request(app)

                    .patch("/users/me/password")

                    .set(
                        "Authorization", "Bearer token_inválido"
                    )

                    .send({
                        currentPassword: "12345678",
                        newPassword: "novasenha123"
                    });

                expect(response.status).toBe(401);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Token de autenticação inválido.");
            });
        });

        describe("Delete Me Routes", () => {

            it("deve deletar conta com sucesso", async () => {

                const { token, email } = await createAuthenticatedUser();

                const response = await request(app)

                    .delete("/users/me")

                    .set(
                        "Authorization",
                        `Bearer ${token}`
                    );

                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(response.body.message).toBe("Conta deletada com sucesso.");

                const loginResponse = await request(app)

                    .post("/users/login")

                    .send({
                        email,
                        password: "12345678"
                    });

                expect(loginResponse.status).toBe(401);
            });

            it("não deve permitir deletar conta sem autenticação", async () => {

                const response = await request(app)

                    .delete("/users/me");

                expect(response.status).toBe(401);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Token de autenticação não fornecido.");
            });

            it("não deve permitir deletar conta com token inválido", async () => {

                const response = await request(app)

                    .delete("/users/me")

                    .set(
                        "Authorization", "Bearer token_inválido"
                    );

                expect(response.status).toBe(401);
                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Token de autenticação inválido.");
            });
        });
    });
});


