const Command = require('../../../struct/Command');
const mongoose = require('mongoose');
const Guild = mongoose.model('Guild');
const Util = require('../../../struct/Util');

module.exports = class WarnCommand extends Command {
    constructor() {
        super('warn', {
            category: 'moderation',

            description: 'Warn a member',
            args: [
                {
                    id: 'member',
                    type: 'member',
                    prompt: {
                        start: 'Who do you want to warn?',
                        retry: 'Invalid member provided, please try again',
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

    async exec(message, { member, reason }) {
        if (member.id == message.author.id || member.user.bot) {
            return message.channel.send('This member cannot be warned');
        }

        const guild = await Guild.findOne({ id: message.guild.id });

        const memberWarn = guild.warns.find(warn => warn.member == member.id);
        if (!memberWarn) {
            const warn = {
                member: member.id,
                by: [message.author.id],
                reasons: [`*${reason}*`],
                firstWarn: message.createdTimestamp,
                latestWarn: message.createdTimestamp,
                total: 1,
            };

            guild.warns.push(warn);
        } else {
            memberWarn.by.push(message.author.id);
            memberWarn.reasons.push(`*${reason}*`);
            memberWarn.latestWarn = message.createdTimestamp;
            memberWarn.total = memberWarn.total + 1;

            const warns = guild.warns.filter(warn => warn.member != member.id);
            guild.warns = warns;
            guild.warns.push(memberWarn);
        }

        guild.save()
            .then(updated => {
                const memberWarn = updated.warns.find(warn => warn.member == member.id);
                const dmEmbed = Util.embed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ format: 'png' }))
                    .setTitle(`You have been warned on ${message.guild.name}`)
                    .setThumbnail(message.guild.iconURL())
                    .addFields([
                        { name: 'Warned by', value: message.author.username, inline: true },
                        { name: 'Reason', value: reason, inline: true },
                    ])
                    .setFooter(`You have ${memberWarn.total} warns`);

                const channelEmbed = Util.embed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ format: 'png' }))
                    .setTitle(`${member.user.username}#${member.user.discriminator} has been warned`)
                    .setThumbnail(message.guild.iconURL())
                    .addFields([
                        { name: 'Warned by', value: message.author.username, inline: true },
                        { name: 'Reason', value: reason, inline: true },
                    ])
                    .setFooter(`They have ${memberWarn.total} warns`);

                member.send(dmEmbed);
                message.channel.send(channelEmbed);
            });
    }
};