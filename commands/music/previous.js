const Command = require('../../struct/Command');
const Util = require('../../struct/Util');

module.exports = class PreviousCommand extends Command {
    constructor() {
        super('previous', {
            category: 'music',
            description: 'Play previous song',
            aliases: ['prev'],
        });
    }

    async exec(message) {
        const { music } = message.guild;

        if (!music.player) {
            return message.channel.send(Util.embed().setDescription('Currently not playing anything'));
        }

        if (!music.previous) {
            return message.channel.send(Util.embed().setDescription('No previous track'));
        }

        if (!message.member.voice.channel) {
            return message.channel.send(Util.embed().setDescription('You must be in a voice channel'));
        }

        if (message.guild.me.voice.channel && !message.guild.me.voice.channel.equals(message.member.voice.channel)) {
            return message.channel.send(Util.embed().setDescription(`You must be in ${message.guild.me.voice.channel} to use Music commands`));
        }

        try {
            music.queue.unshift(music.previous);
            await music.skip();
        } catch (err) {
            this.client.logger('red', err);
            message.channel.send(`An error occured: ${err.message}`);
        }
    }
};