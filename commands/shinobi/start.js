const Command = require('../../struct/ShinobiCommand');

module.exports = class ShinobiStartCommand extends Command {
    constructor() {
        super('start', {
           description: 'Start your adventure',
        });
    }

    exec(message) {
        console.log('Works');
    }
};