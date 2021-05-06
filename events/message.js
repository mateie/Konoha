const { Listener } = require('discord-akairo');

module.exports = class MessageEvent extends Listener {
    constructor() {
        super('message', {
            emitter: 'client',
            event: 'message',
        });
    }

    async exec(message) {
        if(
            message.content.includes(this.client.commandHandler.prefix) ||
            message.channel.type !== 'text' ||
            !message.guild.available ||
            message.author.bot
        ) {
            return;
        }
    }
};