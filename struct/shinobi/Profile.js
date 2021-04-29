const mongoose = require('mongoose');
const Shinobi = mongoose.model('Shinobi');
const Util = require('../../struct/Util');
const Canvas = require('canvas');
const { clans } = require('../../assets/json/shinobi.json');
const { MessageAttachment } = require('discord.js');

module.exports = class ShinobiProfile {
    static async createProfile(member) {
        const shinobi = await Shinobi.findOne({ userId: member.id });

        if (!shinobi) {
            const clan = clans[Math.floor(Math.random() * clans.length)];

            const newShinobi = new Shinobi({
                userId: member.id,
                clan: clan.name,
                chakra: clan.chakra,
            });

            return await newShinobi.save();
        }

        return false;
    }

    static async getProfile(member) {
        const shinobi = await Shinobi.findOne({ userId: member.id });

        if(!shinobi) {
            return false;
        }

        return shinobi;
    }

    static async getProfileEmbed(member) {
        const shinobi = await Shinobi.findOne({ userId: member.id }).lean();

        if (!shinobi) {
            return false;
        }

        const embed = Util.embed()
            .setAuthor(`${member.displayName}'s Profile`, member.user.displayAvatarURL({ format: 'png' }))
            .setDescription(`
                Born in **${shinobi.clan} Clan**\n
                ***HP***: ${shinobi.hp} ***Chakra***: ${shinobi.chakra} ***Ryo***: ${shinobi.ryo}\n
                ***Ninjutsus Learned***: ${shinobi.ninjutsu.length}
                ***Genjutsus Learned***: ${shinobi.genjutsu.length}
                ***Taijutsus Learned***: ${shinobi.taijutsu.length}
            `)
            .attachFiles([`${process.cwd()}/assets/images/clans/${shinobi.clan}.png`])
            .setThumbnail(`attachment://${shinobi.clan}.png`)
            .setFooter(`Level - ${shinobi.level} : XP - ${shinobi.xp} : Points: ${shinobi.points}`);

        return embed;
    }

    // Will be used later
    static async getProfileCard(member) {
        const shinobi = await Shinobi.findOne({ userId: member.id }).lean();

        if (!shinobi) {
            return false;
        }

        Canvas.registerFont(`${process.cwd()}/assets/fonts/naruto.ttf`, { family: 'Naruto' });
        const canvas = Canvas.createCanvas(350, 400);
        const ctx = canvas.getContext('2d');

        // Background
        const background = await Canvas.loadImage(`${process.cwd()}/assets/images/background.png`);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Clan Icon
        const clanIcon = await Canvas.loadImage(`${process.cwd()}/assets/images/clans/${shinobi.clan}.png`);
        ctx.drawImage(clanIcon, canvas.width - 105, 70, 64, 64);

        ctx.font = Util.applyText(canvas, member.user.username, 36, canvas.width, 'Naruto');
        ctx.fillText(member.user.username, canvas.width / 3, 110);

        ctx.font = Util.applyText(canvas, shinobi.clan, shinobi.clan.length >= 9 ? 20 : 24, canvas.width, 'Naruto');
        ctx.fillText(shinobi.clan, canvas.width - 100, 155);

        ctx.font = '20px naruto';
        ctx.fillText(`HP: ${shinobi.hp}`, 40, 150);

        // Avatar
        ctx.beginPath();
        ctx.arc(70, 100, 32, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png', size: 64, dynamic: true }));
        ctx.drawImage(avatar, 40, 70, 64, 64);

        const attachment = new MessageAttachment(canvas.toBuffer(), `${member.user.username}-Shinobi.png`);

        return attachment;
    }
};