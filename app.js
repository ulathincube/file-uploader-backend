import express from 'express'
import errorHandler from './errors/errorHandler'
import notFound from './errors/notFound'
import indexRouter from './routes/index'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/index', indexRouter)
app.use('/*splat', notFound)

app.use(errorHandler)

export default app
