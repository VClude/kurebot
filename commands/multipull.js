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
        var number = roll();
        var theArray = (weapSR.isRateup == true && number >= 0 && number <= 66) ? Object.keys(weapSR.rateup) : Object.keys(weapSR.pool);
        var randomNumber = Math.random();
        var gachaIndex  = Math.floor(randomNumber * theArray.length);
        var randomKey    = theArray[gachaIndex];
        var randomValue  = (weapSR.isRateup == true && number >= 0 && number <= 66) ? weapSR.rateup[randomKey] : weapSR.pool[randomKey];
        return randomValue;

    }

    if(result >= 4 && result <= 20) {
        var gachaArr  = Object.keys(weapS);
        var randomNumber = Math.random();
        var gachaIndex  = Math.floor(randomNumber * gachaArr.length);
        var randomKey    = gachaArr[gachaIndex];
        var randomValue  = weapS[randomKey]; 
        return randomValue;
    }

    if(result >= 21 && result <= 100) {
        var gachaArr  = Object.keys(weapA);
        var randomNumber = Math.random();
        var gachaIndex  = Math.floor(randomNumber * gachaArr.length);
        var randomKey    = gachaArr[gachaIndex];
        var randomValue  = weapA[randomKey]; 
        return randomValue;
    }

        var gachaArr  = Object.keys(weapA);
        var randomNumber = Math.random();
        var gachaIndex  = Math.floor(randomNumber * gachaArr.length);
        var randomKey    = gachaArr[gachaIndex];
        var randomValue  = weapA[randomKey]; 
        return randomValue;
}

let pullSpec = function(rateup, isRateup) {
    const weapSR = require(rateup);
    let result = roll();

    if(result >= 1 && result <= 3 ) {
        var number = roll();
        var theArray = (weapSR.isRateup == true && number >= 0 && number <= 66) ? Object.keys(weapSR.rateup) : Object.keys(weapSR.pool);
        var randomNumber = Math.random();
        var gachaIndex  = Math.floor(randomNumber * theArray.length);
        var randomKey    = theArray[gachaIndex];
        var randomValue  = (weapSR.isRateup == true && number >= 0 && number <= 66) ? weapSR.rateup[randomKey] : weapSR.pool[randomKey];
        return randomValue;

    }

    if(result >= 4 && result <= 100 ) {
        var gachaArr  = Object.keys(weapS);
        var randomNumber = Math.random();
        var gachaIndex  = Math.floor(randomNumber * gachaArr.length);
        var randomKey    = gachaArr[gachaIndex];
        var randomValue  = weapS[randomKey]; 
        return randomValue;

    }

        var gachaArr  = Object.keys(weapS);
        var randomNumber = Math.random();
        var gachaIndex  = Math.floor(randomNumber * gachaArr.length);
        var randomKey    = gachaArr[gachaIndex];
        var randomValue  = weapS[randomKey]; 
        return randomValue;
}


let pullGuaranteed = function(rateup, guaranteed) {
    const weapSR = require(rateup);
    var gachaArr  = Object.keys(weapSR.rateup);
    var randomNumber = Math.random();
    var gachaIndex  = Math.floor(randomNumber * rateup.length);
    var randomKey    = gachaArr[gachaIndex];
    var randomValue  = weapSR[randomKey]; 
    return randomValue;
}

// let pullGuaranteed2 = function(rateup) {
//     const weapSR = require(rateup);
//         var gachaArr  = Object.keys(weapSR);
//         var randomNumber = Math.random();
//         var gachaIndex  = Math.floor(randomNumber * gachaArr.length);
//         var randomKey    = gachaArr[gachaIndex];
//         var randomValue  = weapSR[randomKey]; 
//         return randomValue;

// }



module.exports = {
    name: 'multipull',
    description: 'Multipull 10 + 1 Banner',
    execute(message, args, client) {
        const user = message.guild.members.cache.get(message.author.id);
        if(args.length === 0) {
            Object.keys(bot_config.event).forEach((key, index) => {
                if(bot_config.event[key].enabled){
                const embed = new Discord.MessageEmbed()
                            .setTitle(bot_config.event[key].name)
                            .setDescription('**!s multipull ' + bot_config.event[key].args + '** to pull this banner')
                            .addField('Info :', bot_config.event[key].info)
                            .setColor(12745742)
                            .setImage(bot_config.event[key].url);

                        message.channel.send({embed});
                    }
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

    if(!bot_config.event[args[0]].enabled) {
        const embed = new Discord.MessageEmbed()
                            .setTitle('Banner Locked')
                            .setDescription('**!s multipull** for available banner list')
                            .setColor(12745742)
                        message.channel.send({embed});
        return;
    }
    let tccostinit = bot_config.event[args[0]].tccost[0];
    let query = 'select * from user where `id` = ?';
    let parser = [user.user.id];

    mys.doQuery(query,parser,function(results){
        let res =JSON.parse(JSON.stringify(results));
        if(res[0]){
            
            oldGem = res[0].gem;
            oldSR = res[0].srcollect;
            oldGpull = res[0].gachapull;
            oldSpent = res[0].spent;
            isNotFree = bot_config.event[args[0]].cost;
            if(oldGem < tccostinit && isNotFree){
                let gemus = client.emojis.cache.find(emoji => emoji.name === 'gemus');
                const emsg = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Insufficient ${gemus}`)
                .setDescription(`Insufficient ${gemus} , You need at least ${gemus} ${tccostinit} to do pull , Please do Topup **!s topup**`);
            
                 message.channel.send(emsg);                    
                }
            else{
                let isStepup = bot_config.event[args[0]].stepup;
                let poolRate = bot_config.event[args[0]].rateup;
                let isGuaranteed = bot_config.event[args[0]].isguaranteed;
                let isFree = bot_config.event[args[0]].cost;
                let images = ['./assets/img/gambargacha.png']
                let textE = [];
                let isSR = 0;
                let srcontent = [];
                let stepupcounter = 0;
                let tccost = bot_config.event[args[0]].tccost[0];
                let quantitygacha = bot_config.event[args[0]].quantity;
                if(isStepup){
                    let query = 'select stepup from stepup where `discid` = ? and `gachaid` = ?';
                    let parser = [user.user.id, args[0]];
                    mys.doQuery(query,parser,function(results){ 
                        res =JSON.parse(JSON.stringify(results));
                        stepupcounter = res[0] ? res[0].stepup : stepupcounter;
                        // let quantitygacha = (res[0] && parseInt(res[0].stepup) < 2 || !res[0] || res[0] && parseInt(res[0].stepup) == 5) ? 5 : 11;

                        let textE = [];
                        let isSR = 0;
                        let srcontent = [];
                        let qst = parseInt(stepupcounter) + 1;
                        qst = parseInt(qst) > bot_config.event[args[0]].stepmax ? 1 : qst;
                        let quantitygacha = bot_config.event[args[0]].stepqty[parseInt(qst) - 1];
                        let tccost = bot_config.event[args[0]].tccost[parseInt(qst) - 1];
                        // console.log(args[0]);
                        // console.log("qty gacha : " + quantitygacha)
                        // console.log(qst + " " + bot_config.event[args[0]].stepmax + " " + quantitygacha);
                        for(let i = 0; i < quantitygacha; i++){
                            // if(args[0] == 1 && quantitygacha == 11 && i > 8){

                            //     if(qst == bot_config.event[args[0]].stepmax && i == 10){
                            //         console.log('get');
                            //         a = pullGuaranteed(poolRate, bot_config.event[args[0]].guaranteed);
                            //             textE.push(util.evalRarity(a.rarity,client) + a.name);
                            //             images.push(a.url);
                            //             isSR = isSR + 1;
                            //             srcontent.push({'weapid':a.resourceName,'weapname': a.name});
                            //         }
                            //         else if(qst == bot_config.event[args[0]].stepmax && i == 9){
                            //             console.log('get');
                            //             a = pullGuaranteed2(poolRate);
                            //                 textE.push(util.evalRarity(a.rarity,client) + a.name);
                            //                 images.push(a.url);
                            //                 isSR = isSR + 1;
                            //                 srcontent.push({'weapid':a.resourceName,'weapname': a.name});
                            //             } 
                            //     else{
                            //         a = pullSpec(poolRate);
                            //         if(a.rarity == 'SR'){
                            //             textE.push(util.evalRarity(a.rarity,client) + a.name);
                            //             isSR = isSR + 1;
                            //             srcontent.push({'weapid':a.resourceName,'weapname': a.name});
                            //         }
                            //         images.push(a.url);
                            //     }

                            // }
                            if(quantitygacha == 5 && i == 4 || quantitygacha == 11 && i == 10){
                                if(qst == bot_config.event[args[0]].stepmax){
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
                        }

                        textE = (textE.length > 0 ? textE : 'n/a')
            
                        var jimps = [];
                        let theUrl = '';
                        for(let i = 0; i < images.length; i++){
                            jimps.push(jimp.read(images[i])); 
                        }
                    //    console.log(images.length);
                    
                        Promise.all(jimps).then(function(data){
                            return Promise.all(jimps);
                        }).then(function(data){
                            if(data.length == 12){
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
                            }
                            else{
                                data[0].composite(data[1],30,30);
                                data[0].composite(data[2],186,30);
                                data[0].composite(data[3],342,30);
                                data[0].composite(data[4],30,186);
                                data[0].composite(data[5],186,186);
                            }
                    
                            imgName = uuid.v1() + '.png';
                            theUrl = './assets/img/your/yourgacha' + imgName;
                    
                            data[0].write(theUrl, function(){
        
                                newSR = parseInt(oldSR) + parseInt(isSR);
                                if(isFree){
                                    reducer = tccost;
                                    creducer = quantitygacha;
                                 
                                }
                                else{
                                    reducer = 0;
                                    creducer = 0;

                                }
                                
                                newGem = parseInt(oldGem) - reducer;
                                newSpent = parseInt(oldSpent) + reducer;
                                newGPull = parseInt(oldGpull) + creducer;
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
                                                .setTitle(bot_config.event[args[0]].name + ' Pull \n \n STEP : ' + qst)
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
                                                .setTitle(bot_config.event[args[0]].name + ' Pull \n \n STEP : ' + qst)
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
                        });
        


                        

                        let query = res[0] ? 'update stepup set stepup = ? where discid = ? and gachaid = ?' : 'insert into stepup values (?,?,?)';
                        let parser = res[0] ? [qst,user.user.id,args[0]] : [user.user.id, args[0], 1];
                        mys.doQuery(query,parser,function(results){
                        });
                    });
                }

                else{
                // console.log(quantitygacha);
                for(let i = 0; i < quantitygacha; i++){
                    if(isGuaranteed){
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
                    if(images.length == 6){
                        data[0].composite(data[1],30,30);
                        data[0].composite(data[2],186,30);
                        data[0].composite(data[3],342,30);
                
                        data[0].composite(data[4],30,186);
                        data[0].composite(data[5],186,186);
                        
                    }
                    else{
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
                    }
                        
        
            
                    imgName = uuid.v1() + '.png';
                    theUrl = './assets/img/your/yourgacha' + imgName;
            
                    data[0].write(theUrl, function(){

                        newSR = parseInt(oldSR) + parseInt(isSR);
                        if(isFree){
                            reducer = tccost;
                            creducer = quantitygacha;
                         
                        }
                        else{
                            reducer = 0;
                            creducer = 0;

                        }
                        
                        newGem = parseInt(oldGem) - reducer;
                        newSpent = parseInt(oldSpent) + reducer;
                        newGPull = parseInt(oldGpull) + creducer;
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
                });

            }

            }
           
                    

        }
       else{
        const emsg = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('You havent topup Crystal yet')
        .setDescription('it seems you are first time using this command, please following this step to do gacha :')
        .addField('Step 1', 'type  **!s topup 10000**')
        .addField('Step 2', 'Do the Gacha by typing **!s pull** / **!s multipull**')
        .addField('Step 3', 'show your gacha statistics here **!s statgacha**')
        .addField('Step 4', 'do another topup when your crystal run out')
         message.channel.send(emsg);
                
       }
       
     });
    

            
        }

 
        // const emoji = client.emojis.cache.get('753083854239039498');
        

        
     


        
        }   

    }
