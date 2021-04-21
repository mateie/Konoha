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
    chakra: {
        type: Number,
        required: true,
    },
    ninjutsu: {
        type: Number,
        default: 0,
    },
    genjutsu: {
        type: Number,
        default: 0,
    },
    taijutsu: {
        type: Number,
        default: 0,
    },
});

module.exports = model('Shinobi', schema);