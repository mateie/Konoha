const { Command } = require('discord-akairo');

module.exports = class KonohaCommand extends Command {
    constructor(id, options) {
        super(id, options);

        this.aliases = [id, ...this.aliases];
        this.examples = [];
    }
};