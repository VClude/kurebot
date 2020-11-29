const { settings } = require("cluster");
const fs = require("fs");
const bot_config = require('../bot.config.json');
const prefix = bot_config.bot_config.prefix;

module.exports = {
    name: 'keqing',
    description: 'keqingggg, ze pong ze pong',
    execute(message, args, client) {
        message.channel.send({files: ['./assets/keqing.mp4']});
        
  

    }
}