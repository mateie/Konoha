const Command = require('../../../struct/Command');
const Util = require('../../../struct/Util');

module.exports = class HelpCommand extends Command {
    constructor() {
        super('help', {
            category: 'info',
            aliases: ['h'],
            description: 'Provides Help Menu for Commands and Categories',
            args: [
                {
                    id: 'category_or_command',
                    type: 'lowercase',
                    default: null,
                },
            ],
        });
    }

    async exec(message, { category_or_command }) {
        const embed = Util.embed();
        const category = category_or_command ? this.client.commandHandler.findCategory(category_or_command) : undefined;
        const command = category_or_command ? this.client.commandHandler.findCommand(category_or_command) : undefined;
        const allCommands = category_or_command == null ? this.client.commandHandler.modules : undefined;

        if(allCommands && allCommands.size > 1) {
            const commandsMapped = allCommands.map(cmd => `\`${cmd.categoryID}\`: **${cmd.id}** - ${cmd.description.length > 0 ? cmd.description : 'No Description'}`);
            const chunked = Util.chunk(commandsMapped, 10).map(x => x.join('\n'));

            embed
            .setTitle('All Commands')
            .setDescription(chunked[0])
            .setFooter(`Page 1 of ${chunked.length}`);

            const helpMessage = await message.channel.send(embed);
            if(chunked.length > 1) await Util.pagination(helpMessage, message.author, chunked);
        }

        if (category && category.size > 0) {
            const commandsMapped = category.map(cmd => `**${cmd.id}** - ${cmd.description.length > 0 ? cmd.description : 'No Description'}`);
            const chunked = Util.chunk(commandsMapped, 10).map(x => x.join('\n'));

            embed
                .setTitle(`${category.id} Commands`)
                .setDescription(chunked[0])
                .setFooter(`Page 1 of ${chunked.length}`);

            const helpMessage = await message.channel.send(embed);
            if (chunked.length > 1) await Util.pagination(helpMessage, message.author, chunked);
            return;
        }

        if (command && Object.keys(command).length > 1) {
            embed
                .setTitle(`\`${command.categoryID}\`: **${command.id}**`)
                .setDescription(command.description.length > 0 ? command.description : 'No Description');

            message.channel.send(embed);
        }
    }
};