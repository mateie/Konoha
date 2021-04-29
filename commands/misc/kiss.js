const Command = require('../../struct/Command');
const Util = require('../../struct/Util');
const axios = require('axios');
const { owners } = require('../../config');

module.exports = class KissCommand extends Command {
    constructor() {
        super('kiss', {
            category: 'misc',
            description: 'Kiss Somebody',
            args: [
                {
                    key: 'mention',
                    type: 'member',
                    prompt: {
                        start: 'Who do you want to kiss?',
                        retry: 'You want to kiss that? Try again...',
                    },
                },
            ],
        });
    }

    async exec(message, { mention }) {
        const embed = Util.embed();

        if (message.author.id !== owners[0] && mention.user.id == owners[1]) {
            return message.channel.send('You can\'t ;)');
        }

        if (message.author.id == mention.user.id) {
            embed.setTitle(`${message.author.username} kissed himself, what a weirdo o_O`);
        }

        if (message.author.id == owners[0] && mention.user.id == owners[1]) {
            embed.setTitle(`${message.author.username} kissed ${mention.user.username} :purple_heart:`);
        } else {
            embed.setTitle(`${message.author.username} kissed ${mention.user.username}`);
        }

        const { data } = await axios.get('https://nekos.life/api/kiss');
        embed.setImage(data.url);

        message.channel.send(embed);
    }
};