import {
  body,
  matchedData,
  validationResult,
  param,
  check,
} from 'express-validator'
import { readdir, mkdir } from 'fs/promises'
import { join, extname } from 'node:path'
import upload from '../config/multer.js'
import File from '../models/File.js'
import Folder from '../models/Folder.js'
import supabase from '../config/supabase.js'
import { decode } from 'base64-arraybuffer'

const __dirname = import.meta.dirname
const filesDir = join(__dirname, '../', 'temp')

const root = process.cwd()
const tempFolder = join(root, './temp')

const validateFile = check('file')
  .custom((value, { req }) => {
    if (!req.file) return false
    return true
  })
  .withMessage('Please upload a valid file')

const validateFolder = body('folder')
  .trim()
  .notEmpty()
  .withMessage('Please provide a folder name')

const validateFileId = param('fileId')
  .trim()
  .notEmpty()
  .withMessage('Please provide a fileId')

const validateDownload = param('url')
  .trim()
  .notEmpty()
  .withMessage('Please provide an image url')

async function postCurrentFile(req, res, next) {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) throw new Error('Please provide a valid file!')

    const {
      file: { originalname, size, buffer, mimetype },
      user: { id },
    } = req

    // const filebase64 = decode(buffer.toString('base64'))

    const { data, error } = await supabase.storage
      .from('file-uploader')
      .upload(`public/${originalname}`, buffer, {
        contentType: mimetype,
      })

    if (error) throw error

    const { data: uploadedFile, error: fetchError } = supabase.storage
      .from('file-uploader')
      .getPublicUrl(data.path)

    await File.createNewFile(
      id,
      originalname,
      size,
      uploadedFile.publicUrl,
      '/',
    )

    res.status(201).json({ message: 'File uploaded!' })

    // res.status(201).json({ message: 'File uploaded!' })
  } catch (error) {
    next(error)
  }
}

const postFile = [upload, validateFile, postCurrentFile]

async function createFolder(req, res, next) {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) throw new Error('Please provide a folder name')

    const { folder } = matchedData(req)

    await Folder.createNewFolder(folder)

    res.status(201).json({ message: 'Folder created!' })
  } catch (error) {
    throw error
  }
}

const createNewFolder = [validateFolder, createFolder]

async function getAllFiles(req, res, next) {
  try {
    const allFiles = await File.getAllFiles()

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

    const filesInFolder = await Folder.getFolder(folder)

    return res.status(200).json(filesInFolder)
  } catch (error) {
    if (error) throw error
  }
}

const getFilesFromCurrentFolder = [validateCurrentFolder, getFilesFromFolder]

async function postToCurrentFolder(req, res, next) {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty())
      throw new Error('Please provide a valid folder name!')

    const { folder } = matchedData(req)

    const {
      file: { originalname, size, buffer, mimetype },
      user: { id },
    } = req

    const { data, error } = await supabase.storage
      .from('file-uploader')
      .upload(`public/${folder}/${originalname}`, buffer, {
        contentType: mimetype,
      })

    if (error) throw error

    const { data: uploadedFile, error: fetchError } = supabase.storage
      .from('file-uploader')
      .getPublicUrl(data.path)

    if (fetchError) throw error

    console.log({ data, error, uploadedFile, fetchError, id })

    await File.createNewFile(
      id,
      originalname,
      size,
      uploadedFile.publicUrl,
      folder,
    )

    // upload(req, res, (error) => {
    //   if (error) return res.status(500).json({ error })

    //   if (!req.file)
    //     return res.status(400).json({ error: 'Please provide a file' })

    //   return res.status(201).json({ message: 'File uploaded!' })
    // })

    res.status(200).json({ message: 'File uploaded!' })
  } catch (error) {
    next(error)
  }
}

const postFileToCurrentFolder = [
  upload,
  validateFile,
  validateCurrentFolder,
  postToCurrentFolder,
]

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

// http://localhost:5000/api/files/file/:fileId/download
async function downloadFile(req, res, next) {
  console.log('server hit!!!!')
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) throw new Error('Failed to retrieve this file!')

    const { fileId } = matchedData(req)

    const { url } = await File.getSingleFile(parseInt(fileId))

    res.set('Content-Disposition', 'attachment').status(200).send(url)
  } catch (error) {
    next(error)
  }
}

const getCurrentSingleFile = [validateFileId, getSingleFile]

const downloadCurrentFile = [validateFileId, downloadFile]

// test

async function getAllFolders(req, res, next) {
  try {
    const allFolders = await Folder.getAllFolders()

    console.log(allFolders)

    res.status(200).json(allFolders)
  } catch (error) {
    next(error)
  }
}

export {
  postFile,
  getAllFiles,
  createNewFolder,
  getFilesFromCurrentFolder,
  postFileToCurrentFolder,
  getCurrentSingleFile,
  downloadCurrentFile,
  getAllFolders,
}
