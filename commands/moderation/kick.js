const Command = require('../../struct/Command');
const Util = require('../../struct/Util');

module.exports = class KickCommand extends Command {
    constructor() {
        super('kick', {
            category: 'moderation',
            description: 'Kick a member',
            clientPermissions: ['KICK_MEMBERS'],
            userPermissions: ['KICK_MEMBERS'],
            args: [
                {
                    id: 'member',
                    type: 'member',
                    prompt: {
                        start: 'Who do you want to kick?',
                        retry: 'Invalid member provided, try again',
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

    exec(message, { member, reason }) {
        if(member.id === message.author.id) return message.channel.send('You cannot kick yourself');

        member
        .kick(reason)
        .then(() => {
            const dmEmbed = Util.embed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
            .setTitle(`You were kicked from ${message.guild.name}`)
            .setThumbnail(message.guild.iconURL())
            .setDescription(`***Reason***: *${reason}*`);

            const channelEmbed = Util.embed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
            .setTitle(`${message.author.username} kicked ${member.user.username}#${member.user.discriminator}`)
            .setThumbnail(message.guild.iconURL())
            .setDescription(`***Reason***: *${reason}*`);

            member.send(dmEmbed);
            message.channel.send(channelEmbed);
        })
        .catch(() => {
            const embed = Util.embed()
            .setTitle(`${message.author.username} couldn't kick ${member.user.username}#${member.user.discriminator}`)
            .setDescription('Please check your permissions');

            message.channel.send(embed);
        });
    }
};