
const Discord = require('discord.js');
const bot_config = require('./bot.config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const conf_token = bot_config.bot_config.conf_token;

//Remove the OR (||) before deploying!
const token = process.env.TOKEN || conf_token;


client.on("ready", () => {
   console.log('bot is ready');
    let channel = client.channels.cache.get('782917925257871370');
    let duke = channel.guild.roles.cache.find(role => role.name === 'DUKE');
    const emsg = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Perdagangan Waifu Dibuka')
    .setImage('https://i.imgur.com/DiDNF8n.jpeg')
    .addField('PEMBERITAHUAN', 'Tutup Dalam 20 Menit');
    channel.send(emsg);
    channel.updateOverwrite(channel.guild.roles.everyone, { SEND_MESSAGES: true }).then(() => {
        channel.updateOverwrite(duke, { SEND_MESSAGES: true });
        client.destroy();
    });

});


client.login(token);
