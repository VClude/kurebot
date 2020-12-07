const card = require('../../SINoALICE-Datamining/card_en.json');
const translate = require('../../util/translate');
const util = require('../../util/util');

var _ = require('lodash');
const fs = require('fs');

var nightmares = [];
var weaponA = [],weaponS = [],weaponSR = [],nightmaresSR = [];
var hammer = [],polearm = [],sword = [],bow = [],artifact = [],instrument = [],tome = [],staff = [];

var y = 0;
for (let i = 0; i < card.length; i++) {

    let weapon = {};
    let nightmare = {};
    let weaponAllowed = [1,2,3,4,5,6];
    // for weapon
    if(card[i].cardType === 1 && weaponAllowed.includes(card[i].weaponType) && card[i].evolutionLevel === 0){
        y++;
        rarity = (card[i].rarity === 3) ? 'A' : ((card[i].rarity === 4) ? 'S' : ((card[i].rarity === 5) ? 'SR' : 'L'));
        location = (card[i].rarity === 3) ? './assets/img/weapA/' : ((card[i].rarity === 4) ? './assets/img/weapS/' : ((card[i].rarity === 5) ? './assets/img/weapSR/' : './assets/img/weapSR/'));
        console.log('in iteration ' + y + ' Weapon ->' + card[i].name);
        weapon.name = translate.latinize(card[i].name);
        weapon.shortName = card[i].shortName;
        weapon.attribute = card[i].attribute;
        weapon.mstId = card[i].cardMstId;
        weapon.resourceName = card[i].resourceName;
        weapon.rarity = rarity;
        weapon.url = location + card[i].resourceName + '.png'
        console.log(weapon);
        //putting to master data
        switch(rarity){
            case 'A':
                weaponA.push(weapon);
                break;
            case 'S':
                weaponS.push(weapon);
                break;
            case 'SR':
                weaponSR.push(weapon);
                break;
            default:
                weaponSR.push(weapon);
                break;
        }

        //putting to master specific data
        // switch(card[i].weaponType){
        //     case 1:
        //         instrument.push(weapon);
        //         break;
        //     case 2:
        //         instrument.push(weapon);
        //         break;
        //     case 3:
        //         instrument.push(weapon);
        //         break;
        //     case 4:
        //         tome.push(weapon);
        //         break;
        //     case 5:
        //         artifact.push(weapon);
        //         break;
        //     case 6:
        //         staff.push(weapon);
        //         break;
        //     case 7:
        //         sword.push(weapon);
        //         break;
        //     case 8:
        //         sword.push(weapon);
        //         break;
        //     case 9:
        //         sword.push(weapon);
        //         break;
        //     case 10:
        //         sword.push(weapon);
        //         break;
        //     case 11:
        //         hammer.push(weapon);
        //         break;
        //     case 12:
        //         hammer.push(weapon);
        //         break;
        //     case 13:
        //         hammer.push(weapon);
        //         break;
        //     case 14:
        //         bow.push(weapon);
        //         break;
        //     case 15:
        //         bow.push(weapon);
        //         break;
        //     case 16:
        //         bow.push(weapon);
        //         break;
        //     case 17:
        //         bow.push(weapon);
        //         break;
        //     case 18:
        //         polearm.push(weapon);
        //         break;
        //     case 19:
        //         polearm.push(weapon);
        //         break;
        //     case 20:
        //         polearm.push(weapon);
        //         break;
        //     default:
        //         break;
        // }
        
    }

}

// convert JSON object to string
const dataA = JSON.stringify(weaponA);
const dataS = JSON.stringify(weaponS);
const dataSR = JSON.stringify(weaponSR);
// write JSON string to a file
fs.writeFile('./assets/json/master/weaponASpecRG.json', dataA, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON Weapon A data is saved.");
});
fs.writeFile('./assets/json/master/weaponSSpecRG.json', dataS, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON Weapon S data is saved.");
});
fs.writeFile('./assets/json/master/weaponSRSpecRG.json', dataSR, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON Weapon SR data is saved.");
});
