// Author: Anthony Schultz
// Date: 4/28/23
// Description: This file defines the controller functions for user authentication and authorization
// in the application. The functions handle user signup, login, logout, and access protection.
// The controller functions interact with the User model to perform the necessary database operations
// and use JWT tokens for authentication. Additionally, the file includes utility functions for
// checking if a user is logged in and verifying user permissions.


const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const AppError = require('./../utilities/appError');
const util = require('util');
const express = require('express');
const alert = require('alert')
const bcrypt = require('bcrypt');

require('util.promisify').shim();

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
};

exports.signup = async (req, res, next) => {
  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email: req.body.email }).exec();
    if (existingUser) {
      // If the email already exists, return an error response
      return res.status(400).json({
        status: 'fail',
        message: 'Email address is already in use'
      });
    }

    // Hash the password before storing it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // If the email does not exist, create a new user with the hashed password
    const newUser = await User.create({ ...req.body, password: hashedPassword });

    // Send a success response
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser
      }
    });
  } catch (error) {
    // Handle any errors that occur during the signup process
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during the signup process'
    });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  const user = await User.findOne({ email }).select('+password');

  // Verify the password by comparing it with the hashed password in the database
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  createSendToken(user, 200, res);
  req.session.email = user.email;
  req.session.name = user.name;
  req.session.userId = user._id;
  req.session.role = user.role; // Store the user's role in the session
  res.redirect('/');
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  const decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;
  next();

  res.status(201).json({
    status: 'success',
    token,
    data: {
      currentUser
    }
  });
};

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

