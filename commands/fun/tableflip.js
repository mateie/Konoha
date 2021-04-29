const Command = require('../../struct/Command');
const Util = require('../../struct/Util');

module.exports = class TableflipCommand extends Command {
    constructor() {
        super('tableflip', {
            category: 'fun',
            description: 'Flip a table with an animation',
        });
    }

    async exec(message) {
        const frames = [
            '(-°□°)-  ┬─┬',
            '(╯°□°)╯    ]',
            '(╯°□°)╯  ︵  ┻━┻',
            '(╯°□°)╯       [',
            '(╯°□°)╯           ┬─┬',
        ];

        const msg = await message.channel.send('(\\\\°□°)\\\\  ┬─┬');
        for(const frame of frames) {
            await Util.delay(100);
            await msg.edit(frame);
        }
        return msg;
    }
};