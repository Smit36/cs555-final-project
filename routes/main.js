const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 16;
const xss = require('xss');
const usersDatabase = require('../data/users');
const { validateUser } = require('../data/users');

// This route will render our home page. If it cannot, it will send a 500 error and render the error.
router.get('/', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/signup');
    }
    res.render('tasks/home', {
      title: 'Wellness',
      name: req.session.user.firstName + ' ' + req.session.user.lastName,
    });
  } catch (e) {
    res.status(500).render('errors/error', { error: e });
  }
});

router.get('/signup', async (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  return res.render('signup.handlebars', { title: 'Sign up' });
});

router.post('/signup', async (req, res) => {
  let { email, username, password, confirmpassword, lname, fname } = req.body;
  email = xss(email);
  username = xss(username);
  password = xss(password);
  confirmpassword = xss(confirmpassword);
  fname = xss(fname);
  lname = xss(lname);

  if (!email || typeof email !== 'string' || email.trim().length == 0) {
    return res.status(400).render('signup.handlebars', {
      title: 'Sign up failed',
      errormsg: 'Error: Email not provided or is not a valid string.',
    });
  }

  if (!username || typeof username !== 'string' || username.trim().length == 0) {
    return res.status(400).render('signup.handlebars', {
      title: 'Sign up failed',
      errormsg: 'Error: Username not provided or is not a valid string.',
    });
  }
  if (!password || typeof password !== 'string' || password.trim().length == 0) {
    return res.status(400).render('signup.handlebars', {
      title: 'Sign up failed',
      errormsg: 'Error: Password not provided or is not a valid string.',
    });
  }
  if (
    !confirmpassword ||
    typeof confirmpassword !== 'string' ||
    confirmpassword.trim().length == 0
  ) {
    return res.status(400).render('signup.handlebars', {
      title: 'Sign up failed',
      errormsg: 'Error: Confirm password not provided or is not a valid string.',
    });
  }
  if (password !== confirmpassword) {
    return res.status(400).render('signup.handlebars', {
      title: 'Sign up failed',
      errormsg: 'Error: Passwords do not match.',
    });
  }
  const realusername = username.toLowerCase();
  const hashPassword = await bcrypt.hash(password, saltRounds);
  let user;
  try {
    user = await usersDatabase.addUser(fname, lname, realusername, hashPassword, email);
  } catch (e) {
    return res.status(500).render('signupError.handlebars', {
      title: 'Sign up failed',
      error: e,
    });
  }
  user = {
    id: user._id,
    firstName: fname,
    lastName: lname,
    realUserName: realusername,
    hashPassword: hashPassword,
    email,
  };
  req.session.user = user;
  return res.status(200).render(`tasks/problems.handlebars`, { name: fname + ' ' + lname });
});

router.get('/login', async (req, res) => {
  return res.render('login.handlebars', { title: 'Login' });
});

router.post('/login', async (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  let { username, password } = req.body;
  username = xss(username);
  password = xss(password);

  if (!username || typeof username !== 'string' || username.trim().length == 0) {
    return res.status(400).render('login.handlebars', {
      title: 'Login failed',
      errormsg: 'Error: Username not provided or is not a valid string.',
    });
  }
  if (!password || typeof password !== 'string' || password.trim().length == 0) {
    return res.status(400).render('login.handlebars', {
      title: 'Login failed',
      errormsg: 'Error: Password not provided or is not a valid string.',
    });
  }

  const realusername = username.toLowerCase();

  try {
    const user = await validateUser(realusername, password);
    user.id = user._id.toString();
    req.session.user = user;
    return res.redirect('/');
  } catch (e) {
    return res.status(500).render('loginError.handlebars', {
      title: 'Login failed',
      error: e,
    });
  }
});

router.get('/logout', async (req, res) => {
  try {
    req.session.destroy();
    return res.redirect('/login');
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
