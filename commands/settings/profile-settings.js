const Command = require('../../struct/Command');
const mongoose = require('mongoose');
const toHex = require('colornames');
const toName = require('color-to-name');
const fetch = require('node-fetch');

const User = mongoose.model('User');

module.exports = class ProfileSettingsCommand extends Command {
    constructor() {
        super('profile-settings', {
            category: 'settings',
            aliases: ['pf-settings', 'pfs', 'pf-s'],
            description: 'Customize your profile settings',
            args: [
                {
                    id: 'section',
                    type: ['background', 'text', 'progressbar'],
                    prompt: {
                        start: 'What do you want to customize on your profile?',
                        retry: 'Invalid setting provided, please try again',
                    },
                },
                {
                    id: 'color',
                    type: 'string',
                    default: null,
                },
            ],
        });
    }

    async exec(message, { section, color }) {
        try {
            const attachment = message.attachments.first();

            const user = await User.findOne({ id: message.member.id });
            if (attachment && section == 'background') {
                if (attachment.name.includes('png') || attachment.name.includes('jpg')) {
                    const image = await fetch(attachment.url);
                    const buffer = await image.buffer();
                    user.card[section] = buffer;
                    user.save()
                        .then(() => message.reply(`Your profile's ${section} was updated`))
                        .catch(err => {
                            console.error(err);
                            message.reply(`Your profile's **${section}** was not changed because an error occured`);
                        });
                } else {
                    return message.reply('File you provided is not valid image, please provide **.jpg** or **.png** file');
                }
            } else if (!color) {
                const currentColor = toName.findClosestColor(user.card[section]);

                return message.reply(`Your profile's current **${section}** color is approximately **${currentColor.name}**`);
            } else {
                const hex = toHex(color);

                if (!hex) {
                    return message.reply(`**${color}** color doesn't exist, please provide a valid one`);
                }

                user.card[section] = hex;
                user.save()
                    .then(() => message.reply(`Your profile's **${section}** was changed to **${color}**`))
                    .catch(err => {
                        this.client.log(new Error(err.message));
                        message.reply(`Your profile's **${section}** was not changed to **${color}**, an error has occured`);
                    });
            }
        } catch(err) {
            this.client.log(new Error(err.message));
        }
    }
};