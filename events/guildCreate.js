const { Listener } = require('discord-akairo');

module.exports = class GuildCreateEvent extends Listener {
    constructor() {
        super('guildCreate', {
            emitter: 'client',
            event: 'guildCreate',
        });
    }

    async exec(guild) {
        this.client.database.checkGuild(guild);
    }
};