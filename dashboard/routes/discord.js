const router = require('express').Router();
const passport = require('passport');

const discordCallback = require('../controllers/discord/callback');

router.all('/', passport.authenticate('discord'));

router.all('/callback', passport.authenticate('discord'), discordCallback);

module.exports = router;