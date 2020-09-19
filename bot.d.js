
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
    client.user.setActivity("Renungan para Penggacha || !s help", { type: 'LISTENING' });
});

client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if (!client.commands.has(command)) return;

    if (!client.commands.has(command.name)) {
        client.commands.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = client.commands.get(command.name);
    const cooldownAmount = (command.cooldown || 2) * 1000;

    if (timestamps.has(message.author.id)) {
        
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`has Spam the command, ${timeLeft.toFixed(1)}(s) cooldown.`);
        }
    }
    try{
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        client.commands.get(command).execute(message, args, client, FBAdmin);
        
    }catch (e) {
        console.error('Error! -> ' + e);
        message.reply('Kurebot is Catching BUG');
    }
})

client.login(token);