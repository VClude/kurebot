
const Discord = require('discord.js');
const bot_config = require('./bot.config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const conf_token = bot_config.bot_config.conf_token;

//Remove the OR (||) before deploying!
const token = process.env.TOKEN || conf_token;


client.on("ready", () => {
   console.log('bot is ready');
   let theid = ['782917925257871370','785535330848997376','785535364584308766','785535392425705524','785535418422657065'];
   for(let i = 0; i < theid.length; i++){
    let channel = theid[i];
    const emsg = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Perdagangan Waifu Dibuka')
    .setImage('https://i.imgur.com/DiDNF8n.jpeg')
    .addField('PEMBERITAHUAN', 'Tutup Dalam 15 Menit');
    channel.send(emsg);
    channel.updateOverwrite(channel.guild.roles.everyone, { SEND_MESSAGES: true });
   }
  
    
}).then(() => {
     
    client.destroy();
});


client.login(token);
