const Command = require('../../struct/ShinobiCommand');
const ShinobiProfile = require('../../struct/shinobi/Profile');

module.exports = class ShinobiProfileCommand extends Command {
    constructor() {
        super('profile', {
            description: 'Check profile',
            args: [
                {
                    id: 'member',
                    type: 'member',
                    default: message => message.member,
                },
            ],
        });
    }

    async exec(message, { member }) {
        const profile = await ShinobiProfile.getProfile(member);

        if(!profile) {
            if(member.id === message.author.id) {
                return message.reply('You are not a shinobi');
            }

            return message.channel.send('They are not a shinobi');
        }
    }
};