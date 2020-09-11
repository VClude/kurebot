const card = require('../../SINoALICE-Datamining/card_en.json');
const skill = require('../../SINoALICE-Datamining/art.json');
const evo_card = require('../../SINoALICE-Datamining/card_evolution.json');

var _ = require('lodash');
const fs = require('fs');

var nightmares = [];

for (let i = 0; i < card.length; i++) {

    if(card[i].cardType === 3 && card[i].evolutionLevel === 0){

        console.log('in iteration ' + i + ' Nightmare->' + card[i].name);

        let nightmare = {};

        nightmare.name = card[i].name;
        nightmare.shortName = card[i].shortName;
        nightmare.attribute = card[i].attribute;
        nightmare.mstId = card[i].cardMstId;
        nightmare.resourceName = card[i].resourceName;

        let evo = _.find(evo_card, {"cardMstId": card[i].cardMstId})
        if(evo !== undefined){
            evo = _.find(card, {"cardMstId": evo.evolvedCardMstId});

            nightmare.evolvedMstId = evo.cardMstId;
            nightmare.evolvedResourceName = evo.resourceName;
            nightmare.rarity = evo.rarity;
            nightmare.isEvolvable = true;
        }else{
            nightmare.rarity = card[i].rarity;
            nightmare.isEvolvable = false;
        }

        let nmSkill, preEvoSkill, storySkill;

        preEvoSkill = _.find(skill, {"artMstId": card[i].artMstId});

        nightmare.skill = {};

        nightmare.skill.gvg = {};

        nightmare.skill.gvg.preEvo = {
            skillName: preEvoSkill.name,
            skillDescription: preEvoSkill.description,
            skillDuration: preEvoSkill.duration,
            skillPreparationTime: preEvoSkill.leadTime,
            skillSPCost: preEvoSkill.sp
        }

        if(nightmare.isEvolvable){
            nmSkill = _.find(skill, {"artMstId": evo.artMstId});
            storySkill = _.find(skill, {"artMstId": evo.questArtMstId})

            nightmare.skill.gvg.postEvo = {
                skillName: nmSkill.name,
                skillDescription: nmSkill.description,
                skillDuration: nmSkill.duration,
                skillPreparationTime: nmSkill.leadTime,
                skillSPCost: nmSkill.sp
            }

        }else{
            storySkill = _.find(skill, {"artMstId": card[i].questArtMstId})
        }

        nightmare.skill.pve = {
            skillName: storySkill.name,
            skillDescription: storySkill.description,
            skillDuration: storySkill.duration,
            skillPreparationTime: storySkill.leadTime,
            skillSPCost: storySkill.sp
        };


        nightmares.push(nightmare);
    }

}

// convert JSON object to string
const data = JSON.stringify(nightmares);

// write JSON string to a file
fs.writeFile('./assets/json/nightmares.json', data, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON data is saved.");
});