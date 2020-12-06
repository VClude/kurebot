module.exports = {
    name: 'listnm',
    description: 'List all member\'s gear summary, or someone\'s nm summary',
    usage: 'No arguments, or `@mentions` someone to get his/her nm summary',
    execute(message, args, client, FBAdmin){
        const Discord = require('discord.js');
        const util = require('../util/util');
        const string = require('../util/string.json');
        const locStr = string.en;
        const config = require('../bot.config.json');

        const db = FBAdmin.firestore();
        const gearRef = db.collection('guildmates');
        let server = message.guild.id;
   
        if(server != config.bot_config.guildmates_id){
            return;
        }

        if(!message.member.roles.cache.some(role => role.name === config.bot_config.guildmates_role)){
            return;
        }

        var weaponObject = {
            sword: {
                amount: 0,
                emojiId: '753833365118910494',
            },
            heavy: {
                amount: 0,
                emojiId: '753811624011366460',
            },
            projectile: {
                amount: 0,
                emojiId: '753833334852812903',
            },
            polearm: {
                amount: 0,
                emojiId: '753833319254196305',
            },
            instrument: {
                amount: 0,
                emojiId: '753833301399306280',
            },
            tome: {
                amount: 0,
                emojiId: '753833378478030848',
            },
            staff: {
                amount: 0,
                emojiId: '753833351080575037',
            }
        };
        var elements = {
            fire: 0,
            water: 0,
            wind: 0
        };

        if(args.length > 0){
            
            let users = util.getMention(args[0], client);
            if(!users){
                message.channel.send(`${locStr.err_general_usage_error} ${this.usage}`)
                return;
            }
            gearRef.doc(users.id).get().then(guildmate => {
                if(!guildmate.exists){
                    message.channel.send(locStr.err_no_members);
                    return;
                }

                let gear = guildmate.data();
              



                //Start building embeds
        
                let URLgambar = 'https://cdn.discordapp.com/avatars/'+ users.id + '/' + users.avatar + '.png';                let dsEmbeds = new Discord.MessageEmbed();
                dsEmbeds.setTitle(`${users.username} NM list`);
                dsEmbeds.setColor(7506394);
                dsEmbeds.setThumbnail(URLgambar);
                dsEmbeds.addField('Owned nightmares', '- ' + gear.nightmares.join('\n- '));

                message.channel.send(dsEmbeds);
            })
        }

        else{
            
            const user = message.guild.members.cache.get(message.author.id);
            gearRef.doc(user.user.id).get().then(guildmate => {
                if(!guildmate.exists){
                    message.channel.send(locStr.err_no_members);
                    return;
                }

                let gear = guildmate.data();
              



                //Start building embeds
                let nickname = user.nickname ? user.nickname : user.user.username;
        let URLgambar = 'https://cdn.discordapp.com/avatars/'+ user.user.id + '/' + user.user.avatar + '.png';
                let dsEmbeds = new Discord.MessageEmbed();
                dsEmbeds.setTitle(`${nickname} NM list`);
                dsEmbeds.setColor(7506394);
                dsEmbeds.setThumbnail(URLgambar);
                dsEmbeds.addField('Owned nightmares', '- ' + gear.nightmares.join('\n- '));

                message.channel.send(dsEmbeds);
            })
           
        }

    }
}