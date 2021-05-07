const jwt = require('jsonwebtoken');
const DiscordOAuth2 = require('discord-oauth2');
const mongoose = require('mongoose');
const { dashboard } = require('../../../config');

const User = mongoose.model('User');

module.exports = async (req, res) => {
    try {
        const accessToken = req.user;
        const oAuth = new DiscordOAuth2();
        const oAuthUser = await oAuth.getUser(accessToken);

        // eslint-disable-next-line no-unused-vars
        const user = await User.findOne({ id: oAuthUser.id });

        const payload = {
            user: oAuthUser,
        };

        const expiration = 600 * 100;

        jwt.sign(
            payload,
            dashboard.jwt_secret,
            {
                expiresIn: expiration,
            },
            (err, token) => {
                if(err) {
                    console.error(err);
                    return res.sendStatus(403);
                }

                res.cookie('discord-user', token, { maxAge: expiration }).redirect('/');
            },
        );
    } catch(err) {
        console.error(err);
        res.sendStatus(403).json({ status: 'failed_auth' });
    }
};