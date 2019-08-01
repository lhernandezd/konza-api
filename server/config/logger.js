const { createLogger, format, transports } = require('winston');
const morgan = require('morgan');
const stripFinalNewline = require('strip-final-newline');

const logger = createLogger({
  format: format.simple(),
  transports: [new transports.Console()],
});

morgan.token('id', req => req.id);

const requestFormat = ':remote-addr [:date[clf]] :id ":method :url" :status';

const requests = morgan(requestFormat, {
  stream: {
    write: (message) => {
      const log = stripFinalNewline(message);
      logger.info(log);
    },
  },
});

logger.requests = requests;

module.exports = logger;
