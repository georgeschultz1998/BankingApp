// Author: Anthony Schultz
// Date: 4/28/23
// Description: This file defines the User model using a Mongoose schema. The User model
// includes fields such as name, email, photo, role, password, and password-related fields.
// The schema also includes pre-save hooks and instance methods for password validation,
// password change tracking, and password reset token generation.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'staff', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    validate:{
      validator: function(pwd){
        return pwd === this.password;
      },
      message: " the password confirmation did not match"
  }
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now
  },
  passwordResetExpires: {
    type: Date,
    default: Date.now
  },
  active: {
    type: String,
    default: 'true',
    select: 'false'
  }
});


userSchema.pre('save', async function(next){
  if(!this.isModified('password')){
    return next;
  }

  this.password = await this.password; 
  this.passwordConfirm = undefined;
  next();
});


userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  console.log(candidatePassword)
  console.log(bcrypt.compare(candidatePassword, userPassword))
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');


  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
