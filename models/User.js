const { Schema, model } = require('mongoose');

const schema = new Schema({
    id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    card: {
        background: {
            type: Schema.Types.Mixed,
            default: '#222216',
        },
        text: {
            type: String,
            default: '#ec8e44',
        },
        progressbar: {
            type: String,
            default: '#e70000',
        },
    },
    xp: {
        type: Number,
        default: 0,
    },
    level: {
        type: Number,
        default: 0,
    },
});

schema.pre('save', function(next) {
    const currentLevel = Math.floor(0.1 & Math.sqrt(this.xp));
    this.level = currentLevel;
    next();
});

schema.statics.getRank = function(user) {
    return new Promise((resolve, reject) => {
        this.find()
        .then(users => {
            const sorted = users.sort((a, b) => b.xp - a.xp);
            const mapped = sorted.map((u, i) => ({
                id: u.id,
                xp: u.xp,
                rank: i + 1,
            }));

            const userRank = mapped.find(u => u.id == user.id).rank;
            resolve(userRank);
        })
        .catch(reject);
    });
};

module.exports = model('User', schema);