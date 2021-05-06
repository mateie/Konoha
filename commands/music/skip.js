const Command = require('../../struct/Command');

module.exports = class SkipCommand extends Command {
    constructor() {
        super('skip', {
            category: 'music',
            description: 'Skip a song',
            aliases: ['skipto'],
            args: [
                {
                    id: 'pos',
                    type: 'integer',
                    default: 0,
                },
            ],
        });
    }

    async exec(message, { pos }) {
        try {
            const { music } = message.guild;
            const skipTo = pos ? parseInt(pos, 10) : null;

            if (!music.player || !music.player.playing) {
                return message.channel.send('**Currently not playing anything**');
            }

            if (!message.member.voice.channel) {
                return message.channel.send('**You must be in a voice channel**');
            }

            if (message.guild.me.voice.channel && !message.guild.me.voice.channel.equals(message.member.voice.channel)) {
                return message.channel.send(`You must be on **${message.guild.voice.channel}** to use Music commands`);
            }

            if (skipTo !== null && (isNaN(skipTo) || skipTo < 1 || skipTo > music.queue.length)) {
                return message.channel.send('**Invalid number to skip to**');
            }

            await music.skip(skipTo);
        } catch (err) {
            this.client.log(new Error(err.message));
        }
    }
};