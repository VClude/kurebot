const card = require('../../SINoALICE-Datamining/card_en.json');
const translate = require('../../util/translate');
const util = require('../../util/util');
const weapA = require('../../assets/json/weaponSR.json');
var _ = require('lodash');
const fs = require('fs');
const request = require('request');
var download = function(uri, filename, callback){
    request.head(uri, async function(err, res, body){
  
      await request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };
  console.log(weapA.length);
  Object.keys(weapA).forEach((key, index) => {
      
    download(weapA[key]['url'], './assets/img/weapSR/'+ weapA[key]['resourceName'] + '.png', function(){
  console.log(weapA[key]['url']);

});
});
