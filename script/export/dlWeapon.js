const card = require('../../SINoALICE-Datamining/card_en.json');
const translate = require('../../util/translate');
const util = require('../../util/util');
const weapA = require('./weaponSR.json');
var _ = require('lodash');
const fs = require('fs');
const request = require('request');
async function run() {
for await (const line of weapA) {
  await sleep(200);

  download('https://sinoalice.game-db.tw/images/card/' + line.url, './assets/img/weapSR2/'+ line.url, function(){
    console.log(line.url);
  
  });

}
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


function download(uri, filename, callback){
    request.head(uri, function(err, res, body){
  
       request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };
  console.log(weapA.length);
}
run().catch(console.log);

