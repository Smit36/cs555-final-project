const express = require("express");
const router = express.Router();

const data = require("../data");
const profileData = data.profile;

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await profileData.createProfile(userId);
    res.status(200).render("users/profile", { profile });
  } catch (e) {
    console.log(e);
    res.json(e);
    res.status(400).render("errors/error", { error: e });
  }
});

module.exports = router;
