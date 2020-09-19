const { settings } = require("cluster");
const bot_config = require('../bot.config.json');
const weapA = require('../assets/json/weaponA.json');
const weapS = require('../assets/json/weaponS.json');
const weapSR = require('../assets/json/weaponSR.json');
const prefix = bot_config.bot_config.prefix;
const mys = require('../util/mysql');
const Chance = require('chance');
let chance = new Chance();
const Discord = require('discord.js');

let roll = function() {
    return chance.integer({ min: 1, max: 100 })
}

let pull = function() {

    let result = roll();

    if(result >= 1 && result <= 10 ) {
        var animalArray  = Object.keys(weapSR);
        var randomNumber = Math.random();
        var animalIndex  = Math.floor(randomNumber * animalArray.length);
        var randomKey    = animalArray[animalIndex];
        var randomValue  = weapSR[randomKey]; 
        return randomValue;

    }

    if(result >= 11 && result <= 20) {
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
   
module.exports = {
    name: 'pull',
    cooldown: 5,
    description: 'tes hoky anda dengan nge pull single banner',
    execute(message, args, client) {
        const user = message.guild.members.cache.get(message.author.id);
        let nickname = user.nickname ? user.nickname : user.user.username;
        
        if (args.length === 0) {

            var images = []
            var isSR = 0;
           

            for(let i = 0; i < 1; i++){
                // if(i == 4){
                //     images.push(pullSpec().url);
     
                // }
                // else{
                //     images.push(pull().url);
          
                // }
                let a = pull();
                images.push(a.url);
                if(a.rarity == "SR"){
                    isSR = isSR + 1;
                }  
                
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

                    if(oldGem < 30){
                        let gemus = client.emojis.cache.find(emoji => emoji.name === 'gemus');
                        const emsg = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(`Insufficient ${gemus}`)
                        .setDescription(`${gemus} lo kurang, sana topup **!s topup**`);
                    
                         message.channel.send(emsg);                    
                        }
                    else{
                        newSR = parseInt(oldSR) + parseInt(isSR);
                        newGem = parseInt(oldGem) - 30;
                        newSpent = parseInt(oldSpent) + 30;
                        newGPull = parseInt(oldGpull) + 1;
                        query = 'UPDATE user SET gem = ?,spent =?, srcollect = ?, gachapull = ? where id = ?';
                        parser = [newGem,newSpent,newSR,newGPull, user.user.id];
                        mys.doQuery(query,parser,function(results){
                            message.channel.send(nickname + ' Single Pull Results : ', {files: images});
                            
                        });

                    }
                   
                            

                }
               else{
                const emsg = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Data belum ada')
                .setDescription('selamat datang di gacha simulator sinoalis, silahkan lakukan topup pertama kali untuk memulai gacha dengan  **!s topup**')
                .addField('Langkah 1', 'Topup saldo di Googleplay **!s topup <nominal crystal>')
                .addField('Langkah 2', 'Gacha **!s pull** / **!s multipull**')
                .addField('Langkah 3', 'lihat statistik gacha anda di **!s statgacha**')
                .addField('Langkah 4', 'gem abis ? topup lagi lah, whale mah bebas')
                 message.channel.send(emsg);
                        
               }
               
             });
            
         
                    }
     
        

        
     


        
        }   

    }
