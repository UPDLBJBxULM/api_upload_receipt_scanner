// src/utils/errorHandler.js

class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  const sendErrorDev = (err, req, res) => {
    // API
    res.status(err.statusCode).json({
      status: err.status,
      code: err.statusCode,
      message: err.message,
      stack: err.stack
    });
  };
  
  const sendErrorProd = (err, req, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        code: err.statusCode,
        message: err.message
      });
    } else {
      // Programming or other unknown error: don't leak error details
      console.error('ERROR 💥', err);
  
      res.status(500).json({
        status: 'error',
        code: 500,
        message: 'Something went very wrong!'
      });
    }
  };
  
  const globalErrorHandler = (err, req, res, next) => {
    // Set default values
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
  
    // Differentiate between development and production
    if (process.env.NODE_ENV === 'development') {
      sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
      let error = { ...err };
      error.message = err.message;
  
      // Tambahkan penanganan error spesifik di sini jika diperlukan
  
      sendErrorProd(error, req, res);
    }
  };
  
  module.exports = { AppError, globalErrorHandler };
  