const Command = require('../../struct/Command');
const Util = require('../../struct/Util');

module.exports = class BanCommand extends Command {
    constructor() {
        super('ban', {
            category: 'moderation',
            aliases: ['ban-hammer'],
            description: 'Ban a member',
            args: [
                {
                    id: 'member',
                    type: 'member',
                    prompt: {
                        start: 'Who do you want to ban?',
                        retry: 'Invalid member provided, please try again',
                    },
                },
                {
                    id: 'messages',
                    type: (message, phrase) => {
                        if (!phrase || isNaN(phrase)) return null;
                        const num = parseInt(phrase);
                        if (num < 0 || num > 7) return null;
                        return num;
                    },
                    prompt: {
                        start: 'Number of days of messages to delete? from 0 to 7',
                        retry: 'Invalid Number or range provided',
                    },
                },
                {
                    id: 'reason',
                    type: 'string',
                    default: 'No reason provided',
                },
            ],
        });
    }

    exec(message, { member, messages, reason }) {
        if (member.id === message.author.id) return message.channel.send('You cannot ban yourself');

        member
            .ban({ days: messages, reason: reason })
            .then(() => {
                const dmEmbed = Util.embed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
                    .setTitle(`You were banned on ${message.guild.name}`)
                    .setThumbnail(message.guild.iconURL())
                    .setDescription(`***Reason***: *${reason}*`);

                const channelEmbed = Util.embed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
                    .setTitle(`${message.author.username} banned ${member.user.username}`)
                    .setDescription(`***Reason***: *${reason}*`);

                member.send(dmEmbed);
                message.channel.send(channelEmbed);
            })
            .catch(() => {
                const embed = Util.embed()
                    .setTitle(`${message.author.username} couldn't ban ${member.user.username}`)
                    .setDescription('Please check your permissions');

                message.channel.send(embed);
            });
    }
};