const Command = require('../../struct/Command');
const Util = require('../../struct/Util');
const moment = require('moment');
require('moment-duration-format');

const { version: djsVersion } = require('discord.js');
const { version: akairoVersion } = require('discord-akairo');
const { version, dependencies, optionalDependencies } = require('../../package.json');
const deps = { ...dependencies, ...optionalDependencies };
const { GITHUB_REPO_USERNAME, GITHUB_REPO_NAME, INVITE_LINK } = process.env;
const source = GITHUB_REPO_USERNAME && GITHUB_REPO_NAME;

module.exports = class AboutCommand extends Command {
    constructor() {
        super('about', {
            category: 'info',
            description: 'Provides bot\'s detailed information',
        });
    }

    exec(message) {
        const repo = `https://github.com/${GITHUB_REPO_USERNAME}/${GITHUB_REPO_NAME}`;
        const owners = Util.getOwners(this.client);
        const embed = Util.embed()
        .setAuthor(this.client.user.username, this.client.user.displayAvatarURL({ format: 'png', dynamic: true }))
        .setThumbnail(this.client.user.displayAvatarURL({ format: 'png', dynamic: true }))
        .addField('Servers', Util.formatNumber(this.client.guilds.cache.size), true)
        .addField('Categories', Util.formatNumber(this.client.commandHandler.categories.size), true)
        .addField('Commands', Util.formatNumber(this.client.commandHandler.modules.size), true)
        .addField('Source Code', source ? Util.embedURL('GitHub', repo) : 'N/A', true)
        .addField('Memory Usage', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
        .addField('Uptime', moment.duration(this.client.uptime).format('d:hh:mm:ss'), true)
        .addField('Invite', INVITE_LINK ? Util.embedURL('Link', INVITE_LINK) : 'N/A', true)
        .addField('Version', `v${version}`, true)
        .addField('Node.js', process.version, true)
        .addField('Discord.js', `v${djsVersion}`, true)
        .addField('Akairo', `v${akairoVersion}`, true)
        .addField('Dependencies', Object.keys(deps).sort().join(', '), true)
        .setFooter(`Made by ${owners}`);


        return message.channel.send(embed);
    }
};