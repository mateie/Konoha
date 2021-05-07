const router = require('express').Router();

const getSelf = require('../../controllers/bot/self');
const getRoute = require('./get');

router.post('/self', getSelf);

router.use('/get', getRoute);

module.exports = router;