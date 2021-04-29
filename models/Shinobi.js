const { Schema, model } = require('mongoose');

const schema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    clan: {
        type: String,
        required: true,
    },
    xp: {
        type: Number,
        default: 0,
    },
    level: {
        type: Number,
        default: 0,
    },
    ryo: {
        type: Number,
        default: 0,
    },
    points: {
        type: Number,
        default: 0,
    },
    hp: {
        type: Number,
        default: 100,
    },
    chakra: {
        type: Number,
        required: true,
    },
    ninjutsu: {
        type: Array,
        default: [],
    },
    genjutsu: {
        type: Array,
        default: [],
    },
    taijutsu: {
        type: Array,
        default: [],
    },
});

schema.pre('save', function(next) {
    const currentLevel = Math.floor(0.1 & Math.sqrt(this.xp));
    this.level = currentLevel;
    next();
});

module.exports = model('Shinobi', schema);