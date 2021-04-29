const Command = require('../../struct/Command');
const Util = require('../../struct/Util');
const ShinobiProfile = require('../../struct/shinobi/Profile');

module.exports = class ShinobiProfileCommand extends Command {
    constructor() {
        super('shinobi', {
            description: 'Check profile',
            category: 'shinobi',
            aliases: ['sh'],
            args: [
                {
                    id: 'more_info',
                    type: ['ninjutsu', 'genjutsu', 'taijutsu'],
                    default: null,
                },
            ],
        });
    }

    async exec(message, { more_info }) {
        const shinobi = await ShinobiProfile.getProfile(message.member);
        const profile = await ShinobiProfile.getProfileEmbed(message.member);

        if (!profile) {
            return message.reply('You are not a shinobi');
        }

        if (!more_info) {
            return message.channel.send(profile);
        }

        const jutsus = shinobi[more_info];

        if(jutsus.length === 0) {
            return message.reply(`You have not learned any ${more_info}s`);
        }

        const jutsusMapped = jutsus.map(jutsu => `
            ***${jutsu.name}***\n
            **Chakra Cost**: ${jutsu.cost}
            **Initial Cost**: ${jutsu.points}
            **Refund Value**: ${jutsu.refund}\n
            ${jutsu.description}
        `);

        const chunked = Util.chunk(jutsusMapped, 1).map(x => x.join('\n'));

        const embed = Util.embed()
        .setTitle(`${message.member.user.username}'s ${Util.capFirstLetter(more_info)}s`)
        .setDescription(chunked[0])
        .setFooter(`Page 1 of ${chunked.length}`);

        const pfMessage = await message.channel.send(embed);
        if(chunked.length > 1) await Util.pagination(pfMessage, message.author, chunked);
    }
};