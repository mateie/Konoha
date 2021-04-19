const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = class KonohaXP {
    constructor() {
        throw new Error(`The ${this.constructor.name} cannot be initialized`);
    }

    static giveUserXP(member, amount = 1) {
        User.findOne({
            id: member.user.id,
        })
            .then(user => {
                if (!user) {
                    const newUser = new User({
                        id: member.user.id,
                        username: member.user.username,
                    });

                    newUser.xp += amount;
                    return newUser.save();
                } else {
                    user.xp += amount;
                }

                user.save();
            })
            .catch(console.error);
    }


    static getUserXP(member) {
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

                        newUser.save().then(user => resolve(user.xp)).catch(reject);
                    }

                    resolve(user.xp);
                })
                .catch(reject);
        });
    }

    static calculateLevel(xp) {
        return Math.floor(0.1 * Math.sqrt(xp));
    }

    static calculateRequiredXP(xp) {
        let currentLevel = this.calculateLevel(xp);
        const nextLevel = this.calculateLevel(xp) + 1;

        let neededXP = 0;
        while (currentLevel < nextLevel) {
            neededXP++;
            currentLevel = this.calculateLevel(xp + neededXP);
        }

        return neededXP;
    }

    static calculateXPForLevel(level) {
        let xp = 0;
        let currentLevel = 0;

        while (currentLevel != level) {
            xp++;
            currentLevel = this.calculateLevel(xp);
        }

        return xp;
    }
};