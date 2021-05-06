const { MessageEmbed, Permissions } = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment');
require('moment-duration-format');
const yes = ['yes', 'y', 'ye', 'yeah', 'yup', 'yea', 'ya', 'hai', 'si', 'sí', 'oui', 'はい', 'correct'];
const no = ['no', 'n', 'nah', 'nope', 'nop', 'iie', 'いいえ', 'non', 'fuck off'];

module.exports = class KonohaUtil {
    static embed() {
        const embed = new MessageEmbed()
            .setColor('RED')
            .setTimestamp(new Date());
        return embed;
    }

    static capFirstLetter(string) {
        if (typeof string !== 'string') throw Error('String not provided');
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    static length(object) {
        return object ? Object.keys(object).length : 0;
    }

    static durationToMs(dur) {
        return dur.split(':').map(Number).reduce((acc, curr) => curr + acc * 60) * 1000;
    }

    static msToDuration(ms) {
        return moment.duration(ms, 'seconds').format('h:mm:ss');
    }

    static msToSeconds(ms) {
        return ms / 1000;
    }

    static isValidURL(url) {
        return /^https?:\/\/((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i
            .test(url);
    }

    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static shorten(text, maxLen = 200) {
        return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text;
    }

    static randomRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        return arr;
    }

    static formatNumber(number, minFractionDigits = 0) {
        return Number.parseFloat(number).toLocaleString(undefined, {
            minimumFractionDigits: minFractionDigits,
            maximumFractionDigits: 2,
        });
    }

    static formatNumberK(number) {
        return number > 999 ? `${(number / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}K` : number;
    }

    static list(arr, conj = 'and') {
        const len = arr.length;
        if (len == 0) return '';
        if (len == 1) return arr[0];
        return `${arr.slice(0, -1).join(', ')}${len > 1 ? `${len > 2 ? ',' : ''} ${conj} ` : ''}${arr.slice(-1)}`;
    }

    static async verify(channel, user, { time = 30000, extraYes = [], extraNo = [] } = {}) {
        const filter = res => {
            const value = res.content.toLowerCase();
            return (user ? res.author.id === user.id : true)
                && (yes.includes(value) || no.includes(value) || extraYes.includes(value) || extraNo.includes(value));
        };

        const verify = await channel.awaitMessages(filter, {
            max: 1,
            time,
        });

        if (!verify.size) return 0;
        const choice = verify.first().content.toLowerCase();
        if (yes.includes(choice) || extraYes.includes(choice)) return true;
        if (no.includes(choice) || extraNo.includes(choice)) return false;
        return false;
    }

    static removeDuplicates(arr) {
        if (arr.length === 0 || arr.length === 1) return arr;
        const newArr = [];
        for (let i = 0; i < arr.length; i++) {
            if (newArr.includes(arr[i])) continue;
            newArr.push(arr[i]);
        }

        return newArr;
    }

    static sortByName(arr, prop) {
        return arr.sort((a, b) => {
            if (prop) return a[prop].toLowerCase() > b[prop].toLowerCase() ? 1 : -1;
            return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
        });
    }

    static moveArrayElement(array, fromIndex, toIndex) {
        array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
        return array;
    }

    static today(tz) {
        const now = new Date();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);
        if (tz) now.setUTCHours(now.getUTCHours() + tz);
        return now;
    }

    static tomorrow(tz) {
        const today = this.today(tz);
        today.setDate(today.getDate() + 1);
        return today;
    }

    static isLeap(year) {
        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    }

    static rgbToHex(r, g, b) {
        if (r > 255 || g > 255 || b > 255) return null;
        return ((r << 16) | (g << 8) | b).toString(16);
    }

    static embedURL(title, url, display) {
        return `[${title}](${url.replace(/\)/g, '%29')}${display ? ` "${display}"` : ''})`;
    }

    static calculatePercentage(num) {
        return num * 100;
    }

    static async getLyrics(query) {
        const body = await (await fetch(`https://some-random-api.ml/lyrics?title=${encodeURIComponent(query)}`)).json();
        if (body.error) throw Error(body.error);
        return body;
    }

    static chunk(arr, size) {
        const temp = [];
        for (let i = 0; i < arr.length; i += size) {
            temp.push(arr.slice(i, i + size));
        }

        return temp;
    }

    static get paginationEmojis() {
        return ['◀', '⛔', '▶'];
    }

    static async pagination(message, author, contents, init = true, currPage = 0) {
        if (init) for (const emoji of this.paginationEmojis) await message.react(emoji);

        const collector = message.createReactionCollector((reaction, user) => {
            return this.paginationEmojis.includes(reaction.emoji.name) && user.id === author.id;
        }, {
            max: 1,
            time: 30000,
        });

        collector
            .on('collect', reaction => {
                reaction.users.remove(author);

                const emoji = reaction.emoji.name;
                if (emoji === this.paginationEmojis[0]) currPage--;
                if (emoji === this.paginationEmojis[1]) {
                    collector.stop();
                    return message.delete({ timeout: 3000 });
                }
                if (emoji === this.paginationEmojis[2]) currPage++;

                if (currPage < 0) currPage = 0;

                currPage = ((currPage % contents.length) + contents.length) % contents.length;

                const embed = message.embeds[0]
                    .setDescription(contents[currPage])
                    .setFooter(`Page ${currPage + 1} of ${contents.length}`);

                message.edit(embed);

                this.pagination(message, author, contents, false, currPage);
            })
            .on('end', (_, reason) => {
                if (['time', 'user'].includes(reason)) message.reactions.removeAll();
            });
    }

    static missingPerms(memberPerms, requiredPerms) {
        return new Permissions(memberPerms).missing(new Permissions(requiredPerms));
    }

    static getOwners(client) {
        const owners = [];
        client.ownerID.forEach(owner => {
            const found = client.users.cache.get(owner);
            owners.push(`${found.username}`);
        });

        if (owners.length === 1) {
            return owners[0];
        } else if (owners.length === 2) {
            console.log(owners.length, owners);
            return `${owners[0]} and ${owners[1]}`;
        } else if (owners.length > 2) {
            return owners.join(', ');
        } else {
            return 'Unknown';
        }
    }

    static async awaitMessages(message) {
        try {
            const collector = await message.channel.awaitMessages(
                m => m.author.equals(message.author) && (/^cancel$/i.exec(m.content) || (!isNaN(parseInt(m.content, 10)) && (m.content >= 1 && m.content <= 10))),
                {
                    time: 10000,
                    max: 1,
                    errors: ['time'],
                },
            );

            return collector;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    static formatVariable(prefix, variable) {
        const formattedVariable = variable.toLowerCase()
            .split('-').map((word) => word.charAt(0).toUpperCase() + word.substr(1, word.length).toLowerCase()).join('');
        return prefix + formattedVariable;
    }

    static applyText(canvas, text, defaultFontSize, width, font) {
        const ctx = canvas.getContext('2d');
        do {
            ctx.font = `${(defaultFontSize -= 10)}px ${font}`;
        } while (ctx.measureText(text).width > width);
        return ctx.font;
    }
};