import multer from 'multer'
import { extname } from 'node:path'

const createStorage = (location) =>
  multer.diskStorage({
    destination: (req, file, callback) => {
      if (req.folderName) {
        return callback(null, `temp/${req.folderName}`)
      }
      callback(null, 'temp/')
    },
    filename: (req, file, callback) => {
      const savedName = `${file.fieldname}-${Date.now()}${extname(file.originalname)}`
      callback(null, savedName)
    },
  })

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (req.folderName) {
      return callback(null, `temp/${req.folderName}`)
    }
    callback(null, 'temp/')
  },
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

// const callUpload = (location) => {
//   const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//       return callback(null, `temp/${location}`)
//     },
//     filename: (req, file, callback) => {
//       const savedName = `${file.fieldname}-${Date.now()}${extname(file.originalname)}`
//       callback(null, savedName)
//     },
//   })
// }

export default upload
