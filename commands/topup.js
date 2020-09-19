const { settings } = require("cluster");
const fs = require("fs");
const bot_config = require('../bot.config.json');
// const mysql = require('mysql');
const mys = require('../util/mysql');
const prefix = bot_config.bot_config.prefix;
const Discord = require('discord.js');


module.exports = {
    name: 'topup',
    description: 'topup gem for gacha',
    execute(message, args, client) {
        let isnew = false;
        if(args.length === 0){
            const emsg = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Panduan Cara topup')
            .setThumbnail('https://i.imgur.com/JQRb99F.png')
            .setDescription(' **!s topup <jumlah crystal>**');
        
            message.channel.send(emsg);
            return;
        }

        if(args[0] && isNaN(args[0])){
           
            const emsg = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Panduan Cara topup')
            .setThumbnail('https://i.imgur.com/JQRb99F.png')
            .setDescription('tolong isi nominalnya bro bukan huruf **!s topup <jumlah crystal>**');
        
            message.channel.send(emsg);
            return;
        }


        if(args[0] && !isNaN(args[0])) {
            if(parseInt(args[0]) > 1000){
                const emsg = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Panduan Cara topup')
                .setThumbnail('https://i.imgur.com/JQRb99F.png')
                .setDescription('Topup cant exceed 1000 crystal');
            
                message.channel.send(emsg);
                return;
            }
            let topup = parseInt(args[0]) * 1200;
            let nominal = String(topup).replace(/(.)(?=(\d{3})+$)/g,'$1,');
            const user = message.guild.members.cache.get(message.author.id);
            let nickname = user.nickname ? user.nickname : user.user.username;
            let URLgambar = 'https://cdn.discordapp.com/avatars/'+ user.user.id + '/' + user.user.avatar + '.png?size=64';
            let query = 'select * from user where `id` = ?';
            let parser = [user.user.id];

            mys.doQuery(query,parser,function(results){
                let res =JSON.parse(JSON.stringify(results));
                if(res[0]){
                    oldGem = res[0].gem;
                    oldMoney = res[0].moneyspent;
                    newGem = parseInt(oldGem) + parseInt(args[0]);
                    newMoney = parseInt(oldMoney) + parseInt(topup);
                    query = 'UPDATE user SET gem = ?, moneyspent = ? where id = ?';
                    parser = [newGem,newMoney, user.user.id];
                    let gemus = client.emojis.cache.find(emoji => emoji.name === 'gemus');
                    mys.doQuery(query,parser,function(results){
                        const emsg = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Topup Success')
                        .setThumbnail('https://i.imgur.com/JQRb99F.png')
                        .setDescription('Topup ' + args[0] + ' crystal | Seharga : ' + nominal + ' IDR' )
                        .addField('Your Crystal', `${gemus} ${oldGem}  **>>** ${gemus} ${newGem}`)
                        message.channel.send(emsg);

                    });
                            

                }
               else{
                query = 'INSERT INTO user values (?, ?, ?, ?, ?, ?)';
                parser = [user.user.id, args[0],0, topup, 0, 0];
                mys.doQuery(query,parser,function(results){
                    const emsg = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Topup Success')
                    .setThumbnail('https://i.imgur.com/JQRb99F.png')
                    .setDescription('Topup ' + args[0] + ' crystal | Seharga : ' + nominal + ' IDR' );
                
                    message.channel.send(emsg);

                });
                        
               }
               
             });


        }

           

         
          
           
          
    
    }
}