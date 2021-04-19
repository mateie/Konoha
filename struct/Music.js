const { Manager } = require('@lavacord/discord.js');
const { LavasfyClient } = require('lavasfy');
const {
    LAVA_HOST,
    LAVA_PORT,
    LAVA_PASS,
    ENABLE_SPOTIFY,
    SPOTIFY_ID,
    SPOTIFY_SECRET,
    SPOTIFY_PLAYLIST_PAGE_LIMIT,
} = process.env;

module.exports = class KonohaMusic {
    constructor(client) {
        this.client = client;

        this.nodes = [
            {
                id: 'main',
                host: LAVA_HOST,
                port: LAVA_PORT,
                password: LAVA_PASS,
            },
        ];
    }

    async init() {
        this.manager = new Manager(this.client, this.nodes, {
            user: this.client.user.id,
        });

        this.spotify = ENABLE_SPOTIFY === 'true'
            ? new LavasfyClient({
                clientID: SPOTIFY_ID,
                clientSecret: SPOTIFY_SECRET,
                playlistLoadLimit: SPOTIFY_PLAYLIST_PAGE_LIMIT,
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