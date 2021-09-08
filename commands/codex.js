const { settings } = require("cluster");
const fs = require("fs");
const bot_config = require('../bot.config.json');
const mysql = require('mysql');
const prefix = bot_config.bot_config.prefix;
const Discord = require('discord.js');
const { evalWeap } = require("../util/util");
const { toInteger } = require("lodash");
module.exports = {
    name: 'codex',
    description: 'Get information about your weapon list',
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
            let user = message.guild.members.cache.get(message.author.id);
            let thenumber;
            const reg = new RegExp('^[0-9]+$');
            if (reg.test(args[0])) {
                thenumber = args[0] - 1;
                
            }
            else{
                thenumber = 0;
            }

            

       
     
        
        
        let nickname = user.nickname ? user.nickname : user.user.username;
        let URLgambar = 'https://cdn.discordapp.com/avatars/'+ user.user.id + '/' + user.user.avatar + '.png';
        let connection = mysql.createConnection({
            host     : bot_config.sql_config.host,
            user     : bot_config.sql_config.user,
            password : bot_config.sql_config.password,
            database : bot_config.sql_config.database
          });
          connection.connect();

          if (args[0] && !reg.test(args[0])) {
            let query = 'select * from gacha where `id` = ? and weapname like' + connection.escape('%'+args[0]+'%');
            let parser = [user.user.id];
            
            let ds = connection.query(query,parser, function (error, results, fields) {
                if (error) throw error;
                let res =JSON.parse(JSON.stringify(results))
                    if(res[0]){
                        let length = res.length;
                        const emsg = new Discord.MessageEmbed()
                        if(length > 0){
                            Object.keys(res).forEach( (key, index) => {
                                emsg.addField(res[key].weapname, 'Limit Breaks : ' + res[key].qty,false)
    
    
                            });
                            let dsa = toInteger(length / 20);
                            emsg.setFooter("!s codex  <number> to navigate || !s codex  <weapon name> to view specific weapon");

                        }
                        else{
                            emsg.setDescription("uh oh, looks like you havent pull yet");
                        }
                   
                        
                            emsg.setColor('#0099ff')
                            .setThumbnail(URLgambar)
                            .setTitle(nickname + ' Weapon Codex')

                        message.channel.send(emsg);
                    }
                   else{
                            const emsg = new Discord.MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle('Weapon not found')
                             message.channel.send(emsg);
          
                   }
            
              });
            }

        else{
            let query = 'select * from gacha where `id` = ? LIMIT 20 OFFSET ?';
            let parser = [user.user.id, thenumber * 20];

            connection.query(query,parser, function (error, results, fields) {
                if (error) throw error;
                let res =JSON.parse(JSON.stringify(results))
                    if(res[0]){
                        let length = res.length;
                        const emsg = new Discord.MessageEmbed()
                        if(length > 0){
                            Object.keys(res).forEach( (key, index) => {
                                emsg.addField(res[key].weapname, 'Limit Breaks : ' + res[key].qty,false)
    
    
                            });
                            let dsa = toInteger(length / 20);
                            emsg.setFooter("!s codex  <number> to navigate || !s codex  <weapon name> to view specific weapon");

                        }
                        else{
                            emsg.setDescription("uh oh, looks like you havent pull yet");
                        }
                   
                        
                            emsg.setColor('#0099ff')
                            .setThumbnail(URLgambar)
                            .setTitle(nickname + ' Weapon Codex')

                        message.channel.send(emsg);
                    }
                   else{
                            const emsg = new Discord.MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle('Page not found')
                            message.channel.send(emsg);
          
                   }
            
              });
        }
         
           
           

         
          
           
          connection.end();
    
    }
}