
// Author: Anthony Schultz
// Date: 4/28/23
// Description: This file defines the routes for the loan-related operations in the application.
// It includes routes for getting all loans, creating a loan, getting a specific loan,
// updating a loan, and deleting a loan.

const express = require('express');
const loanController = require('../controllers/loanController');
const router = express.Router();

router
  .route('/')
  .get(loanController.getAllLoans)
  .post(loanController.createLoan, function(req, res) {
    res.redirect('/');
  });

router
  .route('/my')
  .get(loanController.getMyLoans);

router
  .route('/:id')
  .get(loanController.getloan)
  .patch(loanController.updateLoan) // Add PATCH route for updating a loan
  .delete(loanController.deleteLoan); // Add DELETE route for deleting a loan

module.exports = router;
