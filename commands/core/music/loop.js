const Command = require('../../../struct/Command');
const Util = require('../../../struct/Util');

module.exports = class LoopCommand extends Command {
    constructor() {
        super('loop', {
            category: 'music',
            aliases: ['repeat'],
            description: 'Loop current song',
        });
    }

    exec(message) {
        const { music } = message.guild;

        if (!music.player) {
            return message.channel.send(Util.embed().setDescription('Currently not playing anything'));
        }

        if (!message.member.voice.channel) {
            return message.channel.send(Util.embed().setDescription('You must be in a voice channel'));
        }

        if (message.guild.me.voice.channel && !message.guild.me.voice.channel.equals(message.member.voice.channel)) {
            return message.channel.send(Util.embed().setDescription(`You must be on ${message.guild.me.voice.channel} to use Music commands`));
        }

        music.toggleLoop();

        message.channel.send(Util.embed().setDescription(`Loop ${music.loop ? 'enabled' : 'disbled'}`));
    }
};