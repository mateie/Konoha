const Command = require('../../struct/Command');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = class EnrollCommand extends Command {
    constructor() {
        super('enroll', {
            description: 'Start your adventure',
            category: 'shinobi',
        });
    }

    async exec(message) {
        try {
            const shinobi = await User.createShinobi(message.member.id);

            if(!shinobi) {
                return message.reply('You already are shinobi');
            }

            message.channel.send(`${message.member} is now a **${shinobi.stats.rank}** from __**${shinobi.stats.clan.name}**__ in __${this.client.user.username}__`);
        } catch(err) {
            console.error(err);
            message.reply('An error occured, couldn\'t make you a Shinobi, please try again');
        }
    }
};