const { settings } = require("cluster");
const bot_config = require('../bot.config.json');
const weapA = require('../assets/json/b3pool.json');
const weapS = require('../assets/json/b4pool.json');
const weapSR = require('../assets/json/b5pool.json');
const prefix = bot_config.bot_config.prefix;
var uuid = require('uuid');
var jimp = require('jimp');
const mys = require('../util/mysql');
const Chance = require('chance');
let chance = new Chance();
const Discord = require('discord.js');
const util = require('../util/util');

let roll = function() {
    return chance.integer({ min: 1, max: 100 })
}

function removeDuplicates(originalArray, prop) {
    let newArray = [];
    let lookupObject  = {};

    for(let i in originalArray) {
       lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for(i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
     return newArray;
}

let pull = function() {

    let result = roll();

    if(result >= 1 && result <= 2 ) {
        var animalArray  = Object.keys(weapSR);
        var randomNumber = Math.random();
        var animalIndex  = Math.floor(randomNumber * animalArray.length);
        var randomKey    = animalArray[animalIndex];
        var randomValue  = weapSR[randomKey]; 
        return randomValue;

    }

    if(result >= 2 && result <= 7) {
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

    if(result >= 1 && result <= 5 ) {
        var animalArray  = Object.keys(weapSR);
        var randomNumber = Math.random();
        var animalIndex  = Math.floor(randomNumber * animalArray.length);
        var randomKey    = animalArray[animalIndex];
        var randomValue  = weapSR[randomKey]; 
        return randomValue;

    }

    if(result >= 6 && result <= 100 ) {
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


let pullGuaranteed = function(guaranteed) {
    var animalArray  = Object.keys(weapSR);
    var randomNumber = Math.random();
    var animalIndex  = Math.floor(randomNumber * guaranteed.length);
    var randomKey    = animalArray[animalIndex];
    var randomValue  = weapSR[randomKey]; 
    return randomValue;
}



module.exports = {
    name: 'wish',
    description: 'Wish standard banner (beta)',
    execute(message, args, client) {
        const user = message.guild.members.cache.get(message.author.id);
        let images = ['./assets/img/genshin/backgroundgacha.png']
        for(let i = 0; i < 11; i++){
            if(i == 9){
                    a = pullSpec();
                    images.push(a.url);
      
              
                
            }
            else{
                a = pull();
             
                images.push(a.url);
               
      
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
      
                data[0].composite(data[10],50,0);
                data[0].composite(data[9],200,0);
                data[0].composite(data[8],350,0);
        
                data[0].composite(data[7],500,0);
                data[0].composite(data[6],650,0);
                data[0].composite(data[5],800,0);
        
                data[0].composite(data[4],950,0);
                data[0].composite(data[3],1100,0);
                data[0].composite(data[2],1250,0);
        
                data[0].composite(data[1],1400,0);
               

    
            imgName = uuid.v1() + '.png';
            theUrl = './assets/img/your/yourgacha' + imgName;
    
            data[0].write(theUrl, function(){

                        let URLgambar = 'https://cdn.discordapp.com/avatars/'+ user.user.id + '/' + user.user.avatar + '.png?size=64';
                        let nickname = user.nickname ? user.nickname : user.user.username;
                        const attachment = new Discord
                          .MessageAttachment(theUrl, imgName);
                            const embed = new Discord.MessageEmbed()
                                .setTitle('Permanent Wish Banner')
                                .setAuthor(nickname + ' Wish Results', URLgambar)
                                .setTimestamp()
                                .setColor(12745742)
                                .attachFiles(attachment)
                                .setImage('attachment://' + imgName);
            
                            message.channel.send({embed});
                            return;
         


            })
        });


        
        }   

    }
