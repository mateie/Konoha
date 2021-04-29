const { MongooseProvider } = require('discord-akairo');

module.exports = class Provider extends MongooseProvider {
    constructor(model) {
        super(model);
    }
};