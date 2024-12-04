import { app } from './app'
import { env } from './env'

app.listen(
  {
    host: env.HOST,
    port: env.PORT,
  },
  (error, address) => {
    if (error) {
      throw error
    }
    console.log(`Server is running on ${address}`)
  },
)
