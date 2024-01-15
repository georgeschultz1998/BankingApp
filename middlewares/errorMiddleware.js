// Author: Anthony Schultz
// Date: 4/28/23
// Description: This file defines a generic error-handling middleware for the Express application.
// The middleware captures errors, logs the error details, and sends an appropriate error response
// to the client. Additional error details are included in the response if the application is in
// development mode.

// Generic error-handling middleware
exports.errorHandler = (err, req, res, next) => {
    // Set the status code and error message
    const statusCode = err.statusCode || 500;
    const message = err.message || 'An internal server error occurred';
  
    // Log the error details (optional)
    console.error(err);
  
    // Send the error response to the client
    res.status(statusCode).json({
      status: 'error',
      message: message,
      // Include additional error details if in development mode (optional)
      ...(process.env.NODE_ENV === 'development' ? { error: err } : {}),
    });
  };
  