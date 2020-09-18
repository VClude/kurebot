const { settings } = require("cluster");
const bot_config = require('../bot.config.json');
const weapA = require('../assets/json/weaponA.json');
const weapS = require('../assets/json/weaponS.json');
const weapSR = require('../assets/json/weaponSR.json');
const prefix = bot_config.bot_config.prefix;
var uuid = require('uuid');
var jimp = require('jimp');
// var _ = require('lodash');
const Chance = require('chance');
let chance = new Chance();
const Discord = require('discord.js');

let roll = function() {
    return chance.integer({ min: 1, max: 100 })
}

let pull = function() {

    let result = roll();

    if(result >= 1 && result <= 3 ) {
        var animalArray  = Object.keys(weapSR);
        var randomNumber = Math.random();
        var animalIndex  = Math.floor(randomNumber * animalArray.length);
        var randomKey    = animalArray[animalIndex];
        var randomValue  = weapSR[randomKey]; 
        return randomValue;

    }

    if(result >= 4 && result <= 20) {
        var animalArray  = Object.keys(weapS);
        var randomNumber = Math.random();
        var animalIndex  = Math.floor(randomNumber * animalArray.length);
        var randomKey    = animalArray[animalIndex];
        var randomValue  = weapS[randomKey]; 
        return randomValue;
    }

    if(result >= 21 && result <= 100) {
        var animalArray  = Object.keys(weapA);
        var randomNumber = Math.random();
        var animalIndex  = Math.floor(randomNumber * animalArray.length);
        var randomKey    = animalArray[animalIndex];
        var randomValue  = weapA[randomKey]; 
        return randomValue;
    }

        var animalArray  = Object.keys(weapA);
        var randomNumber = Math.random();
        var animalIndex  = Math.floor(randomNumber * animalArray.length);
        var randomKey    = animalArray[animalIndex];
        var randomValue  = weapA[randomKey]; 
        return randomValue;
}

let pullSpec = function() {

    let result = roll();

    if(result >= 1 && result <= 25 ) {
        var animalArray  = Object.keys(weapSR);
        var randomNumber = Math.random();
        var animalIndex  = Math.floor(randomNumber * animalArray.length);
        var randomKey    = animalArray[animalIndex];
        var randomValue  = weapSR[randomKey]; 
        return randomValue;

    }

    if(result >= 26 && result <= 100 ) {
        var animalArray  = Object.keys(weapS);
        var randomNumber = Math.random();
        var animalIndex  = Math.floor(randomNumber * animalArray.length);
        var randomKey    = animalArray[animalIndex];
        var randomValue  = weapS[randomKey]; 
        return randomValue;

    }

        var animalArray  = Object.keys(weapS);
        var randomNumber = Math.random();
        var animalIndex  = Math.floor(randomNumber * animalArray.length);
        var randomKey    = animalArray[animalIndex];
        var randomValue  = weapS[randomKey]; 
        return randomValue;
}


    


module.exports = {
    name: 'multipull',
    description: 'tes hoky anda dengan multipull',
    execute(message, args, client) {
        
        
        if (args.length === 0) {

            var images = ['./assets/img/gambargacha.png']
       
           

            for(let i = 0; i < 11; i++){
                if(i == 10){
                    images.push(pullSpec().url);
     
                }
                else{
                    images.push(pull().url);
          
                }
                
            }

            var jimps = [];
            let theUrl = '';
            for(let i = 0; i < images.length; i++){
                jimps.push(jimp.read(images[i])); 
            }
           

            Promise.all(jimps).then(function(data){
                return Promise.all(jimps);
            }).then(function(data){
                data[0].composite(data[1],30,30);
                data[0].composite(data[2],186,30);
                data[0].composite(data[3],342,30);

                data[0].composite(data[4],30,186);
                data[0].composite(data[5],186,186);
                data[0].composite(data[6],342,186);

                data[0].composite(data[7],30,342);
                data[0].composite(data[8],186,342);
                data[0].composite(data[9],342,342);

                data[0].composite(data[10],103,498);
                data[0].composite(data[11],259,498);

                theUrl = './assets/img/yourgacha' + uuid.v1() + '.png';

                data[0].write(theUrl, function(){
                    console.log('image writed');
                    console.log(theUrl);
                    message.channel.send('Your gacha results : ', {files: [theUrl]});
                })
            })
            // Jimp.read('../assets/img/gambargacha.png').then(function(image){

            // });
            console.log(theUrl);
            
        }
        // const emoji = client.emojis.cache.get('753083854239039498');
        

        
     


        
        }   

    }
