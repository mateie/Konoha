const Command = require('../../struct/Command');
const mongoose = require('mongoose');
const Guild = mongoose.model('Guild');
const Util = require('../../struct/Util');

module.exports = class UnmuteCommand extends Command {
    constructor() {
        super('unmute', {
            category: 'moderation',
            description: 'Unmute a member',
            args: [
                {
                    id: 'member',
                    type: 'member',
                    prompt: {
                        start: 'Who do you want to unmute?',
                        retry: 'Invalid member provided, please try again',
                    },
                },
            ],
        });
    }

    async exec(message, { member }) {
        try {
            const muteRole = message.guild.roles.cache.find(role => role.name == 'Muted');
            if (!muteRole) {
                return message.channel.send('Mute role does not exist');
            }

            if (!member.roles.cache.has(muteRole.id)) return message.channel.send(`**${member.user.username}#${member.user.discriminator}** is not muted`);
            member.roles.remove(muteRole)
                .then(async () => {
                    const guild = await Guild.findOne({ id: message.guild.id });
                    const mute = guild.mutes.filter(mute => mute.member != member.id);

                    guild.mutes = mute;

                    guild.save()
                        .then(() => {
                            const embed = Util.embed()
                                .setAuthor(message.author.username, message.author.displayAvatarURL({ format: 'png' }))
                                .setTitle(`${message.author.username} unmuted ${member.user.username}`);

                            message.channel.send(embed);
                        });
                });
        } catch(err) {
            this.client.log(new Error(err.message));
        }
    }
};