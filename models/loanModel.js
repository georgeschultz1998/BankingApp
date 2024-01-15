// Author: Anthony Schultz
// Date: 4/28/23
// Description: This file defines the Loan model using a Mongoose schema. The Loan model
// includes fields such as loan type, name, loan number, amount, interest rate, loan term,
// start date, created date, modified date, deletion status, and calculated loan amount.


const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema(
  {
    loanType:{
        type: String,
        trim: true,
        enum: ['Home','Auto','Boat','Life'],
    },
    name: {
        type: String,
        trim: true
    },
    loanNumber: {
        type: Number
    },
    Amount: {
        type: Number
    },
    interestRate: {
        type: Number
    },
    loanTermYears: {
        type: Number
    },
    startDate: {
        type: String
    },
    CreatedDate: {
        type: Date,
        default: Date.now
    },
    ModifiedDate: {
        type: Date,
        default: Date.now
    },
    IsDeleted: {
        type: Boolean,
        default: false,
        select: true

    },
    calculatedLoanAmount: {
        type: Number
    },

});
const Loan = mongoose.model('loans', loanSchema);

module.exports = Loan;