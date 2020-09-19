const { settings } = require("cluster");
const fs = require("fs");
const bot_config = require('../bot.config.json');
const mysql = require('mysql');
const prefix = bot_config.bot_config.prefix;

module.exports = {
    name: 'statgacha',
    description: 'Get information about your gacha statistics',
    execute(message, args, client) {
        const user = message.guild.members.cache.get(message.author.id);
        let nickname = user.nickname ? user.nickname : user.user.username;
        let URLgambar = 'https://cdn.discordapp.com/avatars/'+ user.user.id + '/' + user.user.avatar + '.png?size=64';
        let query = 'select * from user where `id` = ?';
        let parser = [user.user.id];
        let connection = mysql.createConnection({
            host     : bot_config.sql_config.host,
            user     : bot_config.sql_config.user,
            password : bot_config.sql_config.password,
            database : bot_config.sql_config.database
          });
          connection.connect();
         
            connection.query(query,parser, function (error, results, fields) {
                if (error) throw error;
                const Discord = require('discord.js');
                let res =JSON.parse(JSON.stringify(results))
                    if(res[0]){
                        let gemus = client.emojis.cache.find(emoji => emoji.name === 'gemus');
                        let gempf = String(res[0].gem).replace(/(.)(?=(\d{3})+$)/g,'$1,');
                        let ratio = parseInt(res[0].gachapull) / parseInt(res[0].srcollect) * 100;
                        const emsg = new Discord.MessageEmbed()
                            .setColor('#0099ff')
                            .setThumbnail(URLgambar)
                            .setTitle(nickname + ' Gacha Statistics')
                            .addField('Gacha Pulled', res[0].gachapull + ' Times',true)
                            .addField('SR Collected', res[0].srcollect,true)
                            .addField('Luck Ratio', ratio + ' %',false)
                            .addField('Crystal Spent on Gacha', `${gemus} ${res[0].spent}`,false)
                            .addField('Money Spent on Topup', String(res[0].moneyspent).replace(/(.)(?=(\d{3})+$)/g,'$1,') + ' IDR',false)
                            .setDescription(`Total ${gemus} : ${gempf}`);
                        
                        message.channel.send(emsg);
                    }
                   else{
                            const emsg = new Discord.MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle('Data Not Found')
                            .setDescription('lo belom topup, sana topup **!s topup**');
                        
                        message.channel.send(emsg);
          
                   }
            
              });
           

         
          
           
          connection.end();
    
    }
}