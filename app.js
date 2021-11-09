const express = require('express');
const app = express();
const staticPath = express.static(__dirname + '/public');

// The below packages will be required for a future secure login system.
const session = require('express-session');

const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

// Here, we define the path we are going to use in order to serve static files to the user.
app.use('/public', staticPath);

// Here, we accept middleware functions that handle JSON objects and URL encoded bodies.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Here, we set handlebars to be the view engine of choice, allowing us to generate HTML.
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(
	session({
		name: 'AuthCookie',
		secret: 'babababababababayoink',
		resave: false,
		saveUninitialized: true
	})
);

// This lets us set up our routes.
configRoutes(app);

module.exports = app;
