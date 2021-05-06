const Command = require('../../struct/Command');
const Util = require('../../struct/Util');

module.exports = class LyricsCommand extends Command {
    constructor() {
        super('lyrics', {
            category: 'music',
            args: [
                {
                    id: 'query',
                    type: 'string',
                    default: message => message.guild.music.current ? message.guild.music.current.info.title : null,
                },
            ],
        });
    }

    async exec(message, { query }) {
        if(!query) {
            return message.channel.send('**Play a song to display lyrics of it or provide a song title**');
        }

        try {
            const res = await Util.getLyrics(query);
            const splittedLyrics = Util.chunk(res.lyrics, 1024);

            const embed = Util.embed()
            .setAuthor(res.author)
            .setTitle(res.title)
            .setURL(res.links.genius)
            .setDescription(splittedLyrics[0])
            .setFooter(`Page 1 of ${splittedLyrics.length}`);

            const lyricsMessage = await message.channel.send(embed);
            if (splittedLyrics.length > 1) await Util.pagination(lyricsMessage, message.author, splittedLyrics);
        } catch(err) {
            this.client.log(new Error(err.message));
            if (err.message === 'Sorry I couldn\'t find that song\'s lyrics') message.channel.send(Util.embed().setDescription(`**${err.message}**`));
            else message.channel.send(`An error occured: ${err.message}`);
        }
    }
};