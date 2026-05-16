const userService = require("../services/userService");
const ApiResponse = require("../utils/apiResponse");
const { registerSchema, loginSchema } = require("../validations/userValidation");

class UserController {

  async register(req, res, next) {

    try {

      registerSchema.parse(req.body);

      const { name, email, password } = req.body;

      const user = await userService.create({
        name,
        email,
        password
      });

      return res.status(201).json(ApiResponse.success(user, "Usuário registrado com sucesso."));

    } catch (error) {

      next(error);

    }

  }

  async login(req, res, next) {

    try {

      loginSchema.parse(req.body);

      const { email, password } = req.body;

      const result = await userService.login({
          email,
          password
      });

      return res.json(ApiResponse.success(result, "Usuário logado com sucesso."));
  
    } catch (error) {

      next(error);

    }

  }
}

module.exports = new UserController();