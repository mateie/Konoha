const Command = require('../../struct/Command');
const Util = require('../../struct/Util');
const { clans } = require('../../assets/shinobi.js');

module.exports = class ClansCommand extends Command {
    constructor() {
        super('clans', {
            description: 'All the clans in Shinobi World and details about them',
            category: 'shinobi',
        });
    }

    async exec(message) {
        try {
            const clansMapped = clans.map(clan => `
            \`${clan.name} Clan\`\n***Chakra Limit***: ${clan.chakra}\n
            ${clan.description}
        `);

            const chunked = Util.chunk(clansMapped, 1).map(x => x.join('\n'));

            const embed = Util.embed()
                .setTitle(`${this.client.user.username}'s Clans`)
                .setDescription(chunked[0])
                .setFooter(`Page 1 of ${chunked.length}`);

            const clansMessage = await message.channel.send(embed);
            if (chunked.length) await Util.pagination(clansMessage, message.author, chunked);
        } catch(err) {
            this.client.log(new Error(err.message));
        }

    }
};