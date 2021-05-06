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
                ***Ninjutsus Learned***: ${jutsus.nin.length}
                ***Genjutsus Learned***: ${jutsus.gen.length}
                ***Taijutsus Learned***: ${jutsus.tai.length}
                `,
            ];

            const embed = Util.embed()
                .setTitle(`${member.displayName}'s Stats`)
                .setDescription(info[0]);

            await message.channel.send(embed);
        } catch (err) {
            console.error(err);
        }
    }
};