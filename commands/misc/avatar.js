const Command = require('../../struct/Command');
const Util = require('../../struct/Util');

module.exports = class AvatarCommand extends Command {
    constructor() {
        super('avatar', {
            category: 'misc',
            aliases: ['av'],
            description: 'Get Avatar from yourself or another User/Member',
            args: [
                {
                    id: 'mention',
                    type: 'member',
                    default: message => message.member,
                },
            ],
        });
    }

    exec(message, { mention }) {
        const avatar = this.client.users.cache
            .get(mention.user.id)
            .displayAvatarURL({ format: 'png', dynamic: true, size: 2048 });

        message.channel.send(Util.embed().setTitle(`${mention.user.username}'s Profile Picture`).setImage(avatar));
    }
};