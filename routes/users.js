const express = require("express");
const router = express.Router();
const userData = require("../data/users");

// Gets a user profile. **THIS WILL NEED TO BE TWEAKED WHEN WE GET LOGIN SESSIONS WORKING.
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || typeof id !== "string" || id.trim().length === 0)
      throw `Error: ID is invalid.`;

    const user = await userData.getUserById(id);
    res.render("users/profile", { title: "Wellness", user: user });
  } catch (e) {
    res.render("errors/error", { title: "Error", error: e });
  }
});

module.exports = router;
