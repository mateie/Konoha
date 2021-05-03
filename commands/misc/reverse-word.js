const Command = require('../../struct/Command');

module.exports = class ReverseWordCommand extends Command {
    constructor() {
        super('reverse-word', {
            category: 'misc',
            aliases: ['reverse'],
            description: 'Reverses provided word',
            args: [
                {
                    id: 'word',
                    type: 'string',
                    prompt: {
                        start: 'What word do you want to reverse?',
                    },
                },
            ],
        });
    }

    exec(message, { word }) {
        const reversed = word.split('').reverse().join('');
        message.channel.send(reversed);
    }
};