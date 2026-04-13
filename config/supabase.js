import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_TOKEN } from './constants.js'

const supabase = createClient(SUPABASE_URL, SUPABASE_TOKEN)

export default supabase
