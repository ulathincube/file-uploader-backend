import { body, matchedData, validationResult, param } from 'express-validator'
import { readdir, mkdir } from 'fs/promises'
import { join, extname } from 'node:path'
import upload from '../config/multer.js'
import File from '../models/File.js'

const __dirname = import.meta.dirname
const filesDir = join(__dirname, '../', 'temp')

const root = process.cwd()
const tempFolder = join(root, './temp')

const validateFolder = body('folder')
  .trim()
  .notEmpty()
  .withMessage('Please provide a folder name')

const validateFileId = param('fileId')
  .trim()
  .notEmpty()
  .withMessage('Please provide a fileId')

async function postFile(req, res, next) {
  const uploaderId = req.user.id
  console.log(uploaderId)
  // body // param

  try {
    upload(req, res, async (error) => {
      if (error) return res.status(500).json({ error })

      if (!req.file)
        return res.status(400).json({ error: 'Please provide a file!' })

      console.log(req.file)

      await File.createNewFile(uploaderId, req.file.filename)

      return res.status(201).json({ message: 'File uploaded!' })
    })

    // res.status(201).json({ message: 'File uploaded!' })
  } catch (error) {
    throw error
  }
}

async function createFolder(req, res, next) {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) throw new Error('Please provide a folder name')

    const { folder } = matchedData(req)

    const newFolder = join(tempFolder, `./${folder}`)

    await mkdir(newFolder)
    res.status(201).json({ message: 'Created folder successfully' })
  } catch (error) {
    throw error
  }
}

const createNewFolder = [validateFolder, createFolder]

async function getAllFiles(req, res, next) {
  try {
    const allFiles = await readdir(filesDir)

    // console.log(allFiles)

    res.status(200).json(allFiles)
  } catch (error) {
    throw error
  }
}

const validateCurrentFolder = param('folder')
  .trim()
  .notEmpty()
  .withMessage('Please provide a folder name')

async function getFilesFromFolder(req, res, next) {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty())
      throw new Error('Please provide a valid folder name!')

    const { folder } = matchedData(req)

    const folderDirectory = join(filesDir, `./${folder}`)

    const allFiles = await readdir(folderDirectory)

    return res.status(200).json(allFiles)
  } catch (error) {
    if (error) throw error
  }
}

const getFilesFromCurrentFolder = [validateCurrentFolder, getFilesFromFolder]

async function postToCurrentFolder(req, res, next) {
  console.log('trying to post within folder')
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty())
      throw new Error('Please provide a valid folder name!')

    const { folder } = matchedData(req)

    console.log(folder)
    // const folderDirectory = join(filesDir, `./${folder}`)

    await File.createNewFile(req.user.id, req.file.filename, `/${folder}`)

    req.folderName = folder
    upload(req, res, (error) => {
      if (error) return res.status(500).json({ error })

      if (!req.file)
        return res.status(400).json({ error: 'Please provide a file' })

      return res.status(201).json({ message: 'File uploaded!' })
    })
  } catch (error) {
    if (error) throw error
  }
}

const postFileToCurrentFolder = [validateCurrentFolder, postToCurrentFolder]

async function getSingleFile(req, res, next) {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) throw new Error('Failed to retrieve this file!')

    const { fileId } = matchedData(req)
    const file = await File.getSingleFile(parseInt(fileId))

    return res.status(200).json(file)
  } catch (error) {
    next(error)
  }
}

async function downloadFile(req, res, next) {
  console.log('server router hit!')
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) throw new Error('Failed to retrieve this file!')

    const { fileId } = matchedData(req)
    const { name } = await File.getSingleFile(parseInt(fileId))

    const file = join(filesDir, name)

    // if (!file) throw new Error('This file does not exist!')

    res.status(200).download(file)
  } catch (error) {
    next(error)
  }
}

const getCurrentSingleFile = [validateFileId, getSingleFile]

const downloadCurrentFile = [validateFileId, downloadFile]

export {
  postFile,
  getAllFiles,
  createNewFolder,
  getFilesFromCurrentFolder,
  postFileToCurrentFolder,
  getCurrentSingleFile,
  downloadCurrentFile,
}
