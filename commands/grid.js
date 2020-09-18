module.exports = {
    name: 'grid',
    description: 'List all/specific grid member',
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
            message.channel.send('Please type a user to show their grid .**\n Command usage : \`;grid all or ;grid <user>\`**');
        }

        else if (args[0] === 'all'){
            gearRef.get().then(gearSnapshot => {

                if(gearSnapshot.empty){
                    message.channel.send("No members found");
                }

                let globalMember = [];
                let memberPromises = [];
                let weaponObject = {
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
                let elements = {
                    fire: 0,
                    water: 0,
                    wind: 0
                };
                let nightmares = {};

                gearSnapshot.forEach(gear => {
                    let gearData = gear.data();
                    let members = {};
                    members.job = util.getJobFromWeapon(client, gearData.weapon);
                    members.id = gear.id;
                    members.name = gearData.name;
                    globalMember.push(members);
               
                    memberPromises.push(client.users.fetch(gear.id));

                    Object.keys(gearData.element).forEach((key, index) => {
                        elements[key] += gearData.element[key];
                    })
                    
                    Object.keys(gearData.weapon).forEach((key, index) => {
                        weaponObject[key].amount += gearData.weapon[key];
                    })

                    for (let i = 0; i < gearData.nightmares.length; i++) {
                        if(nightmares.hasOwnProperty(gearData.nightmares[i])){
                            nightmares[gearData.nightmares[i]].total += ' , <@' + gear.id + '>';
                        }else{
                            nightmares[gearData.nightmares[i]] = {
                                total: '<@' + gear.id + '>',
                            }
                        }
                    }

                    // if(gearData.hasOwnProperty('summonJob')){
                    //     nightmares[gearData.summonJob].summonJob = gear.id;
                    // }
                });

                Promise.all(memberPromises).then(members => {
                    let membersObj = {};
            
                    members.forEach(member => {
                    membersObj[member.id] = '<@' + member.id + '>';
                    })
 
                    globalMember = globalMember.sort((a, b) => a.job.priority > b.job.priority ? 1 : -1);
                    let memberString = "";
                    for (let i = 0; i < globalMember.length; i++) {
                        let guildmate = globalMember[i];
                        memberString += `${client.emojis.cache.get(guildmate.job.emojiId)} ${membersObj[guildmate.id]} | IGN : ${guildmate.name} \n`
                    }

                    let weapString = "";
                    Object.keys(weaponObject).forEach((key, index) => {
                        weapString += `${client.emojis.cache.get(weaponObject[key].emojiId)} ${weaponObject[key].amount} `
                        if(index === 3) weapString += '\n';
                    });

                    let elementString = "";
                    Object.keys(elements).forEach((key, index) => {
                        elementString += `${util.evalAttribute(key, client)} ${elements[key]} `;
                    });

                    let nightmareString = "";
               
                    Object.keys(nightmares).forEach((key, index) => {
                        nightmareString += `${key} (${nightmares[key].total}) `;
                        // if(nightmares[key].hasOwnProperty('summonJob')) nightmareString += `(${membersObj[nightmares[key].summonJob]})`;
                        nightmareString += '\n';
                    })

                    //Start building embeds
                    let dsEmbeds = new Discord.MessageEmbed();
                    dsEmbeds.setTitle(collectselect + ' - Guild member gear summary');
                    dsEmbeds.setDescription('The following are all of the member\'s gear summary');
                    dsEmbeds.setColor(7506394);

                    dsEmbeds.addField('Members', memberString);
                    dsEmbeds.addField('Weapons', weapString);
                    dsEmbeds.addField('Elements', elementString);
                    dsEmbeds.addField('Nightmares', nightmareString);

                    message.channel.send(dsEmbeds);


                }).catch(err => console.error(err));

            }).catch(err => console.error(err))
        }

        else{
            let weaponObject = {
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
            let elements = {
                fire: 0,
                water: 0,
                wind: 0
            };
            let nightmares = {};

            util.getNightmaresList(args, gearRef, message).then(nightmares => {
                if(nightmares.length < 1){
                    message.channel.send('No user found!')
                    return
                }
                let user = util.getTrueNightmare(args, nightmares);
                let weapString = "";
                Object.keys(user.weapon).forEach((key,index) => {
                    weapString += `${client.emojis.cache.get(weaponObject[key].emojiId)} ${user.weapon[key]} `
                    if(index === 3) weapString += '\n';
                });

                let elementString = "";
                Object.keys(user.element).forEach((key, index) => {
                    elementString += `${util.evalAttribute(key, client)} ${user.element[key]} `;
                });

                let nightmareString = "";
                Object.keys(user.nightmares).forEach((key, index) => {
                    nightmareString += '- ' + `${user.nightmares[index]}`;
                    nightmareString += '\n';
                })
                //Start building embeds
                let dsEmbeds = new Discord.MessageEmbed();
                dsEmbeds.setTitle(user.name + ' - Grid Summary');
                dsEmbeds.setColor(7506394);

                dsEmbeds.addField('Class', user.position);
              
                dsEmbeds.addField('Weapons', weapString);
           
                dsEmbeds.addField('Elements', elementString);
          
                dsEmbeds.addField('Nightmares', nightmareString);
                message.channel.send(dsEmbeds).catch(err => console.error(err));
            }).catch(error => console.error(error));

        }
    }
}