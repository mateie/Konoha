const Command = require('../../struct/ShinobiCommand');
const Util = require('../../struct/Util');
const mongoose = require('mongoose');
const Shinobi = mongoose.model('Shinobi');

module.exports = class ShinobiTrainCommand extends Command {
    constructor() {
        super('train', {
            description: 'Train yourself',
            args: [
                {
                    id: 'skill',
                    type: ['ninjutsu', 'genjutsu', 'taijutsu'],
                    prompt: {
                        start: 'Which type of skill do you want to learn?',
                        retry: 'Invalid skill provided, please try again',
                    },
                },
            ],
        });
    }

    async exec(message, { skill }) {
        const shinobi = await Shinobi.findOne({ userID: message.author.id });
        if (!shinobi) {
            return message.reply(`You are not a Shinobi, use \`${this.client.shinobiCommandHandler.prefix} start\` to become one`);
        }

        const chance = Util.levelupChance(shinobi);

        if (chance) {
            shinobi[skill] += 1;
            shinobi.save()
                .then(saved => {
                    return message.reply(`Your ${skill} ranked up, now it's **${saved.ninjutsu}** level`);
                });
        } else {
            return message.reply('You trained, but nothing leveled up');
        }
    }
};