const Command = require('../../struct/Command');
const Util = require('../../struct/Util');

module.exports = class FirstMessageCommand extends Command {
    constructor() {
        super('first-message', {
            category: 'info',
            aliases: ['first-msg'],
            description: 'Provides the first message was sent in channel',
            args: [
                {
                    id: 'channel',
                    type: 'textChannel',
                    default: msg => msg.channel,
                },
            ],
        });
    }

    async exec(message, { channel }) {
        const messages = await channel.messages.fetch({ after: 1, limit: 1 });
        const msg = messages.first();
        const embed = Util.embed()
            .setColor(msg.member ? msg.member.displayHexColor : 'ORANGE')
            .setThumbnail(msg.author.displayAvatarURL({ format: 'png', dynamic: true }))
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ format: 'png', dynamic: true }))
            .setDescription(msg.content)
            .setFooter(msg.createdAt)
            .addField(':arrow_up: Jump', `Click the link to jump to it (${msg.url})`);

        return message.channel.send(embed);
    }
};