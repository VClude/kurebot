module.exports = {
    name: 'ping',
    description: 'Reply ping with pong!',
    execute(message, args) {
        message.channel.send('Pong!');
    }
}