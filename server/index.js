const express = require('express');
const requestId = require('express-request-id')();
const bodyParser = require('body-parser');
const HTTP_STATUS = require('http-status-codes');
const cors = require('cors');

const config = require('./config');
const logger = require('./config/logger');

const app = express();
const api = require('./api/v1');

// # Setup Middleware
app.use(
  cors({
    origin: config.server.origin,
    methods: ['HEAD', 'OPTIONS', 'GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Accept', 'Content-Type', 'Authorization'],
  }),
);
// Request Id
app.use(requestId);
// Log requests
app.use(logger.requests);

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

// Setup router and routes
app.use('/api/v1', api);
app.use('/api', api);

// Not route found middleware
app.use((req, res, next) => {
  const message = 'Route not found';
  const statusCode = HTTP_STATUS.NOT_FOUND;

  next({
    message,
    statusCode,
    level: 'info',
  });
});

// Error middleware
app.use((err, req, res, next) => {
  const { message, level = 'error', name } = err;
  let { statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR } = err;
  const logMessage = `${logger.header(req)} ${statusCode} ${message}`;

  // Validation Errors
  if (name === 'ValidationError') {
    statusCode = HTTP_STATUS.UNPROCESSABLE_ENTITY;
  }

  logger[level](logMessage);

  res.status(statusCode);
  res.json({
    error: true,
    message,
    statusCode,
  });
});

module.exports = app;
