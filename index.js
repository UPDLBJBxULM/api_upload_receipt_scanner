require('dotenv').config();
const express = require('express');
const fileRoutes = require('./src/routes/fileRoutes.js');
const { globalErrorHandler } = require('./src/utils/errorHandler.js');
const AppError = require('./src/utils/errorHandler.js').AppError;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk parsing JSON
app.use(express.json());

// Rute default
app.get('/', (req, res) => {
  res.json({ message: "API is Running" });
});

// Rute API
app.use('/api', fileRoutes);

// Handle 404 - Not Found
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// Middleware Penanganan Error
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access the API at http://localhost:${PORT}`);
  console.log(`Access the API endpoints at http://localhost:${PORT}/api`);
});