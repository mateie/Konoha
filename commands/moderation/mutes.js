const Command = require('../../struct/Command');
const mongoose = require('mongoose');
const Guild = mongoose.model('Guild');
const moment = require('moment');
const Util = require('../../struct/Util');

module.exports = class MutesCommand extends Command {
    constructor() {
        super('mutes', {
            category: 'moderation',
            description: 'List of muted members',
            userPermissions: ['VIEW_AUDIT_LOG'],
        });
    }

    async exec(message) {
        try {
            const guild = await Guild.findOne({ id: message.guild.id }).lean();
            const mutes = guild.mutes;

            const embed = Util.embed()
                .setTitle(`${message.guild.name} Mutes`)
                .setDescription('This server has no mutes');

            if (mutes.length > 0) {
                const mapped = mutes.map(mute => `
                    ***Member***: ${message.guild.members.cache.get(mute.member).user.username}#${message.guild.members.cache.get(mute.member).user.discriminator}
                    ***Warned by***: ${message.guild.members.cache.get(mute.by).user.username}#${message.guild.members.cache.get(mute.by).user.discriminator}
                    ***Reason***: ${mute.reason}
                    ***Time***: ${moment(mute.timestamp).format('MMMM Do YYYY, H:mm:ss a')}
                `);

                const chunked = Util.chunk(mapped, 1);
                embed
                    .setDescription(chunked[0])
                    .setFooter(`Page 1 of ${chunked.length}`);

                const mutesMessage = await message.channel.send(embed);
                if (chunked.length > 1) await Util.pagination(mutesMessage, message.author, chunked);
            } else {
                await message.channel.send(embed);
            }
        } catch(err) {
            this.client.log(new Error(err.message));
        }
    }
};