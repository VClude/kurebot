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
    // for weapon
    if(card[i].cardType === 1 && card[i].evolutionLevel === 0){
        y++;
        rarity = (card[i].rarity === 3) ? 'A' : ((card[i].rarity === 4) ? 'S' : ((card[i].rarity === 5) ? 'SR' : 'L'));
        location = (card[i].rarity === 3) ? '/assets/img/weapA/' : ((card[i].rarity === 4) ? '/assets/img/weapSR/CardS' : ((card[i].rarity === 5) ? '/assets/img/weapSR/CardS' : '/assets/img/weapSR/CardS'));
        console.log('in iteration ' + y + ' Weapon ->' + card[i].name);
        weapon.name = translate.latinize(card[i].name);
        weapon.skillid = card[i].frontSkillMstId;
        weapon.weaponid = card[i].cardMstId;
        switch(card[i].attribute){
            case 1:
                weapon.attribute = 'Fire';
                break;
            case 2:
                weapon.attribute = 'Water';
                break;
            case 3:
                weapon.attribute = 'Wind';
                break;
            default:
                break;
        }

        switch(card[i].weaponType){
            case 1:
                weapon.type = 'Instrument';
                break;
            case 2:
                weapon.type = 'Instrument';
                break;
            case 3:
                weapon.type = 'Instrument';
                break;
            case 4:
                weapon.type = 'Tome';
                break;
            case 5:
                weapon.type = 'Artifact';
                break;
            case 6:
                weapon.type = 'Staff';
                break;
            case 7:
                weapon.type = 'Sword';
                break;
            case 8:
                weapon.type = 'Sword';
                break;
            case 9:
                weapon.type = 'Sword';
                break;
            case 10:
                weapon.type = 'Sword';
                break;
            case 11:
                weapon.type = 'Hammer';
                break;
            case 12:
                weapon.type = 'Hammer';
                break;
            case 13:
                weapon.type = 'Hammer';
                break;
            case 14:
                weapon.type = 'Bow';
                break;
            case 15:
                weapon.type = 'Bow';
                break;
            case 16:
                weapon.type = 'Bow';
                break;
            case 17:
                weapon.type = 'Bow';
                break;
            case 18:
                weapon.type = 'Polearm';
                break;
            case 19:
                weapon.type = 'Polearm';
                break;
            case 20:
                weapon.type = 'Polearm';
                break;
            default:
                break;
        }
        link = parseInt(i);
        weapon.url = location + card[link].resourceName + '.png'
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
        switch(card[i].weaponType){
            case 1:
                instrument.push(weapon);
                break;
            case 2:
                instrument.push(weapon);
                break;
            case 3:
                instrument.push(weapon);
                break;
            case 4:
                tome.push(weapon);
                break;
            case 5:
                artifact.push(weapon);
                break;
            case 6:
                staff.push(weapon);
                break;
            case 7:
                sword.push(weapon);
                break;
            case 8:
                sword.push(weapon);
                break;
            case 9:
                sword.push(weapon);
                break;
            case 10:
                sword.push(weapon);
                break;
            case 11:
                hammer.push(weapon);
                break;
            case 12:
                hammer.push(weapon);
                break;
            case 13:
                hammer.push(weapon);
                break;
            case 14:
                bow.push(weapon);
                break;
            case 15:
                bow.push(weapon);
                break;
            case 16:
                bow.push(weapon);
                break;
            case 17:
                bow.push(weapon);
                break;
            case 18:
                polearm.push(weapon);
                break;
            case 19:
                polearm.push(weapon);
                break;
            case 20:
                polearm.push(weapon);
                break;
            default:
                break;
        }
        
    }
// for NMs
    if(card[i].cardType === 3 && card[i].evolutionLevel === 0 && card[i].rarity === 5){
        y++;
        console.log('in iteration ' + y + ' Nightmare->' + card[i].name);
        nightmare.name = translate.latinize(card[i].name);
        nightmare.shortName = card[i].shortName;
        nightmare.attribute = card[i].attribute;
        nightmare.mstId = card[i].cardMstId;
        nightmare.resourceName = card[i].resourceName;
        nightmare.rarity = 'SR';
        nightmare.url = '/assets/img/weapSR/CardS' + card[i].resourceName + '.png'
        
        

        nightmaresSR.push(nightmare);
    }

}

// convert JSON object to string
const dataA = JSON.stringify(weaponA);
const dataS = JSON.stringify(weaponS);
const dataSR = JSON.stringify(weaponSR);
const dataNMSR = JSON.stringify(nightmaresSR);
const dataInstrument =JSON.stringify(instrument);
const dataTome =JSON.stringify(tome);
const dataArtifact =JSON.stringify(artifact);
const dataStaff =JSON.stringify(staff);
const dataSword =JSON.stringify(sword);
const dataBow =JSON.stringify(bow);
const dataHammer =JSON.stringify(hammer);
const dataPolearm =JSON.stringify(polearm);
// write JSON string to a file
fs.writeFile('./assets/json/master/weaponA.json', dataA, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON Weapon A data is saved.");
});
fs.writeFile('./assets/json/master/weaponS.json', dataS, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON Weapon S data is saved.");
});
fs.writeFile('./assets/json/master/weaponSR.json', dataSR, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON Weapon SR data is saved.");
});

fs.writeFile('./assets/json/master/nightmareSR.json', dataNMSR, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON Weapon A data is saved.");
});
fs.writeFile('./assets/json/master/specific/RG/instrument.json', dataInstrument, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON Instrument data is saved.");
});
fs.writeFile('./assets/json/master/specific/RG/tome.json', dataTome, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON Tome data is saved.");
});

fs.writeFile('./assets/json/master/specific/RG/artifact.json', dataArtifact, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON Artifact data is saved.");
});
fs.writeFile('./assets/json/master/specific/RG/staff.json', dataStaff, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON Staff data is saved.");
});
fs.writeFile('./assets/json/master/specific/VG/sword.json', dataSword, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON Sword data is saved.");
});

fs.writeFile('./assets/json/master/specific/VG/bow.json', dataBow, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON Bow data is saved.");
});
fs.writeFile('./assets/json/master/specific/VG/hammer.json', dataHammer, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON Hammer data is saved.");
});
fs.writeFile('./assets/json/master/specific/VG/polearm.json', dataPolearm, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON Polearm data is saved.");
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
