import config from 'config'
import express from 'express'
import helmet from 'helmet'
import routes from './routes'
import connect from './utils/connect'
import logger from './utils/logger'

const port = config.get<number>('port')

const app = express()
app.use(helmet())
app.use(express.json())

app.listen(port, async () => {
    logger.info('listening on port ' + port)

    await connect()

    routes(app)
})
