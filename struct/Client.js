const { AkairoClient, CommandHandler, ListenerHandler } = require('discord-akairo');
const { Collection } = require('discord.js');
const path = require('path');
const chalk = require('chalk');
const moment = require('moment');

const { OWNER, SO, TOKEN } = process.env;

const Database = require('./Database');
const Music = require('./Music');
const Cards = require('./Cards');
const XP = require('./users/XP');

module.exports = class KonohaClient extends AkairoClient {
    constructor() {
        super({
            ownerID: [OWNER, SO],
        }, {
            disableMentions: 'everyone',
        });

        this.commandHandler = new CommandHandler(this, {
            directory: path.join(__dirname, '..', 'commands'),
            prefix: 'k ',
            allowMention: true,
            fetchMembers: true,
            blockBots: true,
            commandUtil: true,
            commandUtilLifetime: 3e5,
            commandUtilSweepInterval: 9e5,
            handleEdits: true,
            defaultCooldown: 2500,
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: path.join(__dirname, '..', 'events'),
        });

        this.games = new Collection();

    }

    setup() {
        this.commandHandler.useListenerHandler(this.listenerHandler);

        this.listenerHandler.setEmitters({
            process: process,
        });

        this.commandHandler.loadAll();
        this.listenerHandler.loadAll();

        this.database = new Database(this);
        this.music = new Music(this);
        this.cards = Cards;
        this.xp = XP;
    }

    async start() {
        this.setup();
        return super.login(TOKEN);
    }

    setPresence() {
        this.user.setPresence({
            activity: {
                name: `${this.commandHandler.prefix} help`,
                type: 'LISTENING',
            },
            status: 'online',
        });
    }

    logger(color, log) {
        console.log(chalk[color](`[${moment(new Date()).format('h:mm:ss a')}] ${log}`));
    }
};