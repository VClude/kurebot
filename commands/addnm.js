
const Discord = require('discord.js');
module.exports = {
    name: "addnm",
    description: "Initiate nm recording",
    usage: "No arguments",
    localUtil: {
        eleParser: function (message, eleArray) {
            let element = {};

            element.fire = isNaN(parseInt(eleArray[0].trim())) ? 0 : parseInt(eleArray[0].trim());
            element.water = isNaN(parseInt(eleArray[1].trim())) ? 0 : parseInt(eleArray[1].trim());
            element.wind = isNaN(parseInt(eleArray[2].trim())) ? 0 : parseInt(eleArray[2].trim());

            return element;
        },
        weaponParser: function (position, weapArray) {

            let weapon = {};

            switch (position) {
                case "Vanguard":
                    weapon.sword = isNaN(parseInt(weapArray[0].trim())) ? 0 : parseInt(weapArray[0].trim());
                    weapon.heavy = isNaN(parseInt(weapArray[1].trim())) ? 0 : parseInt(weapArray[1].trim());
                    weapon.projectile = isNaN(parseInt(weapArray[2].trim())) ? 0 : parseInt(weapArray[2].trim());
                    weapon.polearm = isNaN(parseInt(weapArray[3].trim())) ? 0 : parseInt(weapArray[3].trim());
                    break;
                case "Rearguard":
                    weapon.instrument = isNaN(parseInt(weapArray[0].trim())) ? 0 : parseInt(weapArray[0].trim());
                    weapon.tome = isNaN(parseInt(weapArray[1].trim())) ? 0 : parseInt(weapArray[1].trim());
                    weapon.staff = isNaN(parseInt(weapArray[2].trim())) ? 0 : parseInt(weapArray[2].trim());
                    break

            }

            return weapon;
        },
        getNightmare: function (nmRef, nmArray, message) {
            const util = require('../util/util');

            return nmArray.map(nms => {

                let searchArray = nms.split(' ');

                return util.getNightmaresList(searchArray, nmRef, message).then(nightmares => {
                    if(nightmares.length < 1){
                        return undefined;
                    }

                    let nightmare = util.getTrueNightmare(searchArray, nightmares);

                    return nightmare;
                })
            })
        },

        insertGear: function (memberId, gearObj, colRef) {
            return colRef.doc(memberId).set(gearObj);
        }
    },
    execute(message, args, client, FBAdmin){
        const config = require('../bot.config.json');
        const util = require('../util/util');

        const string = require('../util/string.json');
        const locStr = string.en;

        const db = FBAdmin.firestore();
        const nmRef = db.collection('nightmares');
        let server = message.guild.id;

        if(!message.member.roles.cache.some(role => role.name === config.bot_config.guildmates_role)){
            // message.channel.send("Sorry, you don't have the permission to enter this command");
            return;
        }

        if(server != bot_config.bot_config.guildmates_id){
            return;
        }

        if(args.length === 0) {
            const emsg = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Argument Needed`)
                .setDescription('please input your nightmare in order separated by comma (example : !s addnm Ugallu, Noin, Freeze Golem)');
                 message.channel.send(emsg);    
            return;
        }

        else{

            let member = {};
            let text = '';
                    
                    for (i = 0; i < args.length; i++) {
                        text += args[i] + " ";
                      } 
                    let nmArray = text.split(',');

                    if(nmArray.length < 1){
                        const emsg = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(`Nightmare Needed`)
                        .setDescription('Please provide 1 nightmare minimal');
                         message.channel.send(emsg);    
                        return;
                    }

                    member.nightmares = [];

                    let result = this.localUtil.getNightmare(nmRef, nmArray, message);

                    Promise.all(result).then(nm => {
                        let validNightmares= [];
                        nm.map(nightmare => {
                            if(typeof nightmare != 'undefined') {
                                validNightmares.push(nightmare.name);
                            }

                        })

                        if(validNightmares.length < 1){
                            const emsg = new Discord.MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle(`Argument Needed`)
                            .setDescription('No nightmare(s) found based on your search query, please try again');
                             message.channel.send(emsg);    
                            return;
                        }

                        member.nightmares = validNightmares;
                        const emsg = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(`Nightmare Added`)
                        .setDescription(`We found : \n\n **${validNightmares.join(' \n ')}** \n \n and added it/them to your nightmare list`);
                         message.channel.send(emsg);    

                        this.localUtil.insertGear(message.author.id, member, db.collection('guildmates')).then(docRef => {

                        }).catch(err => {
                            message.channel.send('Kurebot is having trouble submitting the data, please contact Kureha');
                            console.error(err);
                        })
                    })



            
     

        }
}
}
