import prisma from '../config/prisma.js'

class User {
  static async findUserById(id) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      })

      return user
    } catch (error) {
      throw error
    }
  }

  static async findUserByEmail(email) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      return user
    } catch (error) {
      throw error
    }
  }

  static async createUser(userData) {
    const { name, email, password } = userData
    try {
      const newUser = await prisma.user.create({
        data: {
          email,
          password,
          name,
        },
      })

      return newUser
    } catch (error) {
      throw error
    }
  }
}

export default User
