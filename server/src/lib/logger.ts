import winston from 'winston';
const { combine, timestamp, printf, colorize, json } = winston.format;
const consoleFormat = printf(({ level, message, timestamp, ...meta }) => {
  const metaJson = Object.keys(meta).length ? JSON.stringify(meta) : '';
  return `${timestamp} [${level}] ${message} ${metaJson}`;
});
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(timestamp(), json()),
  transports: []
});
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({ format: combine(colorize(), timestamp({ format: 'HH:mm:ss' }), consoleFormat) }));
} else {
  logger.add(new winston.transports.Console({ format: combine(timestamp(), json()) }));
}
export { logger };
export default logger;
