import logger from 'pino'
import dayjs from 'dayjs'

const AppLogger = logger({
    base: {
        pid: false
    },
    timestamp: () => `,"time":"${dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]')}"`,
    transport: {
        target: 'pino-pretty'
    }
})

export default AppLogger
