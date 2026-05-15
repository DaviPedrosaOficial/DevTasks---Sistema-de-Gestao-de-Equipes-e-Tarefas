const userService = require("../services/userService");
const ApiResponse = require("../utils/apiResponse");

class UserController {

  async register(req, res) {

    try {

      const { name, email, password } = req.body;

      const user = await userService.create({
        name,
        email,
        password
      });

      return res.status(201).json(ApiResponse.success(user, "Usuário registrado com sucesso."));

    } catch (error) {

      return res.status(400).json(ApiResponse.error(error.message));

    }

  }

  async login(req, res) {

    try {

        const { email, password } = req.body;

        const result = await userService.login({
            email,
            password
        });

        return res.json(ApiResponse.success(result, "Usuário logado com sucesso."));
    
    } catch (error) {

        return res.status(400).json(ApiResponse.error(error.message));

    }

  }
}

module.exports = new UserController();