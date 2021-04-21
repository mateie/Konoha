const Command = require('../../struct/ShinobiCommand');
const ShinobiProfile = require('../../struct/shinobi/Profile');

module.exports = class ShinobiStartCommand extends Command {
    constructor() {
        super('start', {
            description: 'Start your adventure',
        });
    }

    async exec(message) {
        const created = await ShinobiProfile.createProfile(message.author.id);

        if(!created) {
            return message.reply('You already are a shinobi');
        }

        return message.channel.send(`New Shinobi was born in **${created.clan}**`);
    }
};