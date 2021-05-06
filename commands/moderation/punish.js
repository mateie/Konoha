const Command = require('../../struct/Command');
const mongoose = require('mongoose');
const Guild = mongoose.model('Guild');

module.exports = class PunishCommand extends Command {
    constructor() {
        super('punish', {
            category: 'moderation',
            description: 'Punish a member',
            args: [
                {
                    id: 'member',
                    type: 'member',
                    prompt: {
                        start: 'Who do you want to punish?',
                        retry: 'Invalid member provided, please try again',
                    },
                },
            ],
        });
    }

    async exec(message, { member }) {
        try {
            const guild = await Guild.findOne({ id: message.guild.id }).lean();
            const warns = guild.warns.find(warn => warn.member === member.id);

            if (!warns) return message.channel.send(`${member} doesn't have any warns`);
            if (!guild.settings.punish.enabled) return message.channel.send('Punishing members is not enabled on this server');

            if (warns.total < guild.settings.punish.mute) {
                return message.channel.send(`${member} doesn't have enough warns to be punished, their total warns ***${warns.total}***`);
            } else if (warns.total >= guild.settings.punish.mute && warns.total < guild.settings.punish.kick) {
                const Mute = require('./mute');
                const mute = new Mute();
                mute.exec(message, { member, reason: `Punished mute by ${message.author.name}` });
            } else if (warns.total >= guild.settings.punish.kick && warns.total < guild.settings.punish.ban) {
                const Kick = require('./kick');
                const kick = new Kick();
                kick.exec(message, { member, reason: `Punished kick by ${message.author.name}` });
            } else if (warns.total >= guild.settings.punish.ban) {
                const Ban = require('./ban');
                const ban = new Ban();
                ban.exec(message, { member, messages: 7, reason: `Punished ban by ${message.author.name}` });
            }
        } catch(err) {
            this.client.log(new Error(err.message));
        }
    }
};