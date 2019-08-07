const express = require('express');
const requestId = require('express-request-id')();
const bodyParser = require('body-parser');

const logger = require('./config/logger');

const app = express();
const api = require('./api/v1');

// # Setup Middleware

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

// Request Id
app.use(requestId);

// Log requests
app.use(logger.requests);

app.use('/api/v1', api);
app.use('/api', api);

// Not route found middleware
app.use((req, res, next) => {
  const message = 'Route not found';
  const statusCode = 404;

  next({
    message,
    statusCode,
    level: 'info',
  });
});

// Error middleware
app.use((err, req, res, next) => {
  const { message, level = 'error', name } = err;
  let { statusCode = 500 } = err;
  const logMessage = `${logger.header(req)} ${statusCode} ${message}`;

  // Validation Errors
  if (name === 'ValidationError') {
    statusCode = 422;
  }

  logger[level](logMessage);

  res.status(statusCode);
  res.json({
    message,
  });
});

module.exports = app;
