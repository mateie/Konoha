const { AkairoClient, CommandHandler, ListenerHandler } = require('discord-akairo');
const path = require('path');
const chalk = require('chalk');
const moment = require('moment');
const mongoose = require('mongoose');

const Guild = mongoose.model('Guild');

const { owners, token, default_prefix } = require('../config');

const Database = require('./Database');
const Music = require('./Music');
const Cards = require('./Cards');
const XP = require('./users/XP');
const Provider = require('./Provider');

module.exports = class KonohaClient extends AkairoClient {
    constructor() {
        super({
            ownerID: owners,
        }, {
            disableMentions: 'everyone',
        });

        this.commandHandler = new CommandHandler(this, {
            directory: path.join(__dirname, '..', 'commands'),
            prefix: default_prefix,
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

        this.guilds.settings = new Provider(Guild);
    }

    setup() {
        this.commandHandler.useListenerHandler(this.listenerHandler);

        this.listenerHandler.setEmitters({
            process: process,
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler,
        });

        this.commandHandler.loadAll();
        this.listenerHandler.loadAll();

        this.database = new Database(this);
        this.music = new Music(this);
        this.cards = Cards;
        this.xp = XP;
    }

    start() {
        this.setup();
        return super.login(token);
    }

    setPresence() {
        this.user.setPresence({
            activity: {
                name: 'Over the Village',
                type: 'WATCHING',
            },
            status: 'online',
        });
    }

    logger(color, log) {
        console.log(chalk[color](`[${moment(new Date()).format('h:mm:ss a')}] ${log}`));
    }
};