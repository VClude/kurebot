const Discord = require('discord.js');
const {prefix} = require('./bot.config.json');
const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();

//Remove the OR (||) before deploying!
const token = process.env.TOKEN || 'NzQwOTMzMTk0NTM0MzU1MTM0.XywNzw.bWDnd94bIXVEGgskzgbhq2Jty98';

const cmdFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of cmdFiles){
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
}

client.on("ready", () => {
   console.log('bot is ready');
});

client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try{
        client.commands.get(command).execute(message, args);
    }catch (e) {
        console.error('Error! -> ' + e);
        message.reply('BPJS Bot is having some trouble parsing your message, please dm @chillrend');
    }
})

client.login(token);