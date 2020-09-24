const { settings } = require("cluster");
const fs = require("fs");
const bot_config = require('../bot.config.json');
// const mysql = require('mysql');
const mys = require('../util/mysql');
const prefix = bot_config.bot_config.prefix;
const Discord = require('discord.js');

let allowed = ['216861675658280961','432496380469182484'];

module.exports = {
    name: 'giveaway',
    cooldown: '5',
    description: 'giveaway crystal',
    execute(message, args, client) {

        function getUserFromMention(mention) {
            if (!mention) return;
        
            if (mention.startsWith('<@') && mention.endsWith('>')) {
                mention = mention.slice(2, -1);
        
                if (mention.startsWith('!')) {
                    mention = mention.slice(1);
                }
        
                return client.users.cache.get(mention);
            }
        }

        const usersz = message.guild.members.cache.get(message.author.id);
        if(!allowed.includes(usersz.user.id)){
            const embed = new Discord.MessageEmbed()
            .setTitle('Command Not Available')
            .setDescription('Heatcliff user only')
            .setColor(12745742)
            message.channel.send({embed});
            return;
        }

        let isnew = false;
        if(!args[0] && !args[1]){
            const emsg = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Panduan Cara topup')
            .setThumbnail('https://i.imgur.com/JQRb99F.png')
            .setDescription(' **!s giveaway <mention> <jumlah crystal>**');
        
            message.channel.send(emsg);
            return;
            // args[1] = 2000;
        }

        if(args[1] && isNaN(args[1])){
           
            args[1] = 2000;
            // const emsg = new Discord.MessageEmbed()
            // .setColor('#0099ff')
            // .setTitle('Panduan Cara topup')
            // .setThumbnail('https://i.imgur.com/JQRb99F.png')
            // .setDescription('tolong isi nominalnya bro bukan huruf **!s topup <jumlah crystal>**');
        
            // message.channel.send(emsg);
            // return;
        }


        if(args[1] && !isNaN(args[1])) {
            if(parseInt(args[1]) > 4000){
                // const emsg = new Discord.MessageEmbed()
                // .setColor('#0099ff')
                // .setTitle('Panduan Cara topup')
                // .setThumbnail('https://i.imgur.com/JQRb99F.png')
                // .setDescription('Topup cant exceed 4000 crystal');
            
                // message.channel.send(emsg);
                // return;
                args[1] = 4000;
            }

            if(parseInt(args[1]) < 10){
                // const emsg = new Discord.MessageEmbed()
                // .setColor('#0099ff')
                // .setTitle('Panduan Cara topup')
                // .setThumbnail('https://i.imgur.com/JQRb99F.png')
                // .setDescription('Topup cant lower than 10 crystal');
            
                // message.channel.send(emsg);
                // return;
                args[1] = 2000;
            }
            let topup = parseInt(args[1]) * 1200;
            let nominal = String(topup).replace(/(.)(?=(\d{3})+$)/g,'$1,');
            let user;
            if (args[0]) {
                let getuser = getUserFromMention(args[0]);
                if(!getuser){
                    const emsg = new Discord.MessageEmbed()
                            .setColor('#fff')
                            .setTitle('Invalid Arguments')
                            .setDescription('**!s statgacha** untuk melihat statistik sendiri, **!s statgacha @user** untuk melihat statistik orang')
                             message.channel.send(emsg);
                             return;
                }
                user = message.guild.members.cache.get(getuser.id);
            }
            else {
             user = message.guild.members.cache.get(message.author.id);
             
            }
            let nickname = user.nickname ? user.nickname : user.user.username;
            let URLgambar = 'https://cdn.discordapp.com/avatars/'+ user.user.id + '/' + user.user.avatar + '.png?size=64';
            let query = 'select * from user where `id` = ?';
            let parser = [user.user.id];

            mys.doQuery(query,parser,function(results){
                let res =JSON.parse(JSON.stringify(results));
                if(res[0]){
                    args[1] = Math.round(parseInt(args[1]));
                    bonus = Math.round(parseInt(args[1]) * 1.2);
                    bbonus = Math.round(parseInt(args[1]) * 0.2);
                    oldGem = res[0].gem;
                    oldMoney = res[0].moneyspent;
                    newGem = parseInt(oldGem) + parseInt(bonus);
                    newMoney = parseInt(oldMoney) + parseInt(topup);
                    query = 'UPDATE user SET gem = ?, moneyspent = ? where id = ?';
                    parser = [newGem,newMoney, user.user.id];
                    let gemus = client.emojis.cache.find(emoji => emoji.name === 'gemus');
                    mys.doQuery(query,parser,function(results){
                        const emsg = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Topup Success')
                        .setThumbnail('https://i.imgur.com/JQRb99F.png')
                        .setDescription('Giveaway ' + args[1] + ' (+' + bbonus + ' bonus) Crystal ke ' + nickname + '  | Seharga : ' + nominal + ' IDR' )
                        .addField(nickname + ' Crystal', `${gemus} ${String(oldGem).replace(/(.)(?=(\d{3})+$)/g,'$1,')}  **>>** ${gemus} ${String(newGem).replace(/(.)(?=(\d{3})+$)/g,'$1,')}`)
                        message.channel.send(emsg);

                    });
                            

                }
               else{
                query = 'INSERT INTO user values (?, ?, ?, ?, ?, ?)';
                parser = [user.user.id, args[1],0, topup, 0, 0];
                mys.doQuery(query,parser,function(results){
                    const emsg = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Topup Success')
                    .setThumbnail('https://i.imgur.com/JQRb99F.png')
                    .setDescription('Giveaway ' + args[1] + ' crystal ke ' + nickname + ' | Seharga : ' + nominal + ' IDR' );
                
                    message.channel.send(emsg);

                });
                        
               }
               
             });


        }

           

         
          
           
          
    
    }
}