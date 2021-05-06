const mongoose = require('mongoose');
const { clans } = require('../assets/shinobi');

const schema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
    },
    stats: {
        hp: {
            type: Number,
            default: null,
        },
        chakra: {
            type: Number,
            default: null,
        },
        points: {
            type: Number,
            default: null,
        },
        xp: {
            type: Number,
            default: 0,
        },
        level: {
            type: Number,
            default: 0,
        },
        clan: {
            name: {
                type: String,
                default: null,
            },
            description: {
                type: String,
                default: null,
            },
        },
        rank: {
            type: String,
            default: null,
        },
        jutsus: {
            nin: {
                type: Array,
                default: [],
            },
            gen: {
                type: Array,
                default: [],
            },
            tai: {
                type: Array,
                default: [],
            },
        },
        card: {
            background: {
                type: mongoose.Schema.Types.Mixed,
                default: '#222216',
            },
            text: {
                type: String,
                default: '#ec8e44',
            },
            progressbar: {
                type: String,
                defualt: '#e70000',
            },
        },
    },
});

schema.pre('save', function(next) {
    const currentLevel = Math.floor(0.1 & Math.sqrt(this.stats));
    this.stats.level = currentLevel;
    next();
});

schema.statics.createShinobi = async function(id) {
    try {
        const user = await this.findOne({ id: id });
        if (!user.stats.rank) {
            const randomClan = clans[Object.keys(clans)[Object.keys(clans).length * Math.random() << 0]];
            user.stats.hp = 100;
            user.stats.chakra = 100;
            user.stats.points = 0;
            user.stats.rank = 'Genin';
            user.stats.clan.name = randomClan.name;
            user.stats.clan.description = randomClan.description;

            const shinobi = await user.save();
            return shinobi;
        }

        return false;
    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports = mongoose.model('User', schema);