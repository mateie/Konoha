const Command = require('../../struct/Command');
const Util = require('../../struct/Util');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const { jutsus } = require('../../assets/shinobi');

module.exports = class LearnCommand extends Command {
    constructor() {
        super('learn', {
            category: 'shinobi',
            description: 'Learn Ninjutsus, Genjutsus and Taijutsus with Points',
            args: [
                {
                    id: 'type',
                    type: ['ninjutsu', 'genjutsu', 'taijutsu'],
                    prompt: {
                        start: 'What type of jutsu you want to learn?',
                        retry: 'Incorrect type of jutsu provided, please try again',
                    },
                },
                {
                    id: 'jutsu_name',
                    type: 'lowercase',
                    match: 'rest',
                    prompt: {
                        start: 'Which jutsu you want to learn?',
                    },
                },
            ],
        });
    }

    async exec(message, { type, jutsu_name }) {
        try {
            const user = await User.findOne({ id: message.member.id });
            const stats = user.stats;
            const jutsuRegex = /jutsu/;

            if(!stats.rank) {
                return message.reply('You have to enroll into academy to view your stats');
            }

            const jutsu = jutsus[type.replace(jutsuRegex, '')][jutsu_name];

            if (!jutsu) {
                return message.reply(`${jutsu_name} ${type} doesn't exist`);
            }

            const embed = Util.embed()
                .setTitle(`Do you want to learn ${jutsu.name}?`)
                .setDescription(`
                **Chakra Cost**: ${jutsu.chakra_cost}
                **Points Cost**: ${jutsu.point_cost}\n
                ${jutsu.description}
            `)
                .setFooter('Waiting for response...');

            const ask = await message.channel.send(embed);
            const verification = await Util.verify(message.channel, message.author);
            if(verification === 0) {
                embed.setFooter(`Timed out. You didn't learn ${jutsu.name}`);
                return ask.edit(embed);
            } else if(!verification) {
                embed.setFooter(`You didn't learn ${jutsu.name}`);
                return ask.edit(embed);
            }

            const exists = stats.jutsus[type.replace(jutsuRegex, '')].find(j => j.name === jutsu.name) ? true : false;

            if(exists) {
                embed
                .setTitle(`You already know ${jutsu.name}`)
                .setFooter(`Your points: ${stats.points}`);
                return ask.edit(embed);
            }

            const bought = stats.points - jutsu.point_cost;

            if(bought < 0) {
                embed
                .setTitle('You don\'t have enough points')
                .setFooter(`Your points: ${stats.points}`);
                return ask.edit(embed);
            }

            stats.points = bought;

            stats.jutsus[type.replace(jutsuRegex, '')].push(jutsu);

            const saved = await user.save();

            embed
            .setTitle(`Successfully learned ${jutsu.name}`)
            .setFooter(`Your points: ${saved.stats.points}`);

            return ask.edit(embed);
        } catch (err) {
            console.error(err);
        }
    }
};