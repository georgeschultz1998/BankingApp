// Author: Anthony Schultz
// Date: 4/28/23
// Description: This file defines two authentication-related middlewares for the Express application.
// The first middleware, "requireAuth," checks if the user is authenticated before allowing access
// to protected routes. The second middleware, "requireRole," checks if the user has the specified
// role(s) before allowing access to role-restricted resources.


// Middleware to check if the user is authenticated
exports.requireAuth = (req, res, next) => {
    // Debugging statements to check the session and user ID
    console.log('Session:', req.session);
    console.log('User ID:', req.session.userId);
  
    // Existing logic for checking authentication
    if (req.session && req.session.userId) {
      next();
    } else {
      res.status(401).send('You must be logged in to access this page.');
    }
  };
  
  
  // Middleware to check if the user has the specified role
  exports.requireRole = (allowedRoles) => {
    return (req, res, next) => {
      if (req.user && allowedRoles.includes(req.user.role)) {
        // User has the required role, proceed to the next middleware or route handler
        next();
      } else {
        // User does not have the required role, return an error response
        res.status(403).send('You do not have permission to access this resource.');
      }
    };
  };
  