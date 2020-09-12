module.exports = {
    name: 'gear',
    description: 'List all member gears',
    usage: 'No arguments',
    execute(message, args, client, FBAdmin){
        const Discord = require('discord.js');
        const util = require('../util/util');

        const db = FBAdmin.firestore();
        const gearRef = db.collection('guildmates');

        gearRef.get().then(gearSnapshot => {

            if(gearSnapshot.empty){
                message.channel.send("No members found");
            }

            let globalMember = [];
            let memberPromises = [];
            let weaponObject = {
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
                        nightmares[gearData.nightmares[i]].total += 1;
                    }else{
                        nightmares[gearData.nightmares[i]] = {
                            total: 1,
                        }
                    }
                }

                if(gearData.hasOwnProperty('summonJob')){
                    nightmares[gearData.summonJob].summonJob = gear.id;
                }
            });

            Promise.all(memberPromises).then(members => {
                let membersObj = {};

                members.forEach(member => {
                   membersObj[member.id] = member.username;
                })

                globalMember = globalMember.sort((a, b) => a.job.priority > b.job.priority ? 1 : -1);

                let memberString = "";
                for (let i = 0; i < globalMember.length; i++) {
                    let guildmate = globalMember[i];
                    memberString += `${client.emojis.cache.get(guildmate.job.emojiId)} ${membersObj[guildmate.id]} \n`
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
                    if(nightmares[key].hasOwnProperty('summonJob')) nightmareString += `(${membersObj[nightmares[key].summonJob]})`;
                    nightmareString += '\n';
                })

                //Start building embeds
                let dsEmbeds = new Discord.MessageEmbed();
                dsEmbeds.setTitle('Tempest - Guild member gear summary');
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
}