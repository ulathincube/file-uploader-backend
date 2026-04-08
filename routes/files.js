import { Router } from 'express'
import { postFile, getAllFiles } from '../controllers/files.js'

const router = Router()

router.post('/', postFile)

router.get('/', getAllFiles)

export default router
