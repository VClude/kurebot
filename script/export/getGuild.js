const card = require('../../assets/json/yabb.json');
const translate = require('../../util/translate');
const util = require('../../util/util');

var _ = require('lodash');
const fs = require('fs');

var ts1 = [],ts2 = [],ts3 = [],ts4 = [],ts5 = [],ts6 = [],ts7 = [],ts8 = [];

var y = 0;
for (let i = 0; i < card.length; i++) {

    let weapon = {};
    // for weapon
        y++;
        weapon.name = card[i].payload.guildData.guildName;
        
        switch(card[i].payload.guildData.gvgTimeType){
            case 1:
                weapon.ts = '1';
                break;
            case 2:
                weapon.ts = '2';
                break;
            case 4:
                weapon.ts = '3';
                break;
            case 8:
                weapon.ts = '4';
                break;
            case 16:
                weapon.ts = '5';
                break;
            case 32:
                weapon.ts = '6';
                break;
            case 64:
                weapon.ts = '7';
                break;
            case 128:
                weapon.ts = '8';
                break;
            default:
                break;
        }

        switch(card[i].payload.guildData.guildRank){
            case 1:
                weapon.guildRank = 'C';
                break;
            case 2:
                weapon.guildRank = 'B';
                break;
            case 3:
                weapon.guildRank = 'A';
                break;
            case 4:
                weapon.guildRank = 'S';
                break;
            default:
                break;
        }
        weapon.guildMaster = card[i].payload.guildData.masterName;
        weapon.level = card[i].payload.guildData.guildLevel;
        weapon.rank = card[i].payload.guildRankData.ranking;
        console.log('in iteration ' + y + ' Weapon ->' + card[i].payload.guildData.guildName);

        switch(card[i].payload.guildData.gvgTimeType){
            case 1:
                ts1.push(weapon);
                break;
            case 2:
                ts2.push(weapon);
                break;
            case 4:
                ts3.push(weapon);
                break;
            case 8:
                ts4.push(weapon);
                break;
            case 16:
                ts5.push(weapon);
                break;
            case 32:
                ts6.push(weapon);
                break;
            case 64:
                ts7.push(weapon);
                break;
            case 128:
                ts8.push(weapon);
                break;
            default:
                break;
        }
        



}

// convert JSON object to string
const tz1 = JSON.stringify(ts1);
const tz2 = JSON.stringify(ts2);
const tz3 = JSON.stringify(ts3);
const tz4 = JSON.stringify(ts4);
const tz5 = JSON.stringify(ts5);
const tz6 = JSON.stringify(ts6);
const tz7 = JSON.stringify(ts7);
const tz8 = JSON.stringify(ts8);

// write JSON string to a file
fs.writeFile('./assets/json/master/guildTS1.json', tz1, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON Weapon A data is saved.");
});

fs.writeFile('./assets/json/master/guildTS2.json', tz2, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON Weapon A data is saved.");
});

fs.writeFile('./assets/json/master/guildTS3.json', tz3, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON Weapon A data is saved.");
});

fs.writeFile('./assets/json/master/guildTS4.json', tz4, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON Weapon A data is saved.");
});

fs.writeFile('./assets/json/master/guildTS5.json', tz5, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON Weapon A data is saved.");
});

fs.writeFile('./assets/json/master/guildTS6.json', tz6, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON Weapon A data is saved.");
});

fs.writeFile('./assets/json/master/guildTS7.json', tz7, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON Weapon A data is saved.");
});

fs.writeFile('./assets/json/master/guildTS8.json', tz8, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON Weapon A data is saved.");
});




// const card = require('../../SINoALICE-Datamining/card_en.json');
// const translate = require('../../util/translate');
// const util = require('../../util/util');
// const mys = require('../../util/mysql');
// let query = 'insert into weapondb (weapid, weapattr, weaptype) VALUES ';
// var _ = require('lodash');
// const fs = require('fs');

// var nightmares = [];
// var weaponA = [],weaponS = [],weaponSR = [],nightmaresSR = [];
// var hammer = [],polearm = [],sword = [],bow = [],artifact = [],instrument = [],tome = [],staff = [];

// var y = 0;
// for (let i = 0; i < card.length; i++) {

//     let weapon = {};
//     let nightmare = {};
//     // for weapon
// // for NMs

//     if(card[i].cardType === 3 && card[i].evolutionLevel === 0 && card[i].rarity === 5 || card[i].cardType === 1 && card[i].evolutionLevel === 0 && card[i].rarity === 5){
//         try{
//             y++;
//             query += '("' +  card[i].resourceName + '",' + parseInt(card[i].attribute) + ',' + parseInt(card[i].weaponType) + '), ';
//             parser = '';
//             console.log('adding ' + card[i].shortName);


//         }
//         catch (e) {
//             console.error('Error! -> ' + e);
//             message.reply('Kurebot is Catching BUG');
//         }

        

//         // nightmaresSR.push(nightmare);
//     }

// }

// mys.doQuery(query,parser,function(results){
//     console.log(results);
//     return;
// });
