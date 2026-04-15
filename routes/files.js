import { Router } from 'express'
import {
  postFile,
  getAllFiles,
  createNewFolder,
  getFilesFromCurrentFolder,
  postFileToCurrentFolder,
  getCurrentSingleFile,
  getAllFolders,
} from '../controllers/files.js'

const router = Router()

router.get('/folders/:folder', getFilesFromCurrentFolder)
router.post('/folders/:folder', postFileToCurrentFolder)

router.post('/folders', createNewFolder)
router.get('/folders', getAllFolders)

router.get('/file/:fileId', getCurrentSingleFile)

router.post('/', postFile)

router.get('/', getAllFiles)

export default router
