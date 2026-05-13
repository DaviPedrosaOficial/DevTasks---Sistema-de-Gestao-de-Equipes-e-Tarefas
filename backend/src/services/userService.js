const prisma = require("../prisma/prisma");
const bcrypt = require("bcryptjs");

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
}

module.exports = new UserService();