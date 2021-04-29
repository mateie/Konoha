const { Manager } = require('@lavacord/discord.js');
const { LavasfyClient } = require('lavasfy');
const { lavalink, spotify } = require('../config');

module.exports = class KonohaMusic {
    constructor(client) {
        this.client = client;

        this.nodes = [
            {
                id: 'main',
                host: lavalink.host,
                port: lavalink.port,
                password: lavalink.password,
            },
        ];
    }

    async init() {
        this.manager = new Manager(this.client, this.nodes, {
            user: this.client.user.id,
        });

        this.spotify = spotify.enabled
            ? new LavasfyClient({
                clientID: spotify.id,
                clientSecret: spotify.secret,
                playlistLoadLimit: spotify.playlist_limit,
            }, [...[...this.manager.nodes.values()]])
            : null;

        await this.spotify.requestToken();

        this.manager
        .on('ready', node => this.client.logger('green', `Node ${node.id} ready`))
        .on('disconnect', (ws, node) => this.client.logger('yellow', `Node ${node.id} disconnected`))
        .on('reconnecting', node => this.client.logger('yellow', `Node ${node.id} reconnecting...`))
        .on('error', (err, node) => this.client.logger('red', `Node ${node.id} got an error: ${err.message}`));
    }
};