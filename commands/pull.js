const { settings } = require("cluster");
const bot_config = require('../bot.config.json');
const prefix = bot_config.bot_config.prefix;

module.exports = {
    name: 'pull',
    description: 'pull banner disini biar laksek kemudian',
    execute(message, args, client) {
        // const emoji = client.emojis.cache.get('753083854239039498');
        // message.channel.send(`Emojis test ${emoji}`);
        const Discord = require('discord.js');
        
        let dsEmbeds = new Discord.MessageEmbed();
        dsEmbeds.setTitle('Work in Progress');
        dsEmbeds.setDescription('lagi maintenens.');
        dsEmbeds.setColor(15158332);
        message.channel.send(dsEmbeds);


        
        }   

    }
