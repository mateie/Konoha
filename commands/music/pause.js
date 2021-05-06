const Command = require('../../struct/Command');

module.exports = class PauseCommand extends Command {
    constructor() {
        super('pause', {
            category: 'music',
            description: 'Pause the Music Player',
        });
    }

    async exec(message) {
        try {
            const { music } = message.guild;

            if (!music.player || !music.player.playing) {
                return message.channel.send('**Currently not playing anything**');
            }

            if (!message.member.voice.channel) {
                return message.channel.send('**You must be in a voice channel**');
            }

            if (message.guild.me.voice.channel && !message.guild.me.voice.channel.equals(message.member.voice.channel)) {
                return message.channel.send(`You must be on **${message.guild.me.voice.channel}** to pause the Music commands`);
            }

            await music.pause();
        } catch (err) {
            this.client.log(new Error(err.message));
        }
    }
};