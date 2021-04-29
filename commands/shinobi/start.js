const Command = require('../../struct/Command');
const ShinobiProfile = require('../../struct/shinobi/Profile');

module.exports = class ShinobiStartCommand extends Command {
    constructor() {
        super('start', {
            description: 'Start your adventure',
            category: 'shinobi',
        });
    }

    async exec(message) {
        const created = await ShinobiProfile.createProfile(message.member);

        if(!created) {
            return message.reply('You already are a shinobi');
        }

        return message.channel.send(`${message.member} was born as a Shinobi **${created.clan} Clan**`);
    }
};