/* eslint-disable no-unused-vars */
const router = require('express').Router();

router.post('/guild', (req, res) => {
    const { guild } = req.body;

});

router.post('/user', (req, res) => {
    const { user } = req.body;

});

router.post('/member', (req, res) => {
    const { guild, member } = req.body;

});

module.exports = router;