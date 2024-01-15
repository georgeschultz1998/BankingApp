// Author: Anthony Schultz
// Date: 4/28/23
// Description: This file defines the controller functions for loan-related routes in the application.
// The functions handle retrieving all loans, retrieving loans specific to a user, getting a single
// loan by ID, creating a new loan, updating a loan by ID, and deleting a loan by ID. The controller
// functions interact with the Loan model to perform the necessary database operations. Additionally,
// the file includes a function to calculate the loan amount based on the loan details.


const Loan = require('../models/loanModel');
const APIFeatures = require('../utilities/dbAPI');
const alert =require('alert')

function Calculate(amount,interest,years) {
  const months = years*12;
  const interests = interest/12;
  const PV = Math.round((amount/(interests)) * (1-(1/((1+((interests)))**(months))))*100)/100;
  return PV
}

exports.getAllLoans =   async (req, res) => {
  try {
    const features = new APIFeatures(Loan.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const loans = await features.query;

    loans.forEach(function(item) {
      item.calculatedLoanAmount = (Calculate(item.Amount,item.interestRate,item.loanTermYears)).toString();
    })
    console.log(loans)
    res.status(200).json({
      status: 'success',
      results: loans.length,
      loans
    
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getMyLoans =   async (req, res) => {
  try {
    const features = new APIFeatures(Loan.find(), req.query)
      .filter(Loan => Loan.Name = req.query.name)
      .sort()
      .limitFields()
      .paginate();
    const loans = await features.query;

    loans.forEach(function(item) {
      item.calculatedLoanAmount = (Calculate(item.Amount,item.interestRate,item.loanTermYears)).toString();
    })
    res.status(200).json({
      status: 'success',
      results: loans.length,
      loans
    
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getloan = async (req, res) => {
  try {
    const loans = await Loan.find();

    res.status(200).json({
      status: 'success',
      results: loans.length,
      data: {
        loans
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
exports.createLoan = async  (req, res) => {
  try {
    const newLoan = await Loan.create(req.body);
    res.redirect('/')
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.updateLoan = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        loan
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.deleteLoan = async (req, res) => {
  try {
    await Loan.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};