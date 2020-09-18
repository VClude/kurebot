
const Discord = require('discord.js');
const bot_config = require('./bot.config.json');
const fs = require('fs');

var FBAdmin = require('firebase-admin');

const prefix = bot_config.bot_config.prefix;
const conf_token = bot_config.bot_config.conf_token;

FBAdmin.initializeApp({
    credential: FBAdmin.credential.cert(bot_config.firebase),
    databaseUrl: bot_config.bot_config.db_url
});

const client = new Discord.Client();
client.commands = new Discord.Collection();

//Remove the OR (||) before deploying!
const token = process.env.TOKEN || conf_token;

const cmdFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of cmdFiles){
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
}

client.on("ready", () => {
   console.log('bot is ready');
    client.user.setActivity("SINoALICE Gacha Gacor || !s help", { type: 'LISTENING' });
});

client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try{
        client.commands.get(command).execute(message, args, client, FBAdmin);
    }catch (e) {
        console.error('Error! -> ' + e);
        message.reply('Kurebot is Catching BUG');
    }
})

client.login(token);