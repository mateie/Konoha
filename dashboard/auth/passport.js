const Strategy = require('passport-discord').Strategy;
const { bot } = require('../../config');

module.exports = passport => {
    passport.use(
        new Strategy({
            clientID: bot.id,
            clientSecret: bot.secret,
            callbackURL: '/discord/callback',
            scope: ['identify', 'guilds'],
        }, (accessToken, refreshToken, user, done) => {
            done(null, accessToken);
        }),
    );
};