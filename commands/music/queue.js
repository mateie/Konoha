const Command = require('../../struct/Command');
const Util = require('../../struct/Util');

module.exports = class QueueCommand extends Command {
    constructor() {
        super('queue', {
            category: 'music',
            description: 'Check the Music Player queue',
            aliases: ['q'],
        });
    }

    async exec(message) {
        const { music } = message.guild;

        if (!music.player || !music.player.playing) {
            return message.channel.send('**Currently not playing anything**');
        }

        if (!music.queue.length) {
            return message.channel.send('**Queue is empty**');
        }

        const queue = music.queue.map((t, i) => `\`${++i}.\` **${t.info.title}** ${t.requester}`);
        const chunked = Util.chunk(queue, 10).map(x => x.join('\n'));

        const embed = Util.embed()
            .setAuthor(`${message.guild.name} Music Queue`, message.guild.iconURL({ dynamic: true }))
            .setDescription(chunked[0])
            .setFooter(`Page 1 of ${chunked.length}`);

        try {
            const queueMessage = await message.channel.send(embed);
            if (chunked.length > 1) await Util.pagination(queueMessage, message.author, chunked);
        } catch (err) {
            this.client.logger('red', err);
            message.channel.send(`An error occured: ${err.message}`);
        }
    }
};