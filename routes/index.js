const path = require('path');
const userRoutes = require('./renamethislater');
const constructorMethod = (app) => {
    app.use('/', userRoutes);
 
    app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};
module.exports = constructorMethod;