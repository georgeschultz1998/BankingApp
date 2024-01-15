// Author: Anthony Schultz
// Date: 4/28/23
// Description: This file defines the routes for rendering views in the application.
// It includes routes for the home page, signup, login, creating a new loan, viewing all loans,
// viewing a user's loans, viewing all users, and logging out. Some routes are protected
// and require authentication and/or specific user roles.

const express = require('express');
const viewsController = require('./../controllers/viewsController');
const loanController = require('../controllers/loanController');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware'); // Import the middleware functions

const router = express.Router();

// Home route
router.get('/', viewsController.home);

// Signup route
router.get('/signup', viewsController.getSignInForm);

// Login route
router.get('/login', viewsController.getLoginForm);

// Create New Loan route (protected, only authenticated users)
router.get('/newLoan', requireAuth, viewsController.CreateNewLoan);

// All Loans route (protected, only admin and staff)
router.get('/allloanlists', requireAuth, requireRole(['admin', 'staff']), viewsController.getAllLoan);

// My Loans route (protected, only authenticated users)
router.get('/myLoanLists', requireAuth, viewsController.getMyLoan);

// All Users route (protected, only admin)
router.get('/alluserlists', requireAuth, requireRole('admin'), viewsController.getAllUser);

// Logout route
router.get('/logout', viewsController.logout);

// Additional routes can be added here as needed

// Export the router to be used in other parts of the application
module.exports = router;
