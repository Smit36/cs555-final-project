const express = require('express');
const router = express.Router();

const data = require('../data');
const profileData = data.profile;

router.get('/', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/signup');
    }
    const userId = req.session.user.id;
    console.log(userId);
    const profile = await profileData.createProfile(userId);
    res.status(200).render('users/profile', { profile });
  } catch (e) {
    console.log(e);
    res.status(400).render('errors/error', { error: e });
  }
});

module.exports = router;
