const Command = require('../../struct/Command');
const Util = require('../../struct/Util');

module.exports = class SeekCommand extends Command {
    constructor() {
        super('seek', {
            category: 'music',
            description: 'Seek duration on the current track',
            args: [
                {
                    id: 'duration',
                    type: /^[0-5]?[0-9](:[0-5][0-9]){1,2}$/i,
                    prompt: {
                        start: 'Where do you want to seek?',
                        retry: 'Invalid duration provided, please try again',
                    },
                },
            ],
        });
    }

    async exec(message, { duration }) {
        try {
        const { music } = message.guild;
        const durationPattern = /^[0-5]?[0-9](:[0-5][0-9]){1,2}$/;

        if (!music.player && !music.player.playing) {
            return message.channel.send('**Currently not playing anything**');
        }

        if (!message.member.voice.channel) {
            return message.channel.send('**You must be in a voice channel**');
        }

        if (message.guild.me.voice.channel && !message.guild.me.voice.channel.equals(message.member.voice.channel)) {
            return message.channel.send(`You must be in **${message.guild.me.voice.channel}** to use Music commands`);
        }

        if (!music.current.info.isSeekable) {
            return message.channel.send('**Current track is not seekable**');
        }

        if (!durationPattern.test(duration)) {
            return message.channel.send('**You provided an invalid duration**');
        }

        const durationMs = Util.durationToMs(duration);
        if (durationMs > music.current.info.length) {
            return message.channel.send('**The duration you provided exceeds the duration of the current track**');
        }

            await music.player.seek(durationMs);
            message.channel.send(Util.embed().setDescription(`Seeked to *${duration}*`));
        } catch (err) {
            this.client.log(new Error(err.message));
        }
    }
};