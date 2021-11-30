// This is the central point that our routers confer to. Here is where our individual routes come together and get read by the server.
const mainRoutes = require('./main');
const taskRoutes = require('./tasks');
const profileRoutes = require('./profile');
const express = require('express');
const sessions = require('express-session');

const constructorMethod = (app) => {
  app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(
      sessions({
        name: 'AuthCookie',
        secret: 'some secret string!',
        resave: false,
        saveUninitialized: true,
      }),
    );
  app.use('/', mainRoutes);
  app.use('/task', taskRoutes);
  app.use('/profile', profileRoutes);
  app.use('*', (req, res) => {
    return res.status(404).render('errors/error', { error: '404: Page Not Found' });
  });
};
module.exports = constructorMethod;
