const _ = require('lodash');
const Util = require('../../../struct/Util');

module.exports = (req, res) => {
    let statusColor;
    let status;

    switch (req.bot.presence.status) {
        case 'online':
            status = 'Online';
            statusColor = 'green';
            break;
        case 'idle':
            status = 'Idle';
            statusColor = 'yellow';
            break;
        case 'dnd':
            status = 'Do not Disturb';
            statusColor = 'red';
            break;
        default:
            status = 'Offline';
            statusColor = 'gray';
            break;
    }

    req.bot.presence.statusColor = statusColor;
    req.bot.presence.formattedStatus = status;
    req.bot.presence.activities[0].formattedType = _.capitalize(req.bot.presence.activities[0].type);

    const owners = Util.getOwners(req.bot);

    res.json({
        user: req.bot.user,
        presence: req.bot.presence,
        count: {
            guilds: req.bot.guilds.cache.size,
            users: req.bot.users.cache.size,
        },
        owners: owners,
    });
};