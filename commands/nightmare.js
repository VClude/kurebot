
module.exports = {
    name: 'nightmare',
    description: 'Get a detailed information of a nightmare',
    usage: '<nightmare>',
    execute(message, args, client, FBAdmin) {
        const util = require('../util/util');
        const Discord = require('discord.js');

        if (args.length === 0) {
            message.channel.send('Please type a nightmare to show it\'s details.**\n Command usage : \`;nightmare <nightmare_name>\`**');
            return;
        }

        if(args.length > 1){
            args[0] = args.join(' ');
        }

        if(args[0].length < 3){
            message.channel.send('Please provide more than 3 characters for searching.');
            return;
        }

        const searchStr = util.strToTitle(args[0]);

        const db = FBAdmin.firestore();
        const nmRef = db.collection('nightmares');

        let strLen = searchStr.length;
        let strFrontCode = searchStr.slice(0, strLen-1);
        let strEndCode = searchStr.slice(strLen-1, args[0].length);
        let endStr = strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);

        const query = nmRef.where('name', '>=', searchStr)
                            .where('name', '<', endStr);

        const snapshot = query.get().then(nightmares => {
            if(nightmares.empty){
                message.channel.send('No nightmares matched ' + args[0] + ' found!')
                return
            }
            nightmares.forEach(nm => {
                let nightmare = nm.data();

                //Start building embeds
                let dsEmbeds = new Discord.MessageEmbed();

                dsEmbeds.setTitle(util.evalAttribute(nightmare.attribute, client) + " " + nightmare.name);
                dsEmbeds.setDescription(`${nightmare.name}'s information`);
                dsEmbeds.setColor(7506394);
                dsEmbeds.addField("Skill", nightmare.isEvolvable ? nightmare.skill.gvg.postEvo.skillName : nightmare.skill.gvg.preEvo.skillName, nightmare.isEvolvable);
                if(nightmare.isEvolvable){
                    dsEmbeds.addField("Pre evolution skill", nightmare.skill.gvg.preEvo.skillName, nightmare.isEvolvable);
                }
                dsEmbeds.addFields(
                    {
                        name: "Preparation Time",
                        value: nightmare.isEvolvable ? `${nightmare.skill.gvg.postEvo.skillPreparationTime}s (${nightmare.skill.gvg.preEvo.skillPreparationTime}s unevolved)` : `${nightmare.skill.gvg.preEvo.skillPreparationTime}`,
                        inline: false
                    },
                    {
                        name: "Duration",
                        value: nightmare.isEvolvable ? `${nightmare.skill.gvg.postEvo.skillDuration}s (${nightmare.skill.gvg.preEvo.skillDuration}s unevolved) ${nightmare.skill.gvg.preEvo.skillDuration === 0 ? '(immediate)' : ''}` : `${nightmare.skill.gvg.preEvo.skillDuration} ${nightmare.skill.gvg.preEvo.skillDuration === 0 ? '(immediate)' : ''}`,
                        inline: false
                    },
                    {
                        name: "SP Cost",
                        value: `${nightmare.skill.gvg.preEvo.skillSPCost}`,
                        inline: false
                    },
                    {
                        name: "Effects",
                        value: nightmare.isEvolvable ? nightmare.skill.gvg.postEvo.skillDescription : nightmare.skill.gvg.preEvo.skillDescription,
                        inline: false
                    }
                )
                dsEmbeds.setThumbnail(nightmare.isEvolvable ? `https://sinoalice.game-db.tw/images/card/CardS${nightmare.mstId+1}.png` : `https://sinoalice.game-db.tw/images/card/CardS${nightmare.mstId}.png`);
                dsEmbeds.setFooter('Tempest sinoalice bot © 2020 - Good weapons are more important than good waifu -T');

                message.channel.send(dsEmbeds).catch(err => console.error(err));
            })
        });
    }
}