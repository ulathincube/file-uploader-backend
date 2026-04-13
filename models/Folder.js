import prisma from '../config/prisma.js'

class Folder {
  static async getAllFolders() {
    try {
      const allFolders = await prisma.folder.findMany({
        include: {
          files: true,
        },
      })

      return allFolders
    } catch (error) {
      throw error
    }
  }

  static async getFolder(folderName) {
    console.log(folderName)
    try {
      const folder = await prisma.folder.findUnique({
        where: {
          name: folderName,
        },
        include: {
          files: true,
        },
      })

      return folder
    } catch (error) {
      throw error
    }
  }

  static async createNewFolder(folderName) {
    try {
      const newFolder = await prisma.folder.create({
        data: {
          name: folderName,
        },
      })

      return newFolder
    } catch (error) {
      throw error
    }
  }
}

export default Folder
