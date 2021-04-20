const Command = require('../../../struct/Command');
const Util = require('../../../struct/Util');

module.exports = class RemoveCommand extends Command {
    constructor() {
        super('remove', {
            category: 'music',
            description: 'Remove a song from queue',
            aliases: ['rm'],
            args: [
                {
                    id: 'pos',
                    type: 'integer',
                    prompt: {
                        start: 'What track do you want to remove',
                        retry: 'Invalid response, try again',
                    },
                },
            ],
        });
    }

    async exec(message, { pos }) {
        const { music } = message.guild;

        if (!music.player || !music.player.playing) {
            return message.channel.send(Util.embed().setDescription('Currently not playing anything'));
        }

        if (!message.member.voice.channel) {
            return message.channel.send(Util.embed().setDescription('You must be in a voice channel'));
        }

        if (message.guild.me.voice.channel && !message.guild.me.voice.channel.equals(message.member.voice.channel)) {
            return message.channel.send(Util.embed().setDescription(`You must be on ${message.guild.voice.channel} to use Music commands`));
        }

        if (isNaN(pos) || pos < 1 || pos > music.queue.length) {
            return message.channel.send(Util.embed().setDescription('Invalid number or exceeds music queue'));
        }

        const removed = music.queue.splice(--pos, 1)[0];
        message.channel.send(Util.embed().setDescription(`Removed **${removed.info.title}** from the queue`));
    }
};