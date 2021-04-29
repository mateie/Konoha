const Command = require('../../struct/Command');
const Util = require('../../struct/Util');
const ShinobiProfile = require('../../struct/shinobi/Profile');
const shinobis = require('../../assets/json/shinobi.json');

module.exports = class ShinobiLearnCommand extends Command {
    constructor() {
        super('learn', {
            description: 'Learn Ninjutsus, Genjutsus and Taijutsus with Points',
            category: 'shinobi',
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
                    prompt: {
                        start: 'Which jutsu you want to learn?',
                    },
                },
            ],
        });
    }

    async exec(message, { type, jutsu_name }) {
        const profile = await ShinobiProfile.getProfile(message.member);

        const jutsu = shinobis[`${type}s`][jutsu_name];
        if (!jutsu) {
            return message.reply(`That ${type} doesn't exist`);
        }

        const embed = Util.embed()
            .setTitle(`Do you want to learn ${jutsu.name}?`)
            .setDescription(`
            **Points Cost**: ${jutsu.points}
            **Chakra Cost**: ${jutsu.cost}\n
            ${jutsu.description}
        `)
            .setFooter('Waiting for response...');

        const ask = await message.channel.send(embed);
        const verification = await Util.verify(message.channel, message.author);
        if (verification === 0) {
            embed.setFooter(`Timed out. You didn't learn ${jutsu.name}`);
            return ask.edit(embed);
        } else if (!verification) {
            embed.setFooter(`You didn't learn ${jutsu.name}`);
            return ask.edit(embed);
        }

        const exists = profile[type].find(j => j.name === jutsu.name) ? true : false;

        if (exists) {
            embed.setTitle(`You already know ${jutsu.name}`);
            embed.setFooter(`Your Points: ${profile.points}`);
            return ask.edit(embed);
        }

        const bought = profile.points - jutsu.points;

        if (bought < 0) {
            embed.setTitle('You don\'t have enough points');
            embed.setFooter(`Your Points: ${profile.points}`);
            return ask.edit(embed);
        }

        profile.points = bought;
        jutsu.refund = jutsu.points / 2;
        profile[type].push(jutsu);

        const saved = await profile.save();

        embed.setTitle(`Successfully Learned ${jutsu.name}`);
        embed.setFooter(`Your Points: ${saved.points}`);

        return ask.edit(embed);

    }
};