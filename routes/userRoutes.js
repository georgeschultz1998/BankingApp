// Author: Anthony Schultz
// Date: 4/28/23
// Description: This file defines the routes for user-related operations in the application.
// It includes routes for user login, signup, logout, getting all users, creating a user,
// getting a specific user, updating a user, and deleting a user.

const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

// Define routes for user authentication
router.post('/login', authController.login); // POST route for user login
router.post('/signup', authController.signup); // POST route for user signup
router.get('/logout', authController.logout); // GET route for user logout

// Define routes for the root path ("/") of the user resource
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

// Define routes for a specific user, identified by their ID ("/:id")
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

// Export the router to be used in other parts of the application
module.exports = router;
