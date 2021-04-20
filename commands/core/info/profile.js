const Command = require('../../../struct/Command');
const { MessageAttachment } = require('discord.js');

module.exports = class ProfileCommand extends Command {
    constructor() {
        super('profile', {
            category: 'info',
            aliases: ['pf', 'rank'],
            description: 'Shows your current XP and Rank',
            args: [
                {
                    id: 'member',
                    type: 'member',
                    default: message => message.member,
                },
            ],
            channel: 'guild',
        });
    }

    async exec(message, { member }) {
        const image = await this.client.cards.getRankCard(member);
        const attachment = new MessageAttachment(image, `Rank-${member.user.username}.png`);
        message.channel.send(attachment);
    }
};