const Command = require('./Command');

module.exports = class ShinobiCommand extends Command {
    constructor(id, options) {
        super(id, options);

        this.categoryID = 'shinobi';
    }
};