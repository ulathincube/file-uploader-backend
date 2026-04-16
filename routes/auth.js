import { Router } from 'express'
import { loginUser, registerUser, logoutUser } from '../controllers/auth.js'

const router = Router()

router.post('/logout', logoutUser)

router.post('/login', loginUser)

router.post('/register', registerUser)

export default router
