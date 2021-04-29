require('dotenv').config();
require('./models');
const { database } = require('./config');
const mongoose = require('mongoose');

mongoose.connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
    .then(() => {
        console.info('Connected to the database');

        require('./extensions');
        const Client = require('./struct/Client');
        const client = new Client();
        client.start();
    })
    .catch(console.error);

