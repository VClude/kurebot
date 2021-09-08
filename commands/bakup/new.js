const { settings } = require("cluster");
const fs = require("fs");
const bot_config = require('../bot.config.json');
const prefix = bot_config.bot_config.prefix;

module.exports = {
    name: 'new',
    description: 'what is new',
    execute(message, args, client) {
        client.channels.cache.get('792718959836921878').send('<@&733705809183375437>');
        const Discord = require('discord.js');
        const emsg = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Special Conquest Reminder \n(From 22:30 GMT+7 ~ Tomorrow 19:00 GMT+7)')
        .addField('Conquest EX Fire', '- Fafnir & Grieving Spider')
        .addField('Conquest EX Water', '- Jormungandr & Fenrir')
        .addField('Conquest EX Wind', '- Ogre & Ziz')
        .setDescription('Available on Normal Difficulty, \n 2 Boss in 1 Conquest , \n Drop Rate each Conquest 1%, Availability Period : \n 22:30 ~ 22:59 \n 00:30 ~ 00:59 \n 06:30 ~ 06:59 \n 10:00 ~ 10:29 \n 15:30 ~ 15:59 \n 18:30 ~ 18:59')
        .setImage('https://webcontents-sinoalice-g.pokelabo.jp//web/img/alice/announce/2cd8f5039d6ca8ee40dffce813b2d869.png');
        client.channels.cache.get('792718959836921878').send(emsg);
//770258593944698921 -astel
//241952916053688321 -yabbe
//792718959836921878 -SV
    }
}