const card = require('../../SINoALICE-Datamining/card_en.json');
const translate = require('../../util/translate');
const util = require('../../util/util');

var _ = require('lodash');
const fs = require('fs');

var nightmares = [];
var nightmaresA = [];
var nightmaresS = [];
var nightmaresSR = [];
var y = 0;
for (let i = 0; i < card.length; i++) {

    let nightmare = {};
    if(card[i].cardType === 1 && card[i].evolutionLevel === 0 && card[i].rarity === 3){
        y++;
        console.log('in iteration ' + y + ' Nightmare->' + card[i].name);
        nightmare.name = translate.latinize(card[i].name);
        nightmare.shortName = card[i].shortName;
        nightmare.attribute = card[i].attribute;
        nightmare.mstId = card[i].cardMstId;
        nightmare.resourceName = card[i].resourceName;
        nightmare.rarity = 'A';
        nightmare.url = './assets/img/weapA/' + card[i].resourceName + '.png'
        
        

        nightmaresA.push(nightmare);
    }
    if(card[i].cardType === 1 && card[i].evolutionLevel === 0 && card[i].rarity === 4){
        y++;
        console.log('in iteration ' + y + ' Nightmare->' + card[i].name);
        nightmare.name = translate.latinize(card[i].name);
        nightmare.shortName = card[i].shortName;
        nightmare.attribute = card[i].attribute;
        nightmare.mstId = card[i].cardMstId;
        nightmare.resourceName = card[i].resourceName;
        nightmare.rarity = 'S';
        nightmare.url = './assets/img/weapS/' + card[i].resourceName + '.png'
        
        

        nightmaresS.push(nightmare);
    }

    if(card[i].cardType === 1 && card[i].evolutionLevel === 0 && card[i].rarity === 5){
        y++;
        console.log('in iteration ' + y + ' Nightmare->' + card[i].name);
        nightmare.name = translate.latinize(card[i].name);
        nightmare.shortName = card[i].shortName;
        nightmare.attribute = card[i].attribute;
        nightmare.mstId = card[i].cardMstId;
        nightmare.resourceName = card[i].resourceName;
        nightmare.rarity = 'SR';
        nightmare.url = './assets/img/weapSR/' + card[i].resourceName + '.png'
        
        

        nightmaresSR.push(nightmare);
    }

}

// convert JSON object to string
const dataA = JSON.stringify(nightmaresA);
const dataS = JSON.stringify(nightmaresS);
const dataSR = JSON.stringify(nightmaresSR);
// write JSON string to a file
fs.writeFile('./assets/json/weaponA.json', dataA, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON data is saved.");
});
fs.writeFile('./assets/json/weaponS.json', dataS, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON data is saved.");
});
fs.writeFile('./assets/json/weaponSR.json', dataSR, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON data is saved.");
});