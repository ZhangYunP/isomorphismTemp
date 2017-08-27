import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import moment from 'moment'
import getErrorInfo from './error-stack-info'
import logconfig from '../config/log-config'

let transportsArr = []
const lvsArr = ['emerg', 'alert', 'crit', 'error']
winston.setLevels(winston.config.syslog.levels)
// { emerg: 0, alert: 1, crit: 2, error: 3, warning: 4, notice: 5, info: 6, debug: 7 }
const dateFormat = () => moment().format('YYYY-MM-DD HH:MM:ss:SSS')

const allLoggerTransport = new DailyRotateFile({
  name: 'all-log',
  filename: logconfig.allLogger,
  level: 'info',
  prepend: true,
  timestamp: dateFormat,
  maxsize: 10 * 1024 * 1024,
  datePattern: 'yyyy-MM-dd-',
  json: false
})

const consoleTransport = new (winston.transports.Console)({
  colorize: true,
  handleExceptions: true,
  json: false,
  level: 'verbose',
  label: 'dev'
})

function errorLoggerTransport(level) {
  return new (winston.transports.File)({
    name: 'err-log',
    filename: logconfig.errLogger,
    level,
    json: false,
    handleExceptions: true,
    humanReadableUnhandleException: true,
    timestamp: dateFormat
  })
}

function createErrorTransports(lvs) {
  return lvs.map(level => errorLoggerTransport(level))
}

transportsArr = createErrorTransports(lvsArr)
transportsArr.concat([allLoggerTransport, consoleTransport])

let logger = new winston.Logger({
  transports: transportsArr
})

const originalerror = logger.error
logger.error = function (...args) {
  const { filePath, typeName, lineNumber, functionName } = getErrorInfo()
  originalerror.call(logger, args[0], { filePath, typeName, lineNumber, functionName })
}
