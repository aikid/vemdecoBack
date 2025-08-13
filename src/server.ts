import server from './app'
import { env } from './.env'

const PORT = Number(env.PORT)

server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`)
})
