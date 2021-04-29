const Command = require('../../struct/Command');
const Util = require('../../struct/Util');
const Osu = require('node-osu');
const moment = require('moment');
const { osu_api } = require('../../config');
const osu = new Osu.Api(osu_api, {
    completeScores: true,
    parseNumeric: true,
});

module.exports = class OsuCommand extends Command {
    constructor() {
        super('osu', {
            category: 'games',
            description: 'Osu! Helper',
            args: [
                {
                    id: 'player',
                    type: 'string',
                    prompt: {
                        start: 'What is the username of the player?',
                    },
                },
            ],
        });
    }

    async exec(message, { player }) {
        try {
            const user = await osu.getUser({ u: player });
            const userBest = await osu.getUserBest({ u: player });

            const embed = Util.embed()
                .setAuthor(`Osu Player Info: ${user.name} - Level ${Math.round(user.level)}`)
                .setDescription(`
                        **Accuracy**: ${user.accuracyFormatted}
                        **Time Played**: ${Util.msToDuration(user.secondsPlayed)}
                        **Joined**: ${moment(user.joinDate).format('MMMM Do YYYY, H:mm:ss a')}
                        **Total Plays**: ${user.counts.plays}
                    `)
                .addFields(
                    [
                        { name: 'Ranks', value: `*Global*: ${user.pp.rank}\n*Country Rank*: ${user.pp.countryRank}`, inline: true },
                        { name: 'Plays', value: `*SS*: ${user.counts.SS}\n*S*: ${user.counts.S}\n*A*: ${user.counts.A}`, inline: true },
                        { name: 'Hits', value: `*300*: ${user.counts['300']}\n*100*: ${user.counts['100']}\n*50*: ${user.counts['50']}`, inline: true },
                    ],
                );

            message.channel.send(embed)
                .then(async msg => {
                    const ask = await msg.channel.send(`Do you want to see ${user.name}'s best beatmaps?`);
                    const verification = await Util.verify(msg.channel, message.author);
                    if (verification === 0) {
                        return ask.edit('Didn\'t receive an answer, not showing beatmaps');
                    } else if (!verification) {
                        return ask.edit('Received a no, Not showing beatmaps');
                    }

                    const embed = Util.embed()
                        .setTitle(`${user.name}'s Best Beatmaps`);

                    const beatmaps = userBest.sort((a, b) => b.score - a.score);

                    const mapped = beatmaps.map((beatmap, i) => `
                                #${i + 1} ${Util.embedURL(`**${beatmap._beatmap.artist}** - ${beatmap._beatmap.title}`, `https://osu.ppy.sh/beatmapsets/${beatmap._beatmap.beatmapSetId}#osu/${beatmap._beatmap.id}`)}
                                **Score**: ${Util.formatNumber(beatmap.score)}
                                **Accuracy**: ${Math.round(Util.calculatePercentage(beatmap.accuracy))}%
                                **Rank**: ${beatmap.rank}
                                **Max Combo**: ${beatmap.maxCombo}
                                **Star Rating**: ${Math.round(beatmap._beatmap.difficulty.rating * 10) / 10}
                                **BPM**: ${beatmap._beatmap.bpm}
                            `);

                    const chunked = Util.chunk(mapped, 1);
                    embed.setDescription(chunked[0])
                        .setFooter(`Page 1 of ${chunked.length}`);

                    const infoMessage = await message.channel.send(embed);
                    if (chunked.length > 1) await Util.pagination(infoMessage, message.author, chunked);
                });
        } catch (err) {
            console.error(err);
            this.client.logger('red', err.message);
        }
    }
};