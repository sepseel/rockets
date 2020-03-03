const express = require('express');
const passport = require('passport');
// const { sanitize } = require('../bin/util');
const { createUser } = require('../models/database');

const router = express.Router();

// route to get the login page
router.get('/login', (req, res) => {
  res.render('login', {});
});

// route to get the register page
router.get('/register', (req, res) => {
  res.render('register', {});
});

// route for the login form
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true,
}));

/**
 * Check if all the fields contain the expected data types and formats
 * @param {*} req the post request containg the user data
 */
function validateRegisterForm(req) {
  // VALIDATE email
  // VALIDATE does email exist in database?
  const errors = [];
  console.log(req.body);
  const {
    username, email, password, password2,
  } = req.body;

  // are all the fields filled in?
  // if (!username || !email || !password || !password2) {
  //   errors.push({ msg: 'Please fill out all fields.' });
  // }
  // // do any of the fields contain an ; ?
  // if (username.contains(";") && email.contains(";") || password.contains(";")) {
  //   errors.push({msg: "Please dont use ';'"});
  // }
  // // is the password long enough?
  // if (password.length < 6) {
  //   errors.push({ msg: 'Password must be at least 6 characters.' });
  // }
  // do the passwords match?
  if (password !== password2) {
    errors.push({ msg: 'Passwords must match.' });
  }
  return {
    errors, username, email, password,
  };
}

// route for the register form
router.post('/register', async (req, res) => {
  const {
    errors, username, email, password, password2,
  } = validateRegisterForm(req);
  if (errors.length > 0) {
    // invalid form
    res.render('register', {
      errors, username, email, password, password2,
    });
  } else {
    // valid form
    try {
      await createUser(email, username, password); // add the user to the database
      req.flash('success_msg', 'You are now registered and can log in');
      res.redirect('/users/login');
    } catch (e) {
      errors.push({ msg: 'Oops, something went wrong, please try again.' });
      res.render('register', {
        errors, username, email, password, password2,
      });
    }
  }
});

module.exports = router;
