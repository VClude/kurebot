const { settings } = require("cluster");
const bot_config = require('../bot.config.json');
const prefix = bot_config.bot_config.prefix;

module.exports = {
    name: 'cololist',
    description: 'list of colosseum archive score',
    execute(message, args, client) {
        // const emoji = client.emojis.cache.get('753083854239039498');
        // message.channel.send(`Emojis test ${emoji}`);
        const Discord = require('discord.js');
        
        let dsEmbeds = new Discord.MessageEmbed();
        dsEmbeds.setTitle('Work in Progress');
        dsEmbeds.setDescription('-');
        dsEmbeds.setColor(15158332);
        message.channel.send(dsEmbeds);


        
        }   

    }
