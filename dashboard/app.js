const express = require('express');
const passport = require('passport');
const http = require('http');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const port = 5000;

module.exports = client => {
    app.set('port', port);

    app.use(express.urlencoded({
        extended: false,
    }));
    app.use(express.json());

    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));

    app.use(passport.initialize());
    require('./auth/passport')(passport);

    app.use((req, res, next) => {
        req.bot = client;
        next();
    });

    app.use('/discord', require('./routes/discord'));
    app.use('/bot', cors(), require('./routes/bot/index'));
    app.use('/', (req, res) => res.redirect('http://localhost:3000'));

    server.listen(port);
    server.on('listening', () => {
        const addr = server.address();
        const bind = typeof addr === 'string' ? 'Pipe ' + addr : 'Port ' + addr.port;
        console.log('Dashboard API Running on ' + bind);
    });
};