import 'dotenv/config'

const PORT = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL
const SESSION_SECRET = process.env.SESSION_SECRET
const SALTROUNDS = parseInt(process.env.SALTROUNDS)

export { PORT, DATABASE_URL, SALTROUNDS, SESSION_SECRET }
