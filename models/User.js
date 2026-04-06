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
}

export default User
