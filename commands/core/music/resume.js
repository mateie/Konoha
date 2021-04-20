const Command = require('../../../struct/Command');
const Util = require('../../../struct/Util');

module.exports = class ResumeCommand extends Command {
    constructor() {
        super('resume', {
            category: 'music',
            description: 'Resume the Music Player',
        });
    }

    async exec(message) {
        const { music } = message.guild;

        if (!music.player || !music.player.playing) {
            return message.channel.send(Util.embed().setDescription('Currently not playing anything'));
        }

        if (!message.member.voice.channel) {
            return message.channel.send(Util.embed().setDescription('You must be in a voice channel'));
        }

        if (message.guild.me.voice.channel && !message.guild.me.voice.channel.equals(message.member.voice.channel)) {
            return message.channel.send(Util.embed().setDescription(`You must be in ${message.guild.me.voice.channel} to use Music commands`));
        }

        try {
            await music.resume();
        } catch (err) {
            this.client.logger('red', err);
            message.channel.send(`An error occured: ${err.message}`);
        }
    }
};