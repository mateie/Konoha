const Command = require('../../struct/Command');

module.exports = class PreviousCommand extends Command {
    constructor() {
        super('previous', {
            category: 'music',
            description: 'Play previous song',
            aliases: ['prev'],
        });
    }

    async exec(message) {
        try {
            const { music } = message.guild;

            if (!music.player) {
                return message.channel.send('**Currently not playing anything**');
            }

            if (!music.previous) {
                return message.channel.send('**No previous track**');
            }

            if (!message.member.voice.channel) {
                return message.channel.send('**You must be in a voice channel**');
            }

            if (message.guild.me.voice.channel && !message.guild.me.voice.channel.equals(message.member.voice.channel)) {
                return message.channel.send(`You must be in **${message.guild.me.voice.channel}** to use Music commands`);
            }

            music.queue.unshift(music.previous);
            await music.skip();
        } catch (err) {
            this.client.log(new Error(err.message));
        }
    }
};