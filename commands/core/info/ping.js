const Command = require('../../../struct/Command');
const { embed } = require('../../../struct/Util');

module.exports = class PingCommand extends Command {
    constructor() {
        super('ping', {
            category: 'info',
            desription: 'Connects to the API directly from the Bot and checks its Response Time',
        });
    }

    async exec(message) {
        const pingMessage = await message.channel.send(embed().setDescription('Pinging...'));
        return pingMessage.edit(embed().setDescription(`The message took ${(pingMessage.editedTimestamp || pingMessage.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)}ms to send. API Response time is ${this.client.ws.ping ? `${Math.round(this.client.ws.ping)}ms` : 'unknown'}`));
    }
};