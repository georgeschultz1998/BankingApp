// Author: Anthony Schultz
// Date: 4/28/23
// Description: This file defines the AppError class, which extends the built-in Error class.
// AppError is a custom error class that can be used to handle application-specific errors.
// It includes additional properties such as statusCode, status, isOperational, and errorCode.

class AppError extends Error {
  constructor(message, statusCode, errorCode) {
    super(message); // Call the parent class (Error) constructor with the provided message

    // Set the HTTP status code for the error
    this.statusCode = statusCode;
    // Determine the status based on the statusCode (4xx is 'fail', others are 'error')
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    // Indicate that this is an operational error (as opposed to a programming error)
    this.isOperational = true;
    // Set an optional error code (useful for categorizing errors)
    this.errorCode = errorCode;

    // Capture the stack trace, excluding the constructor call from the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

// Export the AppError class to be used in other parts of the application
module.exports = AppError;
