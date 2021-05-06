const Command = require('../../struct/Command');

module.exports = class DisconnectCommand extends Command {
    constructor() {
        super('disconnect', {
            category: 'music',
            aliases: ['dc', 'leave'],
            description: 'Make bot leave the channel',
        });
    }

    async exec(message) {
        const { music } = message.guild;

        if (!message.member.voice.channel) return message.channel.send('**You must be in a voice channel**');

        if (message.guild.me.voice.channel && !message.guild.me.voice.channel.equals(message.member.voice.channel)) {
            return message.channel.send(`You have to be in **${message.guild.me.voice.channel}** to use Music commands`);
        }

        if (!music.node || !music.node.connected) {
            return message.channel.send('--Lavalink Node is not connected--');
        }

        await music.leave(message.guild);
    }
};