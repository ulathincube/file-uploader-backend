import prisma from '../config/prisma.js'

class File {
  static async createNewFile(userId, filename, location) {
    try {
      const newFile = await prisma.file.create({
        data: {
          name: filename,
          location,
          uploader: {
            connect: {
              id: userId,
            },
          },
        },
      })

      return newFile
    } catch (error) {
      throw error
    }
  }

  static async getSingleFile(id) {
    try {
      const file = await prisma.file.findUnique({
        where: {
          id,
        },
        include: {
          uploader: true,
        },
      })

      return file
    } catch (error) {
      throw error
    }
  }
}

export default File
