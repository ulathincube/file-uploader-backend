import express from 'express'
import errorHandler from './errors/errorHandler.js'
import notFound from './errors/notFound.js'
import indexRouter from './routes/index.js'
import authRouter from './routes/auth.js'
import filesRouter from './routes/files.js'
import './config/passport.js'
import session from 'express-session'
import { SESSION_SECRET } from './config/constants.js'
import passport from 'passport'
import cors from 'cors'
import 'dotenv/config'
import { PrismaSessionStore } from '@quixo3/prisma-session-store'
import prisma from './config/prisma.js'

const app = express()

app.use(cors())

const store = new PrismaSessionStore(prisma, {
  checkPeriod: 1000 * 60 * 3,
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
})

app.use(
  session({
    store,
    secret: SESSION_SECRET,
    rolling: true,
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 5,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
  }),
)

app.use(passport.session())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRouter)
app.use('/api/files', filesRouter)
app.use('/api/index', indexRouter)
app.use('/*splat', notFound)

app.use(errorHandler)

export default app
