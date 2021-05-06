const Command = require('../../struct/Command');
const Util = require('../../struct/Util');

module.exports = class VolumeCommand extends Command {
    constructor() {
        super('volume', {
            category: 'music',
            aliases: ['vol'],
            description: 'Change Volume of the Music Player',
            args: [
                {
                    id: 'newVol',
                    type: 'integer',
                    default: null,
                },
            ],
        });
    }

    async exec(message, { newVol }) {
        try {
            const { music } = message.guild;

            newVol = parseInt(newVol, 10);

            if (!music.player || !music.player.playing) return message.channel.send('**Currently not playing anything**');

            if (isNaN(newVol)) {
                message.channel.send(Util.embed().setDescription(`Current Volume \`${music.volume}\``));
            } else {
                if (!message.member.voice.channel) return message.channel.send('**You must be in a voice channel**');

                if (!message.guild.me.voice.channel && !message.guild.me.voice.channel.equals(message.member.voice.channel)) return message.channel.send(`You must be on **${message.guild.me.voice.channel}** to use Music commands`);

                if (newVol < 0 || newVol > 150) return message.channel.send('You can only set the volume from 0 to 150');

                await music.setVolume(newVol);
                message.channel.send(`Volume set to \`${music.volume}\``);
            }
        } catch (err) {
            this.client.log(new Error(err.message));
        }
    }
};