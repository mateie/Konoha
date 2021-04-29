const Command = require('../../struct/Command');
const Util = require('../../struct/Util');

module.exports = class MoveCommand extends Command {
    constructor() {
        super('move', {
            category: 'music',
            aliases: ['mv'],
            description: 'Move a track to a certain position in queue',
            args: [
                {
                    id: 'from',
                    type: 'integer',
                    prompt: {
                        start: 'Which track do you want to move?',
                        retry: 'Invalid response, please try again',
                    },
                },
                {
                    id: 'to',
                    type: 'integer',
                    prompt: {
                        start: 'Where do you want to move it?',
                        retry: 'Invalid response, please try again',
                    },
                },
            ],
        });
    }

    async exec(message, { from, to }) {
        const { music } = message.guild;

        if (!music.player || !music.player.playing) {
            return message.channel.send(Util.embed().setDescription('Currently not playing anything'));
        }

        if (!music.queue.length) {
            return message.channel.send(Util.embed().setDescription('Queue is empty'));
        }

        if (!message.member.voice.channel) {
            return message.channel.send(Util.embed().setDescription('You must be in a voice channel'));
        }

        if (message.guild.me.voice.channel && !message.guild.me.voice.channel.equals(message.member.voice.channel)) {
            return message.channel.send(Util.embed().setDescription(`You must be in ${message.guild.me.voice.channel} to move a song`));
        }


        if (from === to || (isNaN(from) || from < 1 || from > music.queue.length) || (isNaN(to) || to < 1 || to > music.queue.length)) {
            return message.channel.send(Util.embed().setDescription('Number is invalid or exceeds queue length'));
        }

        const moved = music.queue[from - 1];

        Util.moveArrayElement(music.queue, from - 1, to - 1);

        message.channel.send(Util.embed().setDescription(`Moved **${moved.info.title}** to \`${to}\``));
    }
};