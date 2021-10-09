// This is the central point that our routers confer to. Here is where our individual routes come together and get read by the server.
const mainRoutes = require("./main");
const constructorMethod = (app) => {
  app.use("/", mainRoutes);

  app.use("*", (req, res) => {
    res.status(404).render("errors/error", { e: "404: Page Not Found" });
  });
};
module.exports = constructorMethod;
