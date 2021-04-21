const mongoose = require('mongoose');
const Shinobi = mongoose.model('Shinobi');
const Util = require('../../struct/Util');
const { clans } = require('../../assets/json/shinobi.json');

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

            const saved = await newShinobi.save();
            return saved;
        }

        return false;
    }

    static async getProfile(member) {
        const shinobi = await Shinobi.findOne({ userId: member.id }).lean();

        if (!shinobi) {
            return false;
        }

        const embed = Util.embed()
            .setTitle(`${member.user.username}'s Profile`);

        return embed;
    }
};