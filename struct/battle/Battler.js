const Util = require('../Util');
const { stripIndents } = require('common-tags');

module.exports = class Battler {
    constructor(battle, user) {
        this.battle = battle;
        this.user = user;
        this.bot = user.bot;
        this.hp = 100;
        this.mp = 100;
        this.guard = false;
        this.usedFinal = false;
        this.choices = ['attack', 'defend', 'special', 'cure', 'final', 'run'];
    }

    async chooseAction(message) {
        if (this.bot) {
            if (this.canFinal) return 'final';
            const botChoices = ['attack', 'attack', 'defend'];
            if (this.canSpecial) botChoices.push('special');
            if (this.canHeal && this.hp < 30) botChoices.push('cure');
            return botChoices[Math.floor(Math.random() * botChoices.length)];
        }

        let content = stripIndents`
            ${this}, do you ${Util.list(this.choices.map(choice => `**${choice}**`), 'or')}? You have **${this.mp}** MP.
            **${this.battle.user.user.tag}:** ${this.battle.user.hp} HP
            **${this.battle.opponent.user.tag}:** ${this.battle.opponent.hp} HP
        `;

        if (this.battle.turn === 1 || this.battle.turn === 2) {
            content += '\n\n_Special uses 20 MP whether or not it hits. Cure takes remaining MP and heals half that amount._';
            content += '\n_To use Final, you must have under 30 HP and over 10 MP. Final can only be used once!_';
        }

        await message.channel.send(content);
        const filter = res => {
            const choice = res.content.toLowerCase();
            if (res.author.id === this.user.id && this.choices.includes(choice)) {
                if ((choice === 'special' && !this.canSpecial) || (choice === 'cure' && !this.canHeal)) {
                    message.channel.send('You don\'t have enough MP for that').catch(() => null);
                    return false;
                }
                if (choice === 'final' && !this.canFinal) {
                    message.channel.send('You must have under 30 HP and over 10 MP. Final can only be used once').catch(() => null);
                    return false;
                }

                return true;
            }

            return false;
        };

        const turn = await message.channel.awaitMessages(filter, {
            max: 1,
            time: 30000,
        });
        if (!turn.size) return 'failed:time';
        return turn.first().content.toLowerCase();
    }

    dealDamage(amount) {
        this.hp -= amount;
        return this.hp;
    }

    heal(amount) {
        this.hp += amount;
        return this.hp;
    }

    useMP(amount) {
        this.mp -= amount;
        return this.mp;
    }

    changeGuard() {
        this.guard = !this.guard;
        return this.guard;
    }

    forfeit() {
        this.hp = 0;
        return null;
    }

    get canHeal() {
        return this.mp > 0;
    }

    get canSpecial() {
        return this.mp >= 20;
    }

    get canFinal() {
        return this.hp < 30 && this.mp >= 10 && !this.usedFinal;
    }

    toString() {
        return this.user.toString();
    }
};