const Rest = require('./Rest');
const Util = require('../Util');

const ytdl = require('ytdl-core');

module.exports = class MusicHandler {
    constructor(guild) {
        this.guild = guild;
        this.volume = 100;
        this.loop = false;
        this.previous = null;
        this.current = null;
        this.queue = [];
        this.song = null;
        this.textChannel = null;
    }

    get voiceChannel() {
        return this.guild.me.voice.channel;
    }

    get client() {
        return this.guild.client;
    }

    get player() {
        return this.client.music.manager.players.get(this.guild.id) || null;
    }

    get node() {
        return this.client.music.manager.nodes.get('main');
    }

    reset() {
        this.loop = false;
        this.volume = 100;
        this.previous = null;
        this.current = null;
        this.queue = [];
        this.song = null;
        this.textChannel = null;
    }

    async join(voice) {
        if (this.player) return;

        await this.client.music.manager.join({
            channel: voice.id,
            guild: this.guild.id,
            node: this.node.id,
        }, { selfdeaf: true });

        this.player
            .on('start', () => {
                this.current = this.queue.shift();
                if (this.textChannel && !this.loop) {
                    const embed = Util.embed()
                        .setAuthor(this.song.author.name, this.song.author.thumbnails[this.song.author.thumbnails.length - 1].url, this.song.author.user_url)
                        .setTitle('Now Playing')
                        .setDescription(`**${this.current.info.title}**`)
                        .setURL(this.current.info.uri)
                        .setThumbnail(this.song.thumbnails[this.song.thumbnails.length - 1].url)
                        .addFields(
                            { name: 'Likes', value: this.song.likes, inline: true },
                            { name: 'Dislikes', value: this.song.dislikes, inline: true },
                            { name: 'Views', value: this.song.viewCount, inline: true },
                        )
                        .setFooter(`Requested by ${this.current.requester.username}#${this.current.requester.discriminator}`, this.current.requester.displayAvatarURL({ format: 'png' }));
                    this.textChannel.send(embed);
                }
            })
            .on('end', data => {
                if (data.reason === 'REPLACED') return;
                this.previous = this.current;
                this.current = null;
                if (this.loop) this.queue.push(this.previous);
                if (!this.queue.length) {
                    this.reset();
                    return;
                }

                this.start();
            })
            .on('error', err => this.client.log(new Error(err.message)));
    }

    async leave(guild) {
        try {
            await this.client.music.manager.leave(guild.id);

            if (this.textChannel) {
                this.textChannel.send('**Left the voice channel**');
            }
        } catch (err) {
            this.client.log(new Error(err.message));
        }
    }

    setTextCh(text) {
        this.textChannel = text;
    }

    async load(query) {
        const res = await Rest.load(this.node, query, this.client.music.spotify);
        await this.getInfo(res.tracks[0].info.identifier);
        return res;
    }

    async start() {
        if (!this.player) return;
        await this.player.play(this.queue[0].track);
    }

    async pause() {
        if (!this.player) return;
        if (!this.player.paused) await this.player.pause(true);
    }

    async resume() {
        if (!this.player) return;
        if (this.player.paused) await this.player.pause(false);
    }

    async skip(num = 1) {
        if (!this.player) return;
        if (num > 1) {
            this.queue.unshift(this.queue[num - 1]);
            this.queue.splice(num, 1);
        }

        await this.player.stop();
    }

    async stop() {
        if (!this.player) return;
        this.loop = false;
        this.queue = [];
        await this.skip();
    }

    async toggleLoop() {
        if (!this.player) return;
        this.loop = !this.loop;
    }

    async getInfo(track) {
        this.song = (await ytdl.getBasicInfo(track)).videoDetails;
    }

    async setVolume(newVol) {
        if (!this.player) return;
        const parsed = parseInt(newVol, 10);
        if (isNaN(parsed)) return;
        await this.player.volume(parsed);
        this.volume = newVol;
    }
};