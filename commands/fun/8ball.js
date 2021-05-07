const Command = require('../../struct/Command');
const Util = require('../../struct/Util');

module.exports = class EightBallCommand extends Command {
    constructor() {
        super('8ball', {
            category: 'fun',
            description: 'Ask a question to 8Ball',
            aliases: ['eight-ball', 'eightball'],
            args: [
                {
                    id: 'question',
                    type: 'string',
                    match: 'rest',
                    prompt: {
                        start: 'Ask a question',
                    },
                },
            ],
        });
    }

    async exec(message, { question }) {
        try {
            const replies = [
                'Maybe.',
                'Certainly not.',
                'I hope so.',
                'Not in your wildest dreams.',
                'There is a good chance.',
                'Quite likely.',
                'I think so.',
                'I hope not.',
                'I hope so.',
                'Never!',
                'Pfft.',
                'Sorry, bucko.',
                'Hell, yes.',
                'Hell to the no.',
                'The future is bleak.',
                'The future is uncertain.',
                'I would rather not say.',
                'Who cares?',
                'Possibly.',
                'Never, ever, ever.',
                'There is a small chance.',
                'Yes!',
                'lol no.',
                'There is a high probability.',
                'What difference does it makes?',
                'Not my problem.',
                'Ask someone else.',
            ];

            const answer = replies[Math.floor(Math.random() * replies.length)];

            const embed = Util.embed()
            .setTitle(question)
            .setDescription(`:8ball: **${answer}**`);

            await message.channel.send(embed);
        } catch(err) {
            this.client.log(new Error(err.message));
        }
    }
};