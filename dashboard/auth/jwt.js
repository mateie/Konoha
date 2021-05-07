const jwt = require('jsonwebtoken');
const { dashboard } = require('../../config');

module.exports = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
        const token = bearerHeader.split(' ')[1].replace(/"/g, '');
        req.token = token;
        jwt.verify(req.token, dashboard.jwt_secret, err => {
            if(err) {
                console.error(err);
                return res.sendStatus(403);
            }

            next();
        });
    } else {
        res.sendStatus(403);
    }
};