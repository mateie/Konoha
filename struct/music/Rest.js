module.exports = class Rest extends require('@lavacord/discord.js').Rest {
    static async load(node, query, isClient) {
        const spotify = isClient ? isClient.nodes.get(node.id) : undefined;
        return isClient && isClient.isValidURL(query) ? await spotify.load(query) : await super.load(node, query);
    }
};