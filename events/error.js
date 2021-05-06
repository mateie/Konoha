const { Listener } = require('discord-akairo');

module.exports = class ErrorEvent extends Listener {
    constructor() {
        super('error', {
            emitter: 'client',
            event: 'error',
        });
    }

    exec(err) {
        this.client.log(new Error(err));
    }
};