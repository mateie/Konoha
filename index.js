require('dotenv').config();
require('./models');
const { DB } = process.env;
const mongoose = require('mongoose');

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.info('Connected to the database');

        require('./extensions');
        const Client = require('./struct/Client');
        const client = new Client();
        client.start();
    })
    .catch(console.error);

