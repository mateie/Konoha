const Command = require('../../../struct/Command');
const Util = require('../../../struct/Util');

module.exports = class PauseCommand extends Command {
    constructor() {
        super('pause', {
            category: 'music',
            description: 'Pause the Music Player',
        });
    }

    async run(message) {
        const { music } = message.guild;

        if (!music.player || !music.player.playing) {
            return message.channel.send(Util.embed().setDescription('Currently not playing anything'));
        }

        if (!message.member.voice.channel) {
            return message.channel.send(Util.embed().setDescription('You must be in a voice channel'));
        }

        if (message.guild.me.voice.channel && !message.guild.me.voice.channel.equals(message.member.voice.channel)) {
            return message.channel.send(Util.embed().setDescription(`You must be on ${message.guild.me.voice.channel} to pause the Music commands`));
        }

        try {
            await music.pause();
        } catch (err) {
            this.client.logger('red', err);
            message.channel.send(`An error occured: ${err.message}`);
        }
    }
};