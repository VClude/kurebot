const card = require('../../SINoALICE-Datamining/card_en.json');
const translate = require('../../util/translate');
const util = require('../../util/util');

var _ = require('lodash');
const fs = require('fs');

var nightmares = [];
var y = 0;
for (let i = 0; i < card.length; i++) {

    if(card[i].cardType === 1 && card[i].evolutionLevel === 0){
        y++;
        console.log('in iteration ' + y + ' Nightmare->' + card[i].name);

        let nightmare = {};

        nightmare.name = translate.latinize(card[i].name);
        nightmare.shortName = card[i].shortName;
        nightmare.attribute = card[i].attribute;
        nightmare.mstId = card[i].cardMstId;
        nightmare.resourceName = card[i].resourceName;
        switch(card[i].rarity){
            case 3:
                nightmare.rarity = 'A';
                break;
            case 4:
                nightmare.rarity = 'S';
                break;
            case 5:
                nightmare.rarity = 'SR';
                break;
            default:
                nightmare.rarity = 'L';


        }
        nightmare.url = 'https://sinoalice.game-db.tw/images/card/CardS' + card[i].resourceName + '.png'
        
        

        nightmares.push(nightmare);
    }

}

// convert JSON object to string
const data = JSON.stringify(nightmares);

// write JSON string to a file
fs.writeFile('./assets/json/weapon.json', data, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON data is saved.");
});