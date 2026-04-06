import express from 'express'
import errorHandler from './errors/errorHandler.js'
import notFound from './errors/notFound.js'
import indexRouter from './routes/index.js'
import authRouter from './routes/auth.js'
import './config/passport.js'
import session from 'express-session'
import { SESSION_SECRET } from './config/constants.js'
import passport from 'passport'
import cors from 'cors'

const app = express()

app.use(cors())

app.use(
  session({
    secret: SESSION_SECRET,
    rolling: true,
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 5,
    },
  }),
)

app.use(passport.session())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRouter)
app.use('/api/index', indexRouter)
app.use('/*splat', notFound)

app.use(errorHandler)

export default app
