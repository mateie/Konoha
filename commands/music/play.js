const Command = require('../../struct/Command');
const Util = require('../../struct/Util');

module.exports = class PlayCommand extends Command {
    constructor() {
        super('play', {
            category: 'music',
            description: 'Play a song',
            args: [
                {
                    id: 'query',
                    type: 'string',
                    prompt: {
                        start: 'What is the song name or the link?',
                        retry: 'Invalid response, please try again',
                    },
                },
            ],
        });
    }

    async exec(message, { query }) {
        try {
            const { music } = message.guild;

            if (!message.member.voice.channel) return message.channel.send('**You must be in a voice channel**');

            if (message.guild.me.voice.channel && !message.guild.me.voice.channel.equals(message.member.voice.channel)) {
                return message.channel.send(`You have to be in **${message.guild.me.voice.channel}** to use Music commands`);
            }

            if (!music.node || !music.node.connected) {
                return message.channel.send('--Lavalink Node is not connected--');
            }

            const {
                loadType,
                playlistInfo: {
                    name,
                },
                tracks,
            } = await music.load(Util.isValidURL(query) ? query : `ytsearch:${query}`);
            if (!tracks.length) return message.channel.send('--Couldn\'t find any results--');

            if (loadType === 'PLAYLIST_LOADED') {
                for (const track of tracks) {
                    track.requester = message.author;
                    music.queue.push(track);
                }

                message.channel.send(`Loaded \`${tracks.length}\` tracks from **${name}**`);
            } else {
                const track = tracks[0];
                track.requester = message.author;
                const song = music.song;
                music.queue.push(track);
                if (music.player && music.player.playing) {
                    message.channel.send(
                        Util.embed()
                            .setAuthor(song.author.name, song.author.thumbnails[song.author.thumbnails.length - 1].url, song.author.user_url)
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
                }
            }

            if (!music.player) await music.join(message.member.voice.channel);
            if (!music.player.playing) await music.start();

            music.setTextCh(message.channel);
        } catch (err) {
            this.client.log(new Error(err.message));
        }
    }
};