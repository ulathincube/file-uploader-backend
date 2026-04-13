import 'dotenv/config'

const PORT = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL
const SESSION_SECRET = process.env.SESSION_SECRET
const SALTROUNDS = parseInt(process.env.SALTROUNDS)
const CLIENT_URL = process.env.CLIENT_URL
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_TOKEN = process.env.SUPABASE_TOKEN

export {
  PORT,
  DATABASE_URL,
  SALTROUNDS,
  SESSION_SECRET,
  CLIENT_URL,
  SUPABASE_TOKEN,
  SUPABASE_URL,
}
