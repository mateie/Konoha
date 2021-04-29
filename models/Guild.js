const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    commands: {
        type: Map,
        of: Number,
    },
    settings: {
        prefix: String,
        strict: {
            enabled: {
                type: Boolean,
                default: false,
            },
            channel: {
                type: String,
                default: null,
            },
            logs: {
                enabled: {
                    type: Boolean,
                    default: false,
                },
                channel: {
                    type: String,
                    default: null,
                },
            },
            punish: {
                enabled: {
                    type: Boolean,
                    default: false,
                },
                mute: {
                    type: Number,
                    default: null,
                },
                kick: {
                    type: Number,
                    default: null,
                },
                ban: {
                    type: Number,
                    default: null,
                },
            },
        },
        mutes: {
            type: Array,
            default: [],
        },
        warns: {
            type: Array,
            default: [],
        },
    },
});

module.exportsd = mongoose.model('Guild', schema);