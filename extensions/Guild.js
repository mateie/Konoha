const { Structures } = require('discord.js');
const MusicHandler = require('../struct/music/Handler');

const Guild = Structures.get('Guild');

class KonohaGuild extends Guild {
    constructor(client, data) {
        super(client, data);

        this.handleMusic();
    }

    handleMusic() {
        this.music = new MusicHandler(this);
    }
}

Structures.extend('Guild', () => KonohaGuild);