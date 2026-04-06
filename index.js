import app from './app'
import { PORT } from './config/constants'

app.listen(PORT, (error) => {
  if (error) throw error
})
