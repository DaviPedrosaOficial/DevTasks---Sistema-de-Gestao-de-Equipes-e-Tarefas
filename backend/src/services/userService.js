const prisma = require("../prisma/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../errors/AppError");

class UserService {
  
  async create({ name, email, password }) {

    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (userAlreadyExists) {
      throw new AppError("Usuário já existe.", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    return user;
  }

  async login ({ email, password }) {

    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (!user) {
      throw new AppError("Email ou senha inválidos.", 401);
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      throw new AppError("Email ou senha inválidos.", 401);
    }

    const token = jwt.sign(
      {
        id: user.id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    delete user.password;

    return {
      user,
      token
    };

  }
}

module.exports = new UserService();