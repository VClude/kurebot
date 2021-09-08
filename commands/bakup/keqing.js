const { settings } = require("cluster");
const fs = require("fs");
const bot_config = require('../bot.config.json');
const prefix = bot_config.bot_config.prefix;

module.exports = {
    name: 'keqing',
    description: 'keqingggg, ze pong ze pong',
    execute(message, args, client) {
        if(!args[0]){
            message.channel.send({files: ['./assets/keqing.mp4']});
        }

        else if(args[0] == 2){
            message.channel.send({files: ['./assets/keqing2.mp4']});

        }
        
        
  

    }
}