const express = require('express');

const app = express();
const api = require('./api/v1');

app.use('/api/v1', api);
app.use('/api', api);

// Not route found middleware
app.use((req, res, next) => {
  res.status(404);
  res.json({
    message: 'Resource not found',
  });
});

// Erro middleware
app.use((err, req, res, next) => {
  const { message, statusCode = 500 } = err;
  res.status(statusCode);
  res.json({
    message,
  });
});

module.exports = app;
