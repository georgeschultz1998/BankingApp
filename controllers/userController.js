// Author: Anthony Schultz
// Date: 4/28/23
// Description: This file defines the controller functions for user-related routes in the application.
// The functions handle retrieving all users, creating a new user, getting a single user by ID,
// updating a user by ID, deleting a user by ID, and deactivating a user's account. The controller
// functions interact with the User model to perform the necessary database operations.


const User = require('./../models/userModel');

exports.getAllUsers = async (req, res, next) => {
  const users = await User.find();
  console.log(users.toString())
  res.status(200).json({
    status: 'success',
    results: users.length,
    users
  });
};

exports.createUser = async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.password
  });

  res.status(201).json({
    status: 'success',
    data: newUser
   
  });
};
exports.deleteMe = async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null
  });
};



// Get a single user by ID
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found!'
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found!'
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found!'
      });
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};