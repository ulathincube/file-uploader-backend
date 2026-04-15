import prisma from '../config/prisma.js'

class File {
  static async createNewFile(userId, originalname, size, url, folder) {
    try {
      const foundFolder = await prisma.folder.findUnique({
        where: {
          name: folder,
        },
      })

      if (foundFolder)
        return await prisma.file.create({
          data: {
            name: originalname,
            size,
            url,
            folderName: {
              connect: {
                id: foundFolder.id,
              },
            },
            uploader: {
              connect: {
                id: userId,
              },
            },
          },
          include: {
            uploader: true,
            folderName: true,
          },
        })
      else {
        return await prisma.file.create({
          data: {
            name: originalname,
            size,
            url,
            folderName: {
              create: {
                name: folder,
              },
            },
            uploader: {
              connect: {
                id: userId,
              },
            },
          },
          include: {
            uploader: true,
            folderName: true,
          },
        })
      }
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
          folderName: true,
        },
      })

      return file
    } catch (error) {
      throw error
    }
  }

  static async getAllFiles() {
    try {
      const allFiles = await prisma.file.findMany()

      return allFiles
    } catch (error) {
      throw error
    }
  }
}

export default File
