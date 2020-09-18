
module.exports = {
    name: 'nm',
    description: 'Get a detailed information of a nightmare',
    usage: '<nightmare>',
    execute(message, args, client, FBAdmin) {
        const util = require('../util/util');
        const Discord = require('discord.js');

        const db = FBAdmin.firestore();
        const nmRef = db.collection('nightmares');

        if (args.length === 0) {
            message.channel.send('Please type a nightmare to show it\'s details.**\n Command usage : \`!s nm <nightmare_name>\`**');
            return;
        }

        util.getNightmaresList(args, nmRef, message).then(nightmares => {
            if(nightmares.length < 1){
                message.channel.send('No nightmares matched ' + joinedArgs + ' found!')
                return
            }

            let nightmare = util.getTrueNightmare(args, nightmares);

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
                    value: nightmare.isEvolvable ? `${nightmare.skill.gvg.postEvo.skillDuration}s (${nightmare.skill.gvg.preEvo.skillDuration}s unevolved) ${nightmare.skill.gvg.preEvo.skillDuration === 0 ? '(immediate)' : ''}` : `${nightmare.skill.gvg.preEvo.skillDuration}s ${nightmare.skill.gvg.preEvo.skillDuration === 0 ? '(immediate)' : ''}`,
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
            dsEmbeds.setThumbnail(nightmare.isEvolvable ? `https://sinoalice.game-db.tw/images/card/CardS${nightmare.evolvedResourceName}.png` : `https://sinoalice.game-db.tw/images/card/CardS${nightmare.resourceName}.png`);
            message.channel.send(dsEmbeds).catch(err => console.error(err));
        }).catch(error => console.error(error));

    }
}