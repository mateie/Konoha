const Command = require('../../struct/Command');
const Util = require('../../struct/Util');

module.exports = class PPCommand extends Command {
    constructor() {
        super('pp', {
            category: 'fun',
            aliases: ['peepee'],
            description: 'Determines your pp size',
        });
    }

    exec(message) {
        const random = Math.floor(Math.random() * 10);

        let pp = '8';
        for(let i = 0; i < random; i++) {
            pp += '=';
        }

        pp += 'D';

        const embed = Util.embed()
        .setTitle('Your pp size')
        .addField('\u200B', pp);

        return message.channel.send(embed);
    }
};