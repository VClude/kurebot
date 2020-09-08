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
        nightmare.mstId = card[i].cardMstId;
        nightmare.resourceName = card[i].resourceName;

        let evo = _.find(evo_card, {"cardMstId": card[i].cardMstId})
        if(evo !== undefined){
            evo = _.find(card, {"cardMstId": evo.evolvedCardMstId});

            nightmare.rarity = evo.rarity;
            nightmare.isEvolvable = true;
        }else{
            nightmare.rarity = card[i].rarity;
            nightmare.isEvolvable = false;
        }

        let nmSkill, preEvoSkill;

        if(nightmare.isEvolvable){
            preEvoSkill = _.find(skill, {"artMstId": card[i].artMstId});
            nmSkill = _.find(skill, {"artMstId": evo.artMstId});

            nightmare.skill = {};
            nightmare.skill.preEvolvedSkillName = preEvoSkill.name;
            nightmare.skill.preEvolvedSkillDescription = preEvoSkill.description;
            nightmare.skill.preEvolvedSkillDurationSec = preEvoSkill.duration;
            nightmare.skill.preEvolvedSkillPreparationTimeSec = preEvoSkill.leadTime;
            nightmare.skill.preEvolvedSkillSPCost = preEvoSkill.sp;

            nightmare.skill.skillName = nmSkill.name;
            nightmare.skill.skillDescription = nmSkill.description;
            nightmare.skill.skillDurationSec = nmSkill.duration;
            nightmare.skill.skillPreparationTimeSec = nmSkill.leadTime;
            nightmare.skill.skillSPCost= nmSkill.sp;

        }else{
            nightmare.skill = {};

            nmSkill = _.find(skill, {"artMstId": card[i].artMstId});
            nightmare.skill.skillName = nmSkill.name;
            nightmare.skill.skillDescription = nmSkill.description;
            nightmare.skill.skillDurationSec = nmSkill.duration;
            nightmare.skill.skillPreparationTimeSec = nmSkill.leadTime;
            nightmare.skill.skillSPCost = nmSkill.sp;
        }


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