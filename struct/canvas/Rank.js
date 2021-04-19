const { Rank } = require('canvacord');
const Canvas = require('canvas');
const Util = require('canvacord/plugins/Util');

module.exports = class KonohaRank extends Rank {
    constructor() {
        super();

        this.data.ryo = {
            display: true,
            data: 1,
            textColor: '#FFFFFF',
            color: '#F3F3F3',
            displayText: 'RYO',
        };
    }

    setRyo(data, text = 'RYO', display = true) {
        if (typeof data !== 'number') throw new Error(`Ryo data must be a number, received ${typeof data}!`);
        this.data.ryo.data = data;
        this.data.ryo.display = !!display;
        if (!text || typeof text !== 'string') text = 'RYO';
        this.data.ryo.displayText = text;

        return this;
    }

    setRyoColor(text = '#FFFFFF', number = '#FFFFFF') {
        if (!text || typeof text !== 'string') text = '#FFFFFF';
        if (!number || typeof number !== 'string') number = '#FFFFFF';
        this.data.ryo.textColor = text;
        this.data.ryo.color = number;
        return this;
    }

    async buildCard(ops = { fontX: 'Manrope', fontY: 'Manrope' }) {
        if (typeof this.data.currentXP.data !== 'number') throw new Error(`Expected currentXP to be a number, received ${typeof this.data.currentXP.data}!`);
        if (typeof this.data.requiredXP.data !== 'number') throw new Error(`Expected requiredXP to be a number, received ${typeof this.data.requiredXP.data}!`);
        if (!this.data.avatar.source) throw new Error('Avatar source not found!');
        if (!this.data.username.name) throw new Error('Missing username');

        let bg = null;
        if (this.data.background.type === 'image') bg = await Canvas.loadImage(this.data.background.image);
        const avatar = await Canvas.loadImage(this.data.avatar.source);

        // create canvas instance
        const canvas = Canvas.createCanvas(this.data.width, this.data.height);
        const ctx = canvas.getContext('2d');

        // create background
        if (bg) {
            ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = this.data.background.image;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // add overlay
        if (this.data.overlay.display) {
            ctx.globalAlpha = this.data.overlay.level || 1;
            ctx.fillStyle = this.data.overlay.color;
            ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);
        }

        // reset transparency
        ctx.globalAlpha = 1;

        // draw username
        ctx.font = `bold 36px ${ops.fontX}`;
        ctx.fillStyle = this.data.username.color;
        ctx.textAlign = 'start';
        const name = Util.shorten(this.data.username.name, 10);

        // apply username
        !this.data.renderEmojis ? ctx.fillText(`${name}`, 257 + 18.5, 164) : await Util.renderEmoji(ctx, name, 257 + 18.5, 164);

        // draw discriminator
        if (!this.data.discriminator.discrim) throw new Error('Missing discriminator!');
        const discrim = `${this.data.discriminator.discrim}`;
        if (discrim) {
            ctx.font = `36px ${ops.fontY}`;
            ctx.fillStyle = this.data.discriminator.color;
            ctx.textAlign = 'center';
            ctx.fillText(`#${discrim.substr(0, 4)}`, ctx.measureText(name).width + 20 + 335, 164);
        }

        // fill level
        if (this.data.level.display && !isNaN(this.data.level.data)) {
            ctx.font = `bold 36px ${ops.fontX}`;
            ctx.fillStyle = this.data.level.textColor;
            ctx.fillText(this.data.level.displayText, 800 - ctx.measureText(Util.toAbbrev(parseInt(this.data.level.data))).width, 82);

            ctx.font = `bold 32px ${ops.fontX}`;
            ctx.fillStyle = this.data.level.color;
            ctx.textAlign = 'end';
            ctx.fillText(Util.toAbbrev(parseInt(this.data.level.data)), 860, 82);
        }

        // fill rank
        if (this.data.rank.display && !isNaN(this.data.rank.data)) {
            ctx.font = `bold 36px ${ops.fontX}`;
            ctx.fillStyle = this.data.rank.textColor;
            ctx.fillText(this.data.rank.displayText, 800 - ctx.measureText(Util.toAbbrev(parseInt(this.data.level.data)) || '-').width - 7 - ctx.measureText(this.data.level.displayText).width - 7 - ctx.measureText(Util.toAbbrev(parseInt(this.data.rank.data)) || '-').width, 82);

            ctx.font = `bold 32px ${ops.fontX}`;
            ctx.fillStyle = this.data.rank.color;
            ctx.textAlign = 'end';
            ctx.fillText(Util.toAbbrev(parseInt(this.data.rank.data)), 790 - ctx.measureText(Util.toAbbrev(parseInt(this.data.level.data)) || '-').width - 7 - ctx.measureText(this.data.level.displayText).width, 82);
        }

        // fill ryo
        /* if (this.data.ryo.display && !isNaN(this.data.ryo.data)) {
            ctx.font = `bold 36px ${ops.fontX}`;
            ctx.fillStyle = this.data.ryo.textColor;
            ctx.fillText(this.data.ryo.displayText, 630 - ctx.measureText(Util.toAbbrev(parseInt(this.data.rank.data)) || "-").width - 7 - ctx.measureText(this.data.rank.displayText).width - 7 - ctx.measureText(Util.toAbbrev(parseInt(this.data.ryo.data)) || "-").width, 81);

            ctx.font = `bold 32px ${ops.fontX}`;
            ctx.fillStyle = this.data.ryo.color;
            ctx.textAlign = "end";
            ctx.fillText(Util.toAbbrev(parseInt(this.data.ryo.data)), 620 - ctx.measureText(Util.toAbbrev(parseInt(this.data.rank.data)) || "-").width - 7 - ctx.measureText(this.data.rank.displayText).width, 81);
        }*/

        // show progress
        ctx.font = `bold 30px ${ops.fontX}`;
        ctx.fillStyle = this.data.requiredXP.color;
        ctx.textAlign = 'start';
        ctx.fillText('/ ' + Util.toAbbrev(this.data.requiredXP.data), 670 + ctx.measureText(Util.toAbbrev(this.data.currentXP.data)).width + 15, 164);

        ctx.fillStyle = this.data.currentXP.color;
        ctx.fillText(Util.toAbbrev(this.data.currentXP.data), 670, 164);

        // draw progressbar
        ctx.beginPath();
        if (this.data.progressBar.rounded) {
            // bg
            ctx.fillStyle = this.data.progressBar.track.color;
            ctx.arc(257 + 18.5, 147.5 + 18.5 + 36.25, 18.5, 1.5 * Math.PI, 0.5 * Math.PI, true);
            ctx.fill();
            ctx.fillRect(257 + 18.5, 147.5 + 36.25, 615 - 18.5, 37.5);
            ctx.arc(257 + 615, 147.5 + 18.5 + 36.25, 18.75, 1.5 * Math.PI, 0.5 * Math.PI, false);
            ctx.fill();

            ctx.beginPath();
            // apply color
            if (this.data.progressBar.bar.type === 'gradient') {
                const gradientContext = ctx.createRadialGradient(this._calculateProgress, 0, 500, 0);
                this.data.progressBar.bar.color.forEach((color, index) => {
                    gradientContext.addColorStop(index, color);
                });
                ctx.fillStyle = gradientContext;
            } else {
                ctx.fillStyle = this.data.progressBar.bar.color;
            }

            // progress bar
            ctx.arc(257 + 18.5, 147.5 + 18.5 + 36.25, 18.5, 1.5 * Math.PI, 0.5 * Math.PI, true);
            ctx.fill();
            ctx.fillRect(257 + 18.5, 147.5 + 36.25, this._calculateProgress, 37.5);
            ctx.arc(257 + 18.5 + this._calculateProgress, 147.5 + 18.5 + 36.25, 18.75, 1.5 * Math.PI, 0.5 * Math.PI, false);
            ctx.fill();
        } else {

            // progress bar
            ctx.fillStyle = this.data.progressBar.bar.color;
            ctx.fillRect(this.data.progressBar.x, this.data.progressBar.y, this._calculateProgress, this.data.progressBar.height);

            // outline
            ctx.beginPath();
            ctx.strokeStyle = this.data.progressBar.track.color;
            ctx.lineWidth = 7;
            ctx.strokeRect(this.data.progressBar.x, this.data.progressBar.y, this.data.progressBar.width, this.data.progressBar.height);
        }

        ctx.save();

        // circle
        ctx.beginPath();
        ctx.arc(125 + 10, 125 + 20, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        // draw avatar
        ctx.drawImage(avatar, 35, 45, this.data.avatar.width + 20, this.data.avatar.height + 20);
        ctx.restore();

        // draw status
        if (this.data.status.circle) {
            ctx.beginPath();
            ctx.fillStyle = this.data.status.color;
            ctx.arc(215, 205, 20, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        } else if (!this.data.status.circle && this.data.status.width !== false) {
            ctx.beginPath();
            ctx.arc(135, 145, 100, 0, Math.PI * 2, true);
            ctx.strokeStyle = this.data.status.color;
            ctx.lineWidth = this.data.status.width;
            ctx.stroke();
        }

        return canvas.toBuffer();
    }
};