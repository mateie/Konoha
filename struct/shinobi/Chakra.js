const mongoose = require('mongoose');
const Shinobi = mongoose.model('Shinobi');

module.exports = class ShinobiChakra {
    static async giveChakra(member, amount) {
        const shinobi = await Shinobi.findOne({ id: member.id });

        if(!shinobi) {
            return false;
        }

        shinobi.chakra += amount;
        return await shinobi.save();
    }

    static async getChakra(member) {
        const shinobi = await Shinobi.findOne({ id: member.id });

        if(!shinobi) {
            return false;
        }

        return shinobi.chakra;
    }

    static async calcChakraUse(member) {

    }
};