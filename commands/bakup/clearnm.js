
const Discord = require('discord.js');
module.exports = {
    name: "clearnm",
    description: "clear nm list",
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

        insertGear: function (memberId, colRef) {
            return colRef.doc(memberId).delete();
        }
    },
    execute(message, args, client, FBAdmin){

        function getUserFromMention(mention) {
            if (!mention) return;
        
            if (mention.startsWith('<@') && mention.endsWith('>')) {
                mention = mention.slice(2, -1);
        
                if (mention.startsWith('!')) {
                    mention = mention.slice(1);
                }
        
                return client.users.cache.get(mention);
            }
        }

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

        if(server != config.bot_config.guildmates_id){
            return;
        }

        if(args.length === 0) {
            this.localUtil.insertGear(message.author.id, db.collection('guildmates')).then(docRef => {
                const emsg = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`List Cleared`)
                .setDescription('your nm list has been cleared.');
                 message.channel.send(emsg);    
            }).catch(err => {
                message.channel.send('Kurebot is having trouble submitting the data, please contact Kureha');
                console.error(err);
            })
           
            return;
        }

        else{
            return;
        }

}
}
