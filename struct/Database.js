const mongoose = require('mongoose');

const Guild = mongoose.model('Guild');
const User = mongoose.model('User');

module.exports = class KonohaDatabase {
    constructor(client) {
        this.client = client;

        this.guilds = [];
        this.users = [];
    }

    checkGuilds(guilds) {
        guilds.forEach(async guild => {
            const dbGuild = await Guild.findOne({ id: guild.id });

            if (!dbGuild) {
                const newGuild = new Guild({
                    id: guild.id,
                    name: guild.name,
                    owner: guild.ownerID,
                });

                newGuild
                    .save()
                    .then(saved => {
                        const owner = this.client.users.cache.get(guild.ownerID);
                        this.client.log(`Adding Guild to the Database (ID: ${guild.id} - Name: ${guild.name} - Owner: ${owner.username})`);

                        this.guilds.push(saved);
                    })
                    .catch(err => this.client.log(new Error(err.message)));
            } else {
                this.guilds.push(dbGuild);
            }
        });
    }

    async checkGuild(guild) {
        const dbGuild = await Guild.findOne({ id: guild.id });

        if (!dbGuild) {
            const newGuild = new Guild({
                id: guild.id,
                name: guild.name,
                owner: guild.ownerID,
            });

            newGuild
                .save()
                .then(saved => {
                    const owner = this.client.users.cache.get(guild.ownerID);
                    this.client.log(`Adding Guild to the Database (ID: ${guild.id} - Name: ${guild.name} - Owner: ${owner.username})`);

                    this.guilds.push(saved);
                })
                .catch(err => this.client.log(err));
        } else {
            this.guilds.push(dbGuild);
        }
    }

    checkUsers(users) {
        users.forEach(async user => {
            const dbUser = await User.findOne({ id: user.id });

            if (!user.bot) {
                if (!dbUser) {
                    const newUser = new User({
                        id: user.id,
                        username: user.username,
                    });

                    newUser
                        .save()
                        .then(saved => {
                            this.client.log(`Adding User to the Database (ID: ${user.id} - Username: ${user.username}#${user.discriminator})`);

                            this.users.push(saved);
                        })
                        .catch(err => this.client.log(new Error(err.message)));
                } else {
                    this.users.push(dbUser);
                }
            }
        });
    }

    async checkUser(user) {
        const dbUser = await User.findOne({ id: user.id });

        if (!user.bot) {
            if (!dbUser) {
                const newUser = new User({
                    id: user.id,
                    username: user.username,
                });

                newUser
                    .save()
                    .then(saved => {
                        this.client.log(`Adding User to the Database (ID: ${user.id} - Username: ${user.username}#${user.discriminator})`);

                        this.users.push(saved);
                    })
                    .catch(err => this.client.log(new Error(err.message)));
            } else {
                this.users.push(dbUser);
            }
        }
    }
};