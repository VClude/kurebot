const card = require('../../SINoALICE-Datamining/card_en.json');
const translate = require('../../util/translate');
const util = require('../../util/util');
const weapA = require('../../assets/json/weaponSR.json');
var _ = require('lodash');
const fs = require('fs');
const request = require('request');
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 
var download = function(uri, filename, callback){
    request.head(uri, async function(err, res, body){
  
      await request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };
  console.log(weapA.length);
  Object.keys(weapA).forEach(async (key, index) => {
    await sleep(1000)
    await download('https://sinoalice.game-db.tw/images/card/CardS' + weapA[key]['resourceName'] + '.png', './assets/img/weapSR/'+ weapA[key]['resourceName'] + '.png', function(){
  console.log(weapA[key]['url']);

});
});
