module.exports = {
    name: 'enemy',
    description: 'check enemy for colo',
    usage: 'No arguments',
    execute(message, args, client, FBAdmin){
        const Discord = require('discord.js');
        const config = require('../bot.config.json');
        const util = require('../util/util');

        const db = FBAdmin.firestore();
        const weaponObject = {
            sword: {
                amount: 0,
                emojiId: '755241841523425330',
            },
            heavy: {
                amount: 0,
                emojiId: '755247997381640242',
            },
            projectile: {
                amount: 0,
                emojiId: '755247997163405403',
            },
            polearm: {
                amount: 0,
                emojiId: '755247997398417478',
            },
            instrument: {
                amount: 0,
                emojiId: '755247997213737091',
            },
            tome: {
                amount: 0,
                emojiId: '755247997167730761',
            },
            staff: {
                amount: 0,
                emojiId: '755247997314531411',
            }
        };
 

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
        const gearRef = db.collection("enemy").doc(collectselect);

        gearRef.get().then(gearSnapshot => {
            
            if(gearSnapshot.empty || gearSnapshot.data().name == ""){
                message.channel.send("Matchmaking is still on Progress");
            }
            let enemyData = gearSnapshot.data();
            let enemyDemon = enemyData.Demon;
            let enemyDesc = enemyData.Desc;
            let enemyMembers = enemyData.members;
            let enemyName = enemyData.name;

       

            let descString = "";
            Object.keys(enemyDesc).forEach((key,index) => {
                
                descString += ` **${key}** \t : \t ${enemyDesc[key]} \n `;

            });

            let demonString = "";

            gm1 = client.emojis.cache.find(emoji => emoji.name === enemyDemon["First"][0]);
            gm2 = client.emojis.cache.find(emoji => emoji.name === enemyDemon["First"][1]);
            gm3 = client.emojis.cache.find(emoji => emoji.name === enemyDemon["First"][2]);
                demonString += `${gm1} ${gm2} ${gm3} `;

            let sdemonString = "";

            sgm1 = client.emojis.cache.find(emoji => emoji.name === enemyDemon["Second"][0]);
            sgm2 = client.emojis.cache.find(emoji => emoji.name === enemyDemon["Second"][1]);
            sgm3 = client.emojis.cache.find(emoji => emoji.name === enemyDemon["Second"][2]);
                sdemonString += ` ${sgm1} ${sgm2} ${sgm3} `;
   

            let enemyString = "";
            let enemy2String = "";
            let enemy3String = "";
            if (args.length === 0) {            
            if (enemyMembers[1].Name == ""){
                enemyString = "Enemy Member Stats aren't available at the moment, please try again later.";
                let dsEmbeds = new Discord.MessageEmbed();
                dsEmbeds.setTitle('Enemy Details 3');
                dsEmbeds.setColor(7506394);
                dsEmbeds.addField('Guild Name', "" + enemyName, true);
                dsEmbeds.addField('Guild Desc', descString, true);
                dsEmbeds.addField('---------------------------', '**Details Information** \n ---------------------------');
                dsEmbeds.addField('First Demon', demonString,true);
                dsEmbeds.addField('Second Demon', sdemonString,true);
                dsEmbeds.addField('---------------------------', '**Member Details** \n ---------------------------');
                dsEmbeds.addField('Enemy Info', enemyString,true);
                dsEmbeds.setFooter('This information may not be accurate due enemy are hiding their true grid. \n !s enemy 2 / !s enemy 3 for further enemy details.');
    
                message.channel.send(dsEmbeds);
            }
            else{
                for (let key = 1; key < 6; key++) {
                    if(enemyMembers[key].Name == ""){

                    }
                    else{
                    enemyString += ` **Name** :  ${enemyMembers[key].Name} \n `;
                    enemyString += ` **Class** :  ${enemyMembers[key].Class} \n `;
                    enemyString += ` **Rank** :  ${enemyMembers[key].Rank} \n `;
                    enemyString += ` **HP** :  ${String(enemyMembers[key].HP).replace(/(.)(?=(\d{3})+$)/g,'$1,')} \n`;
                    enemyString += ` **Point** :  ${String(enemyMembers[key].Point).replace(/(.)(?=(\d{3})+$)/g,'$1,')} \n \n`;
                    enemy3String += `**PATK** :  ${String(enemyMembers[key].PATK).replace(/(.)(?=(\d{3})+$)/g,'$1,')} \n `;
                    enemy3String += ` **MATK** :  ${String(enemyMembers[key].MATK).replace(/(.)(?=(\d{3})+$)/g,'$1,')} \n `;
                    enemy3String += ` **PDEF** :  ${String(enemyMembers[key].PDEF).replace(/(.)(?=(\d{3})+$)/g,'$1,')} \n `;
                    enemy3String += ` **MDEF** :  ${String(enemyMembers[key].MDEF).replace(/(.)(?=(\d{3})+$)/g,'$1,')} \n \n \n`;
                    }

                }

                let dsEmbeds = new Discord.MessageEmbed();
                dsEmbeds.setTitle('Today Match');
                dsEmbeds.setColor(7506394);
                dsEmbeds.addField('Guild Name', "" + enemyName, true);
                dsEmbeds.addField('Guild Desc', descString, true);
                dsEmbeds.addField('---------------------------', '**Details Information** \n ---------------------------');
                dsEmbeds.addField('First Demon', demonString,true);
                dsEmbeds.addField('Second Demon', sdemonString,true);
                dsEmbeds.addField('---------------------------', '**Member Details** \n ---------------------------');
                dsEmbeds.addField('Enemy Info', enemyString,true);
                dsEmbeds.addField('Stat Info', enemy3String,true);
                dsEmbeds.setFooter('This information may not be accurate due enemy are hiding their true grid. \n !s enemy 2 / !s enemy 3 for further enemy details.');
    
                message.channel.send(dsEmbeds);
        }
    }
    else if(args[0] == '2') {

                    
        if (enemyMembers[6].Name == ""){
            enemyString = "Enemy Member Stats aren't available at the moment, please try again later.";
            let dsEmbeds = new Discord.MessageEmbed();
            dsEmbeds.setTitle('Enemy Details 3');
            dsEmbeds.setColor(7506394);
            dsEmbeds.addField('Guild Name', "" + enemyName, true);
            dsEmbeds.addField('Guild Desc', descString, true);
            dsEmbeds.addField('---------------------------', '**Details Information** \n ---------------------------');
            dsEmbeds.addField('First Demon', demonString,true);
            dsEmbeds.addField('Second Demon', sdemonString,true);
            dsEmbeds.addField('---------------------------', '**Member Details** \n ---------------------------');
            dsEmbeds.addField('Enemy Info', enemyString,true);
            dsEmbeds.setFooter('This information may not be accurate due enemy are hiding their true grid. \n !s enemy 2 / !s enemy 3 for further enemy details.');

            message.channel.send(dsEmbeds);
        }
        else{
            for (let key = 6; key < 11; key++) {
                if(enemyMembers[key].Name == ""){

                }
                else{
                enemyString += ` **Name** :  ${enemyMembers[key].Name} \n `;
                enemyString += ` **Class** :  ${enemyMembers[key].Class} \n `;
                enemyString += ` **Rank** :  ${enemyMembers[key].Rank} \n `;
                enemyString += ` **HP** :  ${String(enemyMembers[key].HP).replace(/(.)(?=(\d{3})+$)/g,'$1,')} \n`;
                enemyString += ` **Point** :  ${String(enemyMembers[key].Point).replace(/(.)(?=(\d{3})+$)/g,'$1,')} \n \n`;
                enemy3String += `**PATK** :  ${String(enemyMembers[key].PATK).replace(/(.)(?=(\d{3})+$)/g,'$1,')} \n `;
                enemy3String += ` **MATK** :  ${String(enemyMembers[key].MATK).replace(/(.)(?=(\d{3})+$)/g,'$1,')} \n `;
                enemy3String += ` **PDEF** :  ${String(enemyMembers[key].PDEF).replace(/(.)(?=(\d{3})+$)/g,'$1,')} \n `;
                enemy3String += ` **MDEF** :  ${String(enemyMembers[key].MDEF).replace(/(.)(?=(\d{3})+$)/g,'$1,')} \n \n \n`;
                }

            }

            let dsEmbeds = new Discord.MessageEmbed();
            dsEmbeds.setTitle('Enemy Details 2');
            dsEmbeds.setColor(7506394);
            dsEmbeds.addField('Guild Name', "" + enemyName, true);
            dsEmbeds.addField('Guild Desc', descString, true);
            dsEmbeds.addField('---------------------------', '**Details Information** \n ---------------------------');
            dsEmbeds.addField('First Demon', demonString,true);
            dsEmbeds.addField('Second Demon', sdemonString,true);
            dsEmbeds.addField('---------------------------', '**Member Details** \n ---------------------------');
            dsEmbeds.addField('Enemy Info', enemyString,true);
            dsEmbeds.addField('Stat Info', enemy3String,true);
            dsEmbeds.setFooter('This information may not be accurate due enemy are hiding their true grid. \n !s enemy 2 / !s enemy 3 for further enemy details.');

            message.channel.send(dsEmbeds);
    }

    }

    else if(args[0] == '3') {

                    
        if (enemyMembers[11].Name == ""){
            enemyString = "Enemy Member Stats aren't available at the moment, please try again later.";
            let dsEmbeds = new Discord.MessageEmbed();
            dsEmbeds.setTitle('Enemy Details 3');
            dsEmbeds.setColor(7506394);
            dsEmbeds.addField('Guild Name', "" + enemyName, true);
            dsEmbeds.addField('Guild Desc', descString, true);
            dsEmbeds.addField('---------------------------', '**Details Information** \n ---------------------------');
            dsEmbeds.addField('First Demon', demonString,true);
            dsEmbeds.addField('Second Demon', sdemonString,true);
            dsEmbeds.addField('---------------------------', '**Member Details** \n ---------------------------');
            dsEmbeds.addField('Enemy Info', enemyString,true);
            dsEmbeds.setFooter('This information may not be accurate due enemy are hiding their true grid. \n !s enemy 2 / !s enemy 3 for further enemy details.');

            message.channel.send(dsEmbeds);
        }
        else{
            for (let key = 11; key < 16; key++) {
                if(enemyMembers[key].Name == ""){

                }
                else{
                enemyString += ` **Name** :  ${enemyMembers[key].Name} \n `;
                enemyString += ` **Class** :  ${enemyMembers[key].Class} \n `;
                enemyString += ` **Rank** :  ${enemyMembers[key].Rank} \n `;
                enemyString += ` **HP** :  ${String(enemyMembers[key].HP).replace(/(.)(?=(\d{3})+$)/g,'$1,')} \n`;
                enemyString += ` **Point** :  ${String(enemyMembers[key].Point).replace(/(.)(?=(\d{3})+$)/g,'$1,')} \n \n`;
                enemy3String += `**PATK** :  ${String(enemyMembers[key].PATK).replace(/(.)(?=(\d{3})+$)/g,'$1,')} \n `;
                enemy3String += ` **MATK** :  ${String(enemyMembers[key].MATK).replace(/(.)(?=(\d{3})+$)/g,'$1,')} \n `;
                enemy3String += ` **PDEF** :  ${String(enemyMembers[key].PDEF).replace(/(.)(?=(\d{3})+$)/g,'$1,')} \n `;
                enemy3String += ` **MDEF** :  ${String(enemyMembers[key].MDEF).replace(/(.)(?=(\d{3})+$)/g,'$1,')} \n \n \n`;
                }

            }

            let dsEmbeds = new Discord.MessageEmbed();
            dsEmbeds.setTitle('Enemy Details 3');
            dsEmbeds.setColor(7506394);
            dsEmbeds.addField('Guild Name', "" + enemyName, true);
            dsEmbeds.addField('Guild Desc', descString, true);
            dsEmbeds.addField('---------------------------', '**Details Information** \n ---------------------------');
            dsEmbeds.addField('First Demon', demonString,true);
            dsEmbeds.addField('Second Demon', sdemonString,true);
            dsEmbeds.addField('---------------------------', '**Member Details** \n ---------------------------');
            dsEmbeds.addField('Enemy Info', enemyString,true);
            dsEmbeds.addField('Stat Info', enemy3String,true);
            dsEmbeds.setFooter('This information may not be accurate due enemy are hiding their true grid. \n !s enemy 2 / !s enemy 3 for further enemy details.');

            message.channel.send(dsEmbeds);
    }

    }
   

        }).catch(err => console.error(err))
        






    }
        

}