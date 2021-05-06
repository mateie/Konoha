const { Inhibitor } = require('discord-akairo');
const mongoose = require('mongoose');
const Guild = mongoose.model('Guild');

module.exports = class CommandBlockedInhibitor extends Inhibitor {
    constructor() {
        super('commandBlocked', {
            reason: 'commandBlocked',
        });
    }

    async exec(message) {
        try {
            const { settings } = await Guild.findOne({ id: message.guild.id });
            if(!settings.strict.enabled) return false;
            const channel = message.guild.channels.cache.get(settings.strict.channel);
            if(!channel) return false;
            message.channel.send(`You can only use commands in ${channel}`);
            return true;
        } catch(err) {
            this.client.log(new Error(err.message));
            return false;
        }

    }
};