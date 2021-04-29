const { Listener } = require('discord-akairo');
const { version } = require('../package.json');

module.exports = class ReadyEvent extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready',
        });
    }

    async exec() {
        this.client.logger('green', `${this.client.user.username} v${version} Running...`);

        setInterval(() => {
            this.client.database.checkGuilds(this.client.guilds.cache);
            this.client.database.checkUsers(this.client.users.cache);
        }, 30000);

        this.client.setPresence();
        this.client.music.init();

        const nodes = [...this.client.music.manager.nodes.values()];
        for(const node of nodes) {
            try {
                await node.connect();
            } catch(err) {
                this.client.music.manager.emit('error', err, node);
            }
        }
    }
};