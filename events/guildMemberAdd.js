const { Listener } = require('discord-akairo');

module.exports = class GuildMemberAddEvent extends Listener {
    constructor() {
        super('guildMemberAdd', {
            emitter: 'client',
            event: 'guildMemberAdd',
        });
    }

    async exec(member) {
        this.client.database.checkUser(member.user);
    }
};