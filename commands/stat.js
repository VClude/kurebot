module.exports = {
    name: 'stat',
    description: 'check stats member',
    usage: 'No arguments',
    execute(message, args, client, FBAdmin){
        const Discord = require('discord.js');
        const config = require('../bot.config.json');
        const util = require('../util/util');

        const db = FBAdmin.firestore();

 

        if(!message.member.roles.cache.some(role => role.name === config.bot_config.guildmates_role)
        && !message.member.roles.cache.some(role => role.name === config.bot_config.guildmates_role_2)
        ){
        let dsEmbeds = new Discord.MessageEmbed();
        dsEmbeds.setTitle('Insufficient Permission');
        dsEmbeds.setDescription('Sorry you need to be Astellia / Astessia guild member to use this command.');
        dsEmbeds.setColor(15158332);
        message.channel.send(dsEmbeds);
        return;
        }

        if(message.member.roles.cache.some(role => role.name === config.bot_config.guildmates_role)
        && message.member.roles.cache.some(role => role.name === config.bot_config.guildmates_role_2)
        ){
        let dsEmbeds = new Discord.MessageEmbed();
        dsEmbeds.setTitle('Too Many Role');
        dsEmbeds.setDescription('Sorry you cannot be Astellia + Astessia role to use this command.');
        dsEmbeds.setColor(15158332);
        message.channel.send(dsEmbeds);
        return;
        }

        const collectselect = (message.member.roles.cache.some(role => role.name === config.bot_config.guildmates_role)) ? config.bot_config.guildmates_role : config.bot_config.guildmates_role_2; 
        const gearRef = db.collection(collectselect);

        if (collectselect && args.length === 0) {
            message.channel.send('Please type a user to show their stats .**\n Command usage : \`;stat <user>\`**');
        }


        else{
            let stats = {
                patk: 0,
                matk: 0,
                pdef: 0,
                mdef: 0
            };

            util.getNightmaresList(args, gearRef, message).then(nightmares => {
                if(nightmares.length < 1){
                    message.channel.send('No user found!')
                    return
                }
                let user = util.getTrueNightmare(args, nightmares);

                let statString = "";
           
                let totalStat = 0;
                if(user.stats != undefined){
                Object.keys(user.stats).forEach((key,value, index) => {
                    totalStat = parseInt(totalStat) + parseInt(user.stats[key]);
                    
                    statString += ` **${key.toUpperCase()}** \t : \t ${String(user.stats[key]).replace(/(.)(?=(\d{3})+$)/g,'$1,')} \n `;
                });
              
            }
            else {
                statString = "non";
            }

                //Start building embeds
                let dsEmbeds = new Discord.MessageEmbed();
                dsEmbeds.setTitle(user.name + ' - Stat Summary');
                dsEmbeds.setColor(7506394);

                dsEmbeds.addField('Class', user.position);
                dsEmbeds.addField('CP', String(totalStat).replace(/(.)(?=(\d{3})+$)/g,'$1,'));
                dsEmbeds.addField('CP List', statString);
                message.channel.send(dsEmbeds).catch(err => console.error(err));
            }).catch(error => console.error(error));

        }
    }
}