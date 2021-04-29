const { AkairoClient, CommandHandler, ListenerHandler, InhibitorHandler } = require('discord-akairo');
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
            prefix: ['konoha', 'k'],
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

        this.inhibitorHandler = new InhibitorHandler(this, {
            directory: path.join(__dirname, '..', 'inhibitors'),
        });
    }

    setup() {
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.commandHandler.useListenerHandler(this.inhibitorHandler);

        this.listenerHandler.setEmitters({
            process: process,
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler,
            inhibitorHandler: this.inhibitorHandler,
        });

        this.commandHandler.loadAll();
        this.listenerHandler.loadAll();
        this.inhibitorHandler.loadAll();

        this.database = new Database(this);
        this.music = new Music(this);
        this.cards = Cards;
        this.xp = XP;
    }

    start() {
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