const Command = require('../../struct/Command');
const Util = require('../../struct/Util');

module.exports = class SearchCommand extends Command {
    constructor() {
        super('search', {
            category: 'music',
            description: 'Search a song',
            args: [
                {
                    id: 'query',
                    type: 'string',
                    prompt: {
                        start: 'What is the song name or a link',
                        retry: 'Invalid response, please try again',
                    },
                },
            ],
        });
    }

    async exec(message, { query }) {
        try {
            const { music } = message.guild;

            if (!message.member.voice.channel) {
                return message.channel.send('**You must be in a voice channel**');
            }

            if (message.guild.me.voice.channel && !message.guild.me.voice.channel.equals(message.member.voice.channel)) {
                return message.channel.send(`You must be in **${message.guild.me.voice.channel}** to use Music commands`);
            }

            if (!music.node || !music.node.connected) {
                return message.channel.send('**Lavalink node not connected**');
            }

            let { tracks } = await music.load(`ytsearch:${query}`);
            if (!tracks.length) {
                return message.channel.send('**Couldn\'t find any results**');
            }

            tracks = tracks.slice(0, 10);

            const resultMessage = await message.channel.send(Util.embed()
                .setDescription(tracks.map((x, i) => `\`${++i}.\` **${x.info.title}**`))
                .setFooter('Select from 1 to 10 or type "cancel" to cancel the command'));

            const collector = await Util.awaitMessages(message);
            if (!collector) {
                return resultMessage.edit('**Time is up. Search cancelled**');
            }

            const response = collector.first();
            if (response.deletable) response.delete();

            if (/^cancel$/i.exec(response.content)) {
                return resultMessage.edit('**Search cancelled**');
            }

            const track = tracks[response.content - 1];
            track.requester = message.author;
            const song = music.song;
            music.queue.push(track);

            if (music.player && music.player.playing) {
                resultMessage.edit(
                    Util.embed().setAuthor(song.author.name, song.author.thumbnails[song.author.thumbnails.length - 1].url, song.author.user_url)
                        .setTitle('Added to the Queue')
                        .setDescription(`**${track.info.title}**`)
                        .setURL(track.info.uri)
                        .setThumbnail(song.thumbnails[song.thumbnails.length - 1].url)
                        .addFields(
                            { name: 'Likes', value: song.likes, inline: true },
                            { name: 'Dislikes', value: song.dislikes, inline: true },
                            { name: 'Views', value: song.viewCount, inline: true },
                        )
                        .setFooter(`Requested by ${track.requester.username}#${track.requester.discriminator}`),
                );
            } else {
                resultMessage.delete();
            }

            if (!music.player) await music.join(message.member.voice.channel);
            if (!music.player.playing) await music.start();

            music.setTextCh(message.channel);
        } catch (err) {
            this.client.log(new Error(err.message));
        }
    }
};