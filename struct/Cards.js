const mongoose = require('mongoose');
const User = mongoose.model('User');

const Rank = require('./canvas/Rank');
const XP = require('./users/XP');

module.exports = class KonohaCards {
    constructor() {
        throw new Error(`The ${this.constructor.name} cannot be initialized`);
    }

    static getUser(member) {
        return new Promise((resolve, reject) => {
            User.findOne({
                id: member.user.id,
            })
                .then(user => {
                    if (!user) {
                        const newUser = new User({
                            id: member.user.id,
                            username: member.user.username,
                        });

                        newUser.save().then(resolve).catch(reject);
                    }

                    resolve(user);
                })
                .catch(reject);
        });
    }

    static getCardData(user) {
        return new Promise((resolve, reject) => {
            const currentXP = user.xp - XP.calculateXPForLevel(user.level);
            const neededXP = XP.calculateRequiredXP(user.xp) + currentXP;

            User.getRank(user)
                .then(rank => {
                    const info = {
                        rank: rank,
                        level: user.level,
                        neededXP: neededXP,
                        currentXP: currentXP,
                        background: user.card.background.buffer ? user.card.background.buffer : user.card.background,
                        text: user.card.text,
                        progressbar: user.card.progressbar,
                    };

                    resolve(info);
                })
                .catch(reject);
        });
    }

    static getRankCard(member) {
        return new Promise((resolve, reject) => {
            this.getUser(member)
                .then(user => {
                    this.getCardData(user)
                        .then(cardData => {
                            const image = new Rank()
                                .setBackground(Buffer.isBuffer(cardData.background) ? 'IMAGE' : 'COLOR', cardData.background)
                                .setLevelColor(cardData.text)
                                .setRankColor(cardData.text)
                                .setAvatar(member.user.displayAvatarURL({ format: 'png' }))
                                .setUsername(member.user.username)
                                .setDiscriminator(member.user.discriminator)
                                .setStatus(member.presence.status)
                                .setCurrentXP(cardData.currentXP)
                                .setRequiredXP(cardData.neededXP)
                                .setLevel(cardData.level, 'Level')
                                .setRank(cardData.rank, 'Rank')
                                .renderEmojis(true)
                                .setProgressBar(cardData.progressbar, 'COLOR')
                                .registerFonts();

                            image.buildCard().then(resolve).catch(reject);
                        });
                })
                .catch(reject);
        });
    }
};