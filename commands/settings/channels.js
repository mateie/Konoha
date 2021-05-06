const Command = require('../../struct/Command');
const mongoose = require('mongoose');
const Guild = mongoose.model('Guild');

module.exports = class ChannelsCommand extends Command {
    constructor() {
        super('channels', {
            category: 'settings',
            aliases: ['ch', 'chs', 'channel'],
            args: [
                {
                    id: 'section',
                    type: ['strict', 'logs'],
                    prompt: {
                        start: 'What setting do you want to change?',
                        retry: 'Invalid setting provided, please try again',
                    },
                },
                {
                    id: 'value',
                    type: 'textChannel',
                    default: null,
                },
            ],
        });
    }

    async exec(message, { section, value }) {
        try {
            const guild = await Guild.findOne({ id: message.guild.id });
            const setting = guild.settings[section];
            if (!value) {
                return message.channel.send(`Current value for **${section}** is ${setting.channel !== null ? message.guild.channels.cache.get(setting.channel) : '**None**'}`);
            }

            setting.channel = value.id;
            guild.save()
                .then(() => message.channel.send(`**${section}**'s channel was set to ${value}`))
                .catch(err => {
                    this.client.log(new Error(err.message));
                });
        } catch(err) {
            this.client.log(new Error(err.message));
        }
    }
};