const { AkairoClient, CommandHandler, ListenerHandler, InhibitorHandler } = require('discord-akairo');
const path = require('path');
const chalk = require('chalk');
const moment = require('moment');

const { owners, token, default_prefix } = require('../config');

const Database = require('./Database');
const Music = require('./Music');

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

        this.inhibitorHandler = new InhibitorHandler(this, {
            directory: path.join(__dirname, '..', 'inhibitors'),
        });
    }

    setup() {
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);

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

    log(message) {
        const time = moment().format('hh:mm A');
        if(message instanceof Error) {
            console.error(chalk.red(`[${time}] ${message}`));
        }

        console.log(chalk.green(`[${time}] ${message}`));
    }
};