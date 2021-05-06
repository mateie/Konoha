const Command = require('../../struct/Command');
const Util = require('../../struct/Util');

module.exports = class BansCommand extends Command {
    constructor() {
        super('bans', {
            category: 'moderation',
            description: 'Shows all bans on the current server',
        });
    }

    async exec(message) {
        try {
            const bans = await message.guild.fetchBans();
            const embed = Util.embed()
                .setAuthor(`${message.guild.name}'s Bans`, message.guild.iconURL());

            const mapped = bans.map(ban => `
            ***User***: ${ban.user.username}#${ban.user.discriminator}
            ***Reason***: ${ban.reason ? `*${ban.reason}*` : '*No reason provided*'}
        `);

            const chunked = Util.chunk(mapped, 1);
            embed
                .setDescription(chunked[0])
                .setFooter(`Page 1 of ${chunked.length}`);

            const bansMessage = await message.channel.send(embed);
            if (chunked.length > 1) await Util.pagination(bansMessage, message.author, chunked);
        } catch(err) {
            this.client.log(new Error(err.message));
        }
    }
};