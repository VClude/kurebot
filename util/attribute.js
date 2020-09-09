export default function (attribute, client) {
    switch (attribute) {
        case 1:
            return client.emojis.cache.get('753074904374444063');
        case 2:
            return client.emojis.cache.get('753083655357857942');
        case 3:
            return client.emojis.cache.get('753083703684759673');
        default:
            return undefined;
    }
}