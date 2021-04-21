const Command = require('../../struct/ShinobiCommand');
const mongoose = require('mongoose');
const Shinobi = mongoose.model('Shinobi');
const { clans } = require('../../assets/json/shinobi.json');

module.exports = class ShinobiStartCommand extends Command {
    constructor() {
        super('start', {
            description: 'Start your adventure',
        });
    }

    async exec(message) {
        const shinobi = await Shinobi.findOne({ userID: message.author.id });

        if (shinobi) {
            return message.reply(`You already are a shinobi with **${shinobi.clan}** bloodline in ***Konoha***`);
        } else {
            console.log('doesnt exist');
            const clan = clans[Math.floor(Math.random() * clans.length)];
            console.log(clan);

            const newShinobi = new Shinobi({
                userID: message.author.id,
                clan: clan.name,
                chakra: clan.chakra,
            });

            newShinobi.save()
            .then(saved => {
                message.channel.send(`${message.member} was born in **${saved.clan}**`);
            })
            .catch(err => this.client.logger('red', err));
        }
    }
};