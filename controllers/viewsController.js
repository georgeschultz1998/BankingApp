
// Author: Anthony Schultz
// Date: 4/28/23
// Description: This file defines the controller functions for various routes in the application.
// The functions handle rendering views, retrieving user and loan data, and performing user
// authentication-related actions such as login and logout. The controller functions interact
// with the User and Loan models and make API calls as needed.


const User = require('./../models/userModel');
const axios = require('axios');

exports.home = async (req, res) => {
  try {
    if (req.session.userId) {
      // Use await to execute the query
      const user = await User.findById(req.session.userId).exec();
      if (user) {
        req.session.name = user.name;
        return res.render('overview', {
          title: 'Over View',
          name: user.name,
          role: user.role // Pass the user's role to the template
        });
      } else {
        return res.status(200).render('overview', { title: 'Over View' });
      }
    } else {
      res.status(200).render('overview', { title: 'Over View' });
    }
  } catch (error) {
    // Handle any errors that occur during query execution
    console.error(error);
    res.status(500).send('An error occurred while retrieving user data');
  }
};



exports.getMyLoan = async (req, res) => {
  const query = await axios.get('http://localhost:3000/api/v1/loans/My', { params: { name: req.session.name } });
  const user = await User.findById(req.session.userId).exec(); // Retrieve user data
  res.status(200).render('myLoanLists', {
    title: `Get Loan Lists`,
    loans: query.data.loans,
    name: req.session.name,
    role: user.role // Pass the user's role to the template
  });
};


exports.getAllLoan = async (req, res) => {
  const query = await axios.get('http://localhost:3000/api/v1/loans/');
  const user = await User.findById(req.session.userId).exec(); // Retrieve user data
  res.status(200).render('allLoans', {
    title: `Get Loan Lists`,
    loans: query.data.loans,
    name: req.session.name,
    role: user.role // Pass the user's role to the template
  });
};

exports.getAllUser = async (req, res) => {
  const query = await axios.get('http://localhost:3000/api/v1/users/');
  const user = await User.findById(req.session.userId).exec(); // Retrieve user data
  res.status(200).render('allUsers', {
    title: `Get User Lists`,
    users: query.data.users,
    name: req.session.name,
    role: user.role // Pass the user's role to the template
  });
};

exports.getSignInForm = async (req, res) => {
  res.status(200).render('newUser', {
    title: 'Sign in New User'
  });
};

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.CreateNewLoan = async (req, res) => {
  try {
    // Retrieve user data
    const user = await User.findById(req.session.userId).exec();

    // Render the template and pass the user's name and role
    res.status(200).render('newLoan', {
      title: 'Create New Loan',
      name: user.name,
      role: user.role // Pass the user's role to the template
    });
  } catch (err) {
    res.status(500).send('An error occurred while retrieving user data');
  }
};


exports.logout = (req, res) => {
  if (req.session) {
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
};
