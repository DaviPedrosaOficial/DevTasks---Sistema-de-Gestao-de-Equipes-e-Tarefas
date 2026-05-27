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

  async me(req, res, next) {

    try {

        const user = await userService.getProfile(req.userId);

        return res.json(
            ApiResponse.success(user)
        );

    } catch (error) {

        next(error);
    }
  }

  async update(req, res, next) {

    try {

        const { name, email } = req.body;

        const user = await userService.updateProfile(
            req.userId,
            {
                name,
                email
            }
        );

        return res.json(
            ApiResponse.success(
                user,
                "Perfil atualizado com sucesso."
            )
        );

    } catch (error) {

        next(error);
    }
  }

  async delete(req, res, next) {

    try {

        await userService.deleteProfile(req.userId);

        return res.json(
            ApiResponse.success(
                null,
                "Conta deletada com sucesso."
            )
        );

    } catch (error) {

        next(error);
    }
  }

  async updatePassword(req, res, next) {

    try {

        const {
            currentPassword,
            newPassword
        } = req.body;

        await userService.updatePassword(
            req.userId,
            {
                currentPassword,
                newPassword
            }
        );

        return res.json(
            ApiResponse.success(
                null,
                "Senha atualizada com sucesso."
            )
        );

    } catch (error) {

        next(error);
    }
  }
}

module.exports = new UserController();