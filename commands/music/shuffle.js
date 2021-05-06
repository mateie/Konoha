const Command = require('../../struct/Command');
const Util = require('../../struct/Util');

module.exports = class ShuffleCommand extends Command {
    constructor() {
        super('shuffle', {
            category: 'music',
            aliases: ['shf'],
            description: 'Shuffle current queue',
        });
    }

    async exec(message) {
        try {
            const { music } = message.guild;

            if (!music.player && !music.player.playing) {
                return message.channel.send('**Currently not playing anything**');
            }

            if (!message.member.voice.channel) {
                return message.channel.send('**You must be in a voice channel**');
            }

            if (message.guild.me.voice.channel && !message.guild.me.voice.channel.equals(message.member.voice.channel)) {
                return message.channel.send(`You must be in **${message.guild.me.voice.channel}** to use Music commands`);
            }

            music.queue = Util.shuffle(music.queue);

            message.channel.send('**Queue successfully shuffled**');
        } catch (err) {
            this.client.log(new Error(err.message));
        }
    }
};