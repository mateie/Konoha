const Command = require('../../../struct/Command');
const mongoose = require('mongoose');
const Guild = mongoose.model('Guild');
const Util = require('../../../struct/Util');

module.exports = class MuteCommand extends Command {
    constructor() {
        super('mute', {
            category: 'moderation',
            description: 'Mute a member',
            args: [
                {
                    id: 'member',
                    type: 'member',
                    prompt: {
                        start: 'Who do you want to mute?',
                        retry: 'Invalid member provided, please try again',
                    },
                },
                {
                    id: 'reason',
                    type: 'string',
                    default: 'No reason provided',
                },
            ],
        });
    }

    async exec(message, { member, reason }) {
        if (member.user.bot) return message.channel.send('You cannot mute bots');
        let muteRole = message.guild.roles.cache.find(role => role.name == 'Muted');
        if (!muteRole) {
            try {
                muteRole = await message.guild.roles.create({
                    data: {
                        name: 'Muted',
                        color: '#000000',
                        permissions: [],
                    },
                });

                message.guild.channels.cache.forEach(async channel => {
                    await channel.createOverwrite(muteRole, {
                        SEND_MESSAGES: false,
                        MANAGE_MESSAGES: false,
                        READ_MESSAGES: false,
                        ADD_REACTIONS: false,
                    });
                });
            } catch (err) {
                this.client.logger('red', err);
            }
        }

        if (member.roles.cache.has(muteRole.id)) return message.channel.send(`**${member.user.username}#${member.user.discriminator}** is already muted`);
        member.roles.add(muteRole)
            .then(async () => {
                const guild = await Guild.findOne({ id: message.guild.id });
                const mute = {
                    member: member.id,
                    by: message.author.id,
                    reason: reason,
                    timestamp: message.createdTimestamp,
                };

                guild.mutes.push(mute);

                guild.save().then(() => {
                    const muteEmbed = Util.embed()
                        .setTitle(`You have been muted on ${message.guild.name}`)
                        .setThumbnail(message.guild.iconURL())
                        .addFields([
                            { name: 'Warned by', value: message.author.username, inline: true },
                            { name: 'Reason', value: reason, inline: true },
                        ]);

                    const infoMute = Util.embed()
                        .setAuthor(message.author.username, message.author.displayAvatarURL({ format: 'png' }))
                        .setTitle(`${message.author.username} muted ${member.user.username}`)
                        .setDescription(`***Reason***: *${reason}*`);

                    message.channel.send(infoMute);
                    member.send(muteEmbed);
                });
            });
    }
};