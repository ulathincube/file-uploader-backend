import app from './app.js'
import { PORT } from './config/constants.js'

app.listen(PORT, (error) => {
  if (error) throw error
  console.log('**Server is running!**')
})
