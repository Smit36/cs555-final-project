// This is separated from app.js because we can then use app.js for testing purposes. This simply runs the server created in app.js.

const app = require("./app.js");

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
