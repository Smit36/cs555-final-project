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
		res.render('tasks/home', { title: 'Wellness' });
	} catch (e) {
		res.status(500).render('errors/error', { error: e });
	}
});

router.get('/signup', async (req, res) => {
	return res.render('signup.handlebars', { title: 'Sign up' });
});

router.post('/signup', async (req, res) => {
	let { email, username, password, confirmpassword, lname, fname } =
		req.body;
	email = xss(email);
	username = xss(username);
	password = xss(password);
	confirmpassword = xss(confirmpassword);
	fname = xss(fname);
	lname = xss(lname);

	if (!email || typeof email !== 'string' || email.trim().length == 0) {
		return res.status(400).render('signup.handlebars', {
			title: 'Sign up failed',
			errormsg: 'Error: Email not provided or is not a valid string.'
		});
	}
	/*try {
      errorChecker.ValidateEmail(email);
  } catch(e) {
      return res.status(400).render("signup.handlebars", {title: "Sign up failed", errormsg: "Error: Please enter a valid E-mail."});
  }*/
	if (
		!username ||
		typeof username !== 'string' ||
		username.trim().length == 0
	) {
		return res.status(400).render('signup.handlebars', {
			title: 'Sign up failed',
			errormsg:
				'Error: Username not provided or is not a valid string.'
		});
	}
	if (
		!password ||
		typeof password !== 'string' ||
		password.trim().length == 0
	) {
		return res.status(400).render('signup.handlebars', {
			title: 'Sign up failed',
			errormsg:
				'Error: Password not provided or is not a valid string.'
		});
	}
	if (
		!confirmpassword ||
		typeof confirmpassword !== 'string' ||
		confirmpassword.trim().length == 0
	) {
		return res.status(400).render('signup.handlebars', {
			title: 'Sign up failed',
			errormsg:
				'Error: Confirm password not provided or is not a valid string.'
		});
	}
	if (password !== confirmpassword) {
		return res.status(400).render('signup.handlebars', {
			title: 'Sign up failed',
			errormsg: 'Error: Passwords do not match.'
		});
	}
	const realusername = username.toLowerCase();
	const hashPassword = await bcrypt.hash(password, saltRounds);
	try {
		await usersDatabase.addUser(
			fname,
			lname,
			realusername,
			hashPassword,
			email
		);
	} catch (e) {
		return res.status(500).render('signupError.handlebars', {
			title: 'Sign up failed',
			error: e
		});
	}
	return res.render('signupSuccess.handlebars', {
		title: 'Sign up success',
		user: realusername
	});
});

router.get('/login', async (req, res) => {
	return res.render('login.handlebars', { title: 'Login' });
});

router.post('/login', async (req, res) => {
	let { username, password } = req.body;
	username = xss(username);
	password = xss(password);

	if (
		!username ||
		typeof username !== 'string' ||
		username.trim().length == 0
	) {
		return res.status(400).render('login.handlebars', {
			title: 'Login failed',
			errormsg:
				'Error: Username not provided or is not a valid string.'
		});
	}
	if (
		!password ||
		typeof password !== 'string' ||
		password.trim().length == 0
	) {
		return res.status(400).render('login.handlebars', {
			title: 'LOgin failed',
			errormsg:
				'Error: Password not provided or is not a valid string.'
		});
	}

	const realusername = username.toLowerCase();

	try {
		const user = await validateUser(realusername, password);

		req.session.user = {
			id: user._id,
			username: user.username,
			hashedPassword: user.hashedPassword
		};
		res.redirect(`/profile/${user._id}`);
	} catch (e) {
		return res.status(500).render('loginError.handlebars', {
			title: 'Login failed',
			error: e
		});
	}
});

module.exports = router;
