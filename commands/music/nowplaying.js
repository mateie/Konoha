const Command = require('../../struct/Command');
const Util = require('../../struct/Util');
const { format, createBar } = require('string-progress');

module.exports = class NowPlayingCommand extends Command {
    constructor() {
        super('nowplaying', {
            category: 'music',
            aliases: ['np'],
            description: 'Shows what is playing currently on Music Player',
        });
    }

    exec(message) {
        const { music } = message.guild;

        if (!music.player || !music.player.playing) {
            return message.channel.send('**Currently not playing anything**');
        }

        const track = music.current;
        const song = music.song;
        const durations = {
            current: Util.msToSeconds(music.player.state.position),
            total: Util.msToSeconds(track.info.length),
        };

        const times = {
            current: format(Util.msToSeconds(music.player.state.position)),
            total: format(Util.msToSeconds(track.info.length)),
        };

        const bar = createBar(durations.total, durations.current, { slider: '🟠' });
        const embed = Util.embed()
            .setAuthor(song.author.name, song.author.thumbnails[song.author.thumbnails.length - 1].url, song.author.user_url)
            .setTitle('Now Playing')
            .setDescription(`${bar}\n${times.current}/${times.total}`)
            .setURL(track.info.uri)
            .setThumbnail(song.thumbnails[song.thumbnails.length - 1].url)
            .setFooter(`Requested by ${track.requester.username}#${track.requester.discriminator}`);

        message.channel.send(embed);
    }
};