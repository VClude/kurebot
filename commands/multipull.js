const { settings } = require("cluster");
const bot_config = require('../bot.config.json');
const weapA = require('../assets/json/weaponA.json');
const weapS = require('../assets/json/weaponS.json');
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

let pull = function(rateup) {
    const weapSR = require(rateup);

    let result = roll();

    if(result >= 1 && result <= 3 ) {
        var animalArray  = Object.keys(weapSR);
        var randomNumber = Math.random();
        var animalIndex  = Math.floor(randomNumber * animalArray.length);
        var randomKey    = animalArray[animalIndex];
        var randomValue  = weapSR[1]; 
        return randomValue;

    }

    if(result >= 4 && result <= 20) {
        var animalArray  = Object.keys(weapSR);
        var randomNumber = Math.random();
        var animalIndex  = Math.floor(randomNumber * animalArray.length);
        var randomKey    = animalArray[animalIndex];
        var randomValue  = weapSR[1]; 
        return randomValue;
    }

    if(result >= 21 && result <= 100) {
        var animalArray  = Object.keys(weapSR);
        var randomNumber = Math.random();
        var animalIndex  = Math.floor(randomNumber * animalArray.length);
        var randomKey    = animalArray[animalIndex];
        var randomValue  = weapSR[1]; 
        return randomValue;
    }

        var animalArray  = Object.keys(weapA);
        var randomNumber = Math.random();
        var animalIndex  = Math.floor(randomNumber * animalArray.length);
        var randomKey    = animalArray[animalIndex];
        var randomValue  = weapA[randomKey]; 
        return randomValue;
}

let pullSpec = function(rateup) {
    const weapSR = require(rateup);
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


let pullGuaranteed = function(rateup, guaranteed) {
    const weapSR = require(rateup);
    var animalArray  = Object.keys(weapSR);
    var randomNumber = Math.random();
    var animalIndex  = Math.floor(randomNumber * guaranteed.length);
    var randomKey    = animalArray[animalIndex];
    var randomValue  = weapSR[randomKey]; 
    return randomValue;
}



module.exports = {
    name: 'multipull',
    description: 'tes hoky anda dengan multipull',
    execute(message, args, client) {
        const user = message.guild.members.cache.get(message.author.id);
        if(args.length === 0) {
            Object.keys(bot_config.event).forEach((key, index) => {
                const embed = new Discord.MessageEmbed()
                            .setTitle(bot_config.event[key].name)
                            .setDescription('**!s multipull ' + bot_config.event[key].args + '** to pull this banner')
                            .addField('Info :', bot_config.event[key].info)
                            .setColor(12745742)
                            .setImage(bot_config.event[key].url);

                        message.channel.send({embed});
            });
            return;
        }
    else {
    if(!bot_config.event[args[0]]) {
        const embed = new Discord.MessageEmbed()
                            .setTitle('Banner not available')
                            .setDescription('**!s multipull** for available banner list')
                            .setColor(12745742)
                        message.channel.send({embed});
        return;
    }

    let query = 'select * from user where `id` = ?';
    let parser = [user.user.id];

    mys.doQuery(query,parser,function(results){
        let res =JSON.parse(JSON.stringify(results));
        if(res[0]){
            
            oldGem = res[0].gem;
            oldSR = res[0].srcollect;
            oldGpull = res[0].gachapull;
            oldSpent = res[0].spent;

            if(oldGem < 300){
                let gemus = client.emojis.cache.find(emoji => emoji.name === 'gemus');
                const emsg = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Insufficient ${gemus}`)
                .setDescription(`${gemus} lo kurang, sana topup **!s topup**`);
            
                 message.channel.send(emsg);                    
                }
            else{

                let poolRate = bot_config.event[args[0]].rateup;
                let images = ['./assets/img/gambargacha.png']
                let textE = [];
                let isSR = 0;
                let srcontent = [];

                for(let i = 0; i < 11; i++){
                
            
                    if(i == 10){
                        if(bot_config.event[args[0]].guaranteed){
                            a = pullGuaranteed(poolRate, bot_config.event[args[0]].guaranteed);
                                textE.push(util.evalRarity(a.rarity,client) + a.name);
                                images.push(a.url);
                                isSR = isSR + 1;
                                srcontent.push({'weapid':a.resourceName,'weapname': a.name});
                            }
                        else{
                            a = pullSpec(poolRate);
                            if(a.rarity == 'SR'){
                                textE.push(util.evalRarity(a.rarity,client) + a.name);
                                isSR = isSR + 1;
                                srcontent.push({'weapid':a.resourceName,'weapname': a.name});
                            }
                            images.push(a.url);
                        }
                      
                        
                    }
                    else{
                        a = pull(poolRate);
                        if(a.rarity == 'SR'){
                            textE.push(util.evalRarity(a.rarity,client) + a.name);
                            isSR = isSR + 1;
                            srcontent.push({'weapid':a.resourceName,'weapname': a.name});
                        }
                        images.push(a.url);
                       
              
                    }
                    // console.log(i);
                }
                
                textE = (textE.length > 0 ? textE : 'n/a')
            
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
            
                    data[0].composite(data[10],113,498);
                    data[0].composite(data[11],269,498);
            
                    imgName = uuid.v1() + '.png';
                    theUrl = './assets/img/your/yourgacha' + imgName;
            
                    data[0].write(theUrl, function(){

                        newSR = parseInt(oldSR) + parseInt(isSR);
                        newGem = parseInt(oldGem) - 300;
                        newSpent = parseInt(oldSpent) + 300;
                        newGPull = parseInt(oldGpull) + 10;
                        counter = 0;
                        if(srcontent.length == 0){
                            query = 'UPDATE user SET gem = ?,spent =?, srcollect = ?, gachapull = ? where id = ?';
                            parser = [newGem,newSpent,newSR,newGPull, user.user.id];
                            mys.doQuery(query,parser,function(results){
                                let gemus = client.emojis.cache.find(emoji => emoji.name === 'gemus');
                                let URLgambar = 'https://cdn.discordapp.com/avatars/'+ user.user.id + '/' + user.user.avatar + '.png?size=64';
                                let nickname = user.nickname ? user.nickname : user.user.username;
                                const attachment = new Discord
                                  .MessageAttachment(theUrl, imgName);
                                    const embed = new Discord.MessageEmbed()
                                        .setTitle(bot_config.event[args[0]].name + ' Pull')
                                        .setAuthor(nickname + ' Gacha Results', URLgambar)
                                        .setTimestamp()
                                        .setColor(12745742)
                                        .setDescription(`${gemus} ${oldGem} **>>** ${newGem}`)
                                        .addField('SR GET', textE)
                                        .attachFiles(attachment)
                                        .setImage('attachment://' + imgName);
                    
                                    message.channel.send({embed});
                                    return;
                            });
                        }
                        else {

                            srcontent = removeDuplicates(srcontent, "weapid");

                            Object.keys(srcontent).forEach( (key, index) => {
                                query = 'select * from gacha where id = ? and weapid = ?';
                                parser = [user.user.id, srcontent[key].weapid];
                                 mys.doQuery(query,parser, function(results){
                                    res =JSON.parse(JSON.stringify(results));
                                    if(res[0]){
                                        qty = (res[0].qty == 4) ? 4 : parseInt(res[0].qty) + 1;
                                        query = 'UPDATE gacha SET qty = ? where id = ? and weapid = ?';
                                        parser = [qty,res[0].id,res[0].weapid];
                                             mys.doQuery(query,parser,function(results){
                                                return;
                                            });
                                    }
        
                                    else{
                                        query = 'insert into gacha VALUES (?, ?, ?, ?)';
                                        parser = [user.user.id,srcontent[key].weapid,srcontent[key].weapname,0];
                                             mys.doQuery(query,parser,function(results){
                                                return;
                                            });
                                    }
                                    
                                });

                            });

                            query = 'UPDATE user SET gem = ?,spent =?, srcollect = ?, gachapull = ? where id = ?';
                            parser = [newGem,newSpent,newSR,newGPull, user.user.id];
                            mys.doQuery(query,parser,function(results){
                                let gemus = client.emojis.cache.find(emoji => emoji.name === 'gemus');
                                let URLgambar = 'https://cdn.discordapp.com/avatars/'+ user.user.id + '/' + user.user.avatar + '.png?size=64';
                                let nickname = user.nickname ? user.nickname : user.user.username;
                                const attachment = new Discord
                                  .MessageAttachment(theUrl, imgName);
                                    const embed = new Discord.MessageEmbed()
                                        .setTitle(bot_config.event[args[0]].name + ' Pull')
                                        .setAuthor(nickname + ' Gacha Results', URLgambar)
                                        .setTimestamp()
                                        .setColor(12745742)
                                        .setDescription(`${gemus} ${oldGem} **>>** ${newGem}`)
                                        .addField('SR GET', textE)
                                        .attachFiles(attachment)
                                        .setImage('attachment://' + imgName);
                    
                                    message.channel.send({embed});
                                    return;
                            });

                        }

                    })
                })



            }
           
                    

        }
       else{
        const emsg = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Data belum ada')
        .setDescription('selamat datang di gacha simulator sinoalis, silahkan lakukan topup pertama kali untuk memulai gacha dengan  **!s topup**')
        .addField('Langkah 1', 'Topup saldo di Googleplay **!s topup <nominal crystal>**')
        .addField('Langkah 2', 'Gacha **!s pull** / **!s multipull**')
        .addField('Langkah 3', 'lihat statistik gacha anda di **!s statgacha**')
        .addField('Langkah 4', 'gem abis ? topup lagi lah, whale mah bebas')
         message.channel.send(emsg);
                
       }
       
     });
    

            
        }

 
        // const emoji = client.emojis.cache.get('753083854239039498');
        

        
     


        
        }   

    }
