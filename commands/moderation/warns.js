const Command = require('../../struct/Command');
const mongoose = require('mongoose');
const Guild = mongoose.model('Guild');
const moment = require('moment');
const Util = require('../../struct/Util');

module.exports = class WarnsCommand extends Command {
    constructor() {
        super('warns', {
            category: 'moderation',
            description: 'Shows all warns of a member or guild',
            args: [
                {
                    id: 'member',
                    type: 'member',
                    default: '',
                },
            ],
        });
    }

    async exec(message, { member }) {
        const guild = await Guild.findOne({ id: message.guild.id }).lean();
        const warns = guild.warns;

        if (member == '') {
            const embed = Util.embed()
                .setTitle(`${message.guild.name} Warns`)
                .setDescription('This server has no warns');

            if (warns.length > 0) {
                const mapped = warns.map(warn => `
                ***Member***: ${message.guild.members.cache.get(warn.member)}
                ***Warned by***: ${warn.by.map(id => message.guild.members.cache.get(id)).join(', ')}
                ***Reason***: ${warn.reasons.join(', ')}
                ***First Warn***: ${moment(warn.firstWarn).format('MMMM Do YYYY, H:mm:ss a')}
                ***Latest Warn***; ${moment(warn.latestWarn).format('MMMM Do YYYY, H:mm:ss a')}
                ***Total Warns***: ${warn.total}
            `);

                const chunked = Util.chunk(mapped, 1);
                embed.setDescription(chunked[0])
                    .setFooter(`Page 1 of ${chunked.length}`);

                const warnsMessage = await message.channel.send(embed);
                if (chunked.length > 1) await Util.pagination(warnsMessage, message.author, chunked);
            } else {
                await message.channel.send(embed);
            }
        } else {
            const memberWarn = guild.warns.find(warn => warn.member == member.id);

            const embed = Util.embed()
                .setTitle(`${member.user.username}#${member.user.discriminator}'s Warns`);

            if (!memberWarn) {
                embed.setDescription('This member has no warns');
                return message.channel.send(embed);
            }

            for (let i = 0; i < memberWarn.total; i++) {
                const by = message.guild.members.cache.get(memberWarn.by[i]);
                const reason = memberWarn.reasons[i];

                embed.addField(`Reason: ${reason}`, `Warned by: ${by}`, true);
            }

            message.channel.send(embed);
        }
    }
};