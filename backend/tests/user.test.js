const request = require("supertest");
const app = require("../src/app");

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

});


