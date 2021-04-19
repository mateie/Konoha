const Command = require('../../struct/Command');
const mongoose = require('mongoose');
const Guild = mongoose.model('Guild');

module.exports = class TogglesCommand extends Command {
    constructor() {
        super('toggles', {
            category: 'settings',
            aliases: ['tg', 'tgs', 'toggle'],
            description: 'Toggle settings in the database',
            args: [
                {
                    id: 'section',
                    type: ['strict', 'logs'],
                    prompt: {
                        start: 'What setting do you want to toggle?',
                        retry: 'Invalid setting provided, please try again',
                    },
                },
            ],
        });
    }

    async exec(message, { section }) {
        const guild = await Guild.findOne({ id: message.guild.id });
        const toggle = guild.settings[section].enabled;
        guild.settings[section].enabled = !toggle;

        guild.save()
            .then(updated => message.channel.send(`**${section}** was **${updated.settings[section].enabled ? '✅ Enabled' : '⛔ Disabled'}**`))
            .catch(err => {
                this.client.logger('red', err);
                message.channel.send('An error occured');
            });
    }
};