const { settings } = require("cluster");
const bot_config = require('../bot.config.json');
const weapA = require('../assets/json/weaponA.json');
const weapS = require('../assets/json/weaponS.json');
const weapSR = require('../assets/json/weaponSR.json');
const prefix = bot_config.bot_config.prefix;
const jimp = require('jimp');
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

    if(result >= 1 && result <= 20 ) {
        var animalArray  = Object.keys(weapSR);
        var randomNumber = Math.random();
        var animalIndex  = Math.floor(randomNumber * animalArray.length);
        var randomKey    = animalArray[animalIndex];
        var randomValue  = weapSR[randomKey]; 
        return randomValue;

    }

    if(result >= 21 && result <= 40 ) {
        var animalArray  = Object.keys(weapA);
        var randomNumber = Math.random();
        var animalIndex  = Math.floor(randomNumber * animalArray.length);
        var randomKey    = animalArray[animalIndex];
        var randomValue  = weapA[randomKey]; 
        return randomValue;

    }

    if(result >= 41 && result <= 100 ) {
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
    name: 'pull',
    description: 'pull banner disini biar laksek kemudian',
    execute(message, args, client) {
        
        
        if (args.length === 0) {

            var images = []
       
           

            for(let i = 0; i < 1; i++){
                // if(i == 4){
                //     images.push(pullSpec().url);
     
                // }
                // else{
                //     images.push(pull().url);
          
                // }
                images.push(pullSpec().url);
                
            }
            console.log(images);
            message.channel.send('Your gacha results : ', {files: images});
        }
        // const emoji = client.emojis.cache.get('753083854239039498');
        

        
     


        
        }   

    }
