import multer from 'multer'
import { extname } from 'node:path'

const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: {
    fileSize: 1000000,
  },
}).single('file')

export default upload
