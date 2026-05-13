const prisma = require("../prisma/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UserService {
  
  async create({ name, email, password }) {

    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (userAlreadyExists) {
      throw new Error("Usuário já existe.");
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
      throw new Error("Email ou senha inválidos.");
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      throw new Error("Email ou senha inválidos.");
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

    return {
      user,
      token
    };

  }
}

module.exports = new UserService();