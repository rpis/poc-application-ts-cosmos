const winston = require('winston');
const consoleTransport = new winston.transports.Console({
  level: 'debug',
  josn: false,
});
const myWinstonOptions = {
  transports: [consoleTransport],
};
const logger = new winston.createLogger(myWinstonOptions);

export { logger };
