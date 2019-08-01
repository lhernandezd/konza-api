const express = require('express');

const logger = require('./config/logger');

const app = express();
const api = require('./api/v1');

app.use('/api/v1', api);
app.use('/api', api);

// Not route found middleware
app.use((req, res, next) => {
  const message = 'Route not found';
  const statusCode = 404;

  logger.warn(message);

  res.status(statusCode);

  res.json({
    message,
  });
});

// Erro middleware
app.use((err, req, res, next) => {
  const { message, statusCode = 500 } = err;

  logger.error(message);

  res.status(statusCode);
  res.json({
    message,
  });
});

module.exports = app;
