const { Listener } = require('discord-akairo');

module.exports = class UnhandledRejectionListener extends Listener {
    constructor() {
        super('unhandledRejection', {
            emitter: 'process',
            event: 'unhandledRejection',
        });
    }

    exec(err) {
        this.client.logger('red', err);
    }
};