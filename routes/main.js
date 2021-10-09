const express = require("express");
const router = express.Router();

// This route will render our home page. If it cannot, it will send a 500 error and render the error.
router.get("/", async (req, res) => {
  try {
    res.render("tasks/home", { title: "Wellness" });
  } catch (e) {
    res.status(500).render("errors/error", { e: e });
  }
});
module.exports = router;
