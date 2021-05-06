const Command = require('../../struct/Command');
const Util = require('../../struct/Util');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = class StatsCommand extends Command {
    constructor() {
        super('stats', {
            category: 'shinobi',
            description: 'View your\'s or other member\'s stats in Konoha',
            args: [
                {
                    id: 'member',
                    type: 'member',
                    default: message => message.member,
                },
            ],
        });
    }

    async exec(message, { member }) {
        try {
            if(member.user.bot) {
                return message.reply('You cannot check bot\'s stats');
            }

            let stats = await User.findOne({ id: member.id }).lean();
            stats = stats.stats;

            if (!stats.rank) {
                return message.reply('You have to enroll into academy to view your stats');
            }

            const clan = stats.clan;
            const jutsus = stats.jutsus;

            const info = [
                `
                Born in \`${clan.name} Clan\`
                Currently **${stats.rank}**\n
                XP: **${stats.xp}** - Level: **${stats.level}**
                HP: **${stats.hp}** - Chakra: **${stats.chakra}**\n
                ***Ninjutsus Learned***: ${jutsus.nin.length}
                ***Genjutsus Learned***: ${jutsus.gen.length}
                ***Taijutsus Learned***: ${jutsus.tai.length}
                `,
            ];

            const clanImageName = `${clan.name.toLowerCase()}.png`;

            const embed = Util.embed()
                .setTitle(`${member.displayName}'s Stats`)
                .attachFiles([`${process.cwd()}/assets/images/clans/${clanImageName}`])
                .setThumbnail(`attachment://${clanImageName}`)
                .setDescription(info[0])
                .setFooter(`Points earned: ${stats.points}`);

            await message.channel.send(embed);
        } catch (err) {
            this.client.log(new Error(err.message));
        }
    }
};