const userService = require("../services/userService");

class UserController {

  async register(req, res) {

    try {

      const { name, email, password } = req.body;

      const user = await userService.create({
        name,
        email,
        password
      });

      return res.status(201).json(user);

    } catch (error) {

      return res.status(400).json({
        error: error.message
      });

    }

  }

  async login(req, res) {

    try {

        const { email, password } = req.body;

        const result = await userService.login({
            email,
            password
        });

        return res.json(result);
    
    } catch (error) {

        return res.status(400).json({
            error: error.message
        });

    }

  }
}

module.exports = new UserController();