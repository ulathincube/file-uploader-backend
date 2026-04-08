import multer from 'multer'
import { extname } from 'node:path'

const storage = multer.diskStorage({
  destination: 'temp/',
  filename: (req, file, callback) => {
    const savedName = `${file.fieldname}-${Date.now()}${extname(file.originalname)}`
    callback(null, savedName)
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: 1000000,
  },
}).single('file')

export default upload
