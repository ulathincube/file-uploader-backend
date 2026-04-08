import { body, matchedData, validationResult } from 'express-validator'
import { readdir } from 'fs/promises'
import { join, extname } from 'node:path'
import upload from '../config/multer.js'

const __dirname = import.meta.dirname
const filesDir = join(__dirname, '../', 'uploads')

async function postFile(req, res, next) {
  try {
    upload(req, res, (error) => {
      if (error) return res.status(500).json({ error })

      if (!req.file)
        return res.status(400).json({ error: 'Please provide a file!' })

      console.log(req.file)
      return res.status(201).json({ message: 'File uploaded!' })
    })
    console.log('!!!does this execute!!!')
    // res.status(201).json({ message: 'File uploaded!' })
  } catch (error) {
    throw error
  }
}

async function getAllFiles(req, res, next) {
  try {
    const allFiles = await readdir(filesDir)
    const fileFormats = allFiles.map((fileObject) => extname(fileObject))
    res.status(200).json({ allFiles, fileFormats })
  } catch (error) {
    throw error
  }
}

export { postFile, getAllFiles }
