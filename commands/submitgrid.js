module.exports = {
    name: "submitgrid",
    description: "Initiate gear archive recording process",
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
        stopCollector: function (message, collector) {
            message.channel.send("Thank you for taking part in the recording process! I hope you enjoy your time in our guild!");
            collector.stop();
        },
        insertGear: function (memberId, gearObj, colRef) {
            return colRef.doc(memberId).set(gearObj);
        }
    },
    execute(message, args, client, FBAdmin){
        const Discord = require('discord.js');
        const config = require('../bot.config.json');
        const util = require('../util/util');

        const db = FBAdmin.firestore();
        const nmRef = db.collection('nightmares');

        if(!message.member.roles.cache.some(role => role.name === config.bot_config.guildmates_role)
        && !message.member.roles.cache.some(role => role.name === config.bot_config.guildmates_role_2)
        ){
        let dsEmbeds = new Discord.MessageEmbed();
        dsEmbeds.setTitle('Insufficient Permission');
        dsEmbeds.setDescription('Sorry you need to be Astellia / Astessia guild member to use this command.');
        dsEmbeds.setColor(15158332);
        message.channel.send(dsEmbeds);
        return;
        }

        if(message.member.roles.cache.some(role => role.name === config.bot_config.guildmates_role)
        && message.member.roles.cache.some(role => role.name === config.bot_config.guildmates_role_2)
        ){
        let dsEmbeds = new Discord.MessageEmbed();
        dsEmbeds.setTitle('Too Many Role');
        dsEmbeds.setDescription('Sorry you cannot be Astellia + Astessia role to use this command.');
        dsEmbeds.setColor(15158332);
        message.channel.send(dsEmbeds);
        return;
        }


        const collectselect = (message.member.roles.cache.some(role => role.name === config.bot_config.guildmates_role)) ? config.bot_config.guildmates_role : config.bot_config.guildmates_role_2; 
    

        message.channel.send(`${message.author} I've sent you a dm to guide you through the process, please check it!`);

        message.author.createDM().then(dmChannel => {
            const filter = m => m.author.id === message.author.id;
            const collector = dmChannel.createMessageCollector(filter, {time: 600000})

            /*
                The iterator have 4 phases: [POSITION_SELECTION, WEAPON_SELECTION, ELEMENT_SELECTION, NIGHTMARE_SELECTION]
            */

            let iterator = "NAMING_SELECTION";
            let wt = 0;
            let et = 0;
            message.author.send('Welcome to the guildmate gear recording process.\nFirst, what is your in game name ?')

            let member = {};

            collector.on('collect', m => {
                if(iterator === "NAMING_SELECTION"){
                    if(m.content != ''){
                        m.channel.send('are you a **vanguard** or a **rearguard** ?');
                        member.name = m.content;
                        iterator = "POSITION_SELECTION";
                    }
                    else{
                        m.channel.send("your in game Name cannot be empty");
                        return;
                    }
               
                }
                if(iterator === "POSITION_SELECTION"){
                    if(util.strToTitle(m.content) === "Vanguard"){
                        member.position = "Vanguard";
                        m.channel.send("Great!. Now we can proceed to record your weapon.");
                        m.channel.send("Now, please type the amount of **Sword, Heavy, Projectile, Polearm** " +
                                        "weapons you have on your main grid **in that specific order, separated by comma (,).**\n" +
                                        "(e.g you have **3 swords, 3 heavies, 3 projectiles, and 3 polearms**. Therefore type `3,3,3,3`)");
                        iterator = "WEAPON_SELECTION";
                    }else if(util.strToTitle(m.content) === "Rearguard"){
                        member.position = "Rearguard";
                        m.channel.send("Nice!. Now we can proceed to record your weapon.");
                        m.channel.send("Now, please type the amount of **Instrument, Tome, Staff** " +
                            "weapons you have on your main grid **in that specific order, separated by comma (,).**\n" +
                            "(e.g you have **3 instruments, 3 tomes, and 3 staves.** Therefore type `3,3,3`)");
                        iterator = "WEAPON_SELECTION";
                    }else{
                        m.channel.send("Please type either vanguard or rearguard");
                    }
                }else if(iterator === "WEAPON_SELECTION"){

                    let weapArray = m.content.split(',');
                    weapArray.forEach(function (value, index, array) {
                        wt = parseInt(wt) + parseInt(value);
                        });

                    if(member.position === "Vanguard"){
                        if(weapArray.length != 4){
                            m.channel.send('Please provide the correct format (<sword>,<heavy>,<projectile>,<polearm>');
                            wt = 0;
                            return;
                        }
                    }else{
                        if(weapArray.length != 3){
                            m.channel.send('Please provide the correct format (<instrument>,<tome>,<staff>');
                            wt = 0;
                            return;
                        }
                    }
                    if(wt > 20){
                        console.log(wt);
                        m.channel.send('Your weapon are exceed 20 !');
                        wt = 0;
                        return;
                    }

                    member.weapon = this.localUtil.weaponParser(member.position, weapArray);

                      
                    m.channel.send("Now, please type how much **fire, water, wind** element you have **in that specific order** just like before.");
                    iterator = "ELEMENT_SELECTION";
                    

                }else if(iterator === "ELEMENT_SELECTION"){
                    let eleArray = m.content.split(',');
                    eleArray.forEach(function (value, index, array) {
                        et = parseInt(et) + parseInt(value);
                        });
                        console.log(et);

                    if(eleArray.length != 3){
                        m.channel.send('Please provide the correct format (<fire>,<water>,<wind>)');
                        et = 0;
                        return;
                    }

                    if(et != wt){
                        m.channel.send('Please provide the correct corresponding element/weapon total (Your total weapon : ' + wt + ', Your total Element : ' + et + ')');
                        et = 0;
                        return;
                    }

                    member.element = this.localUtil.eleParser(m, eleArray);
                    /*
                    Now, type nightmares in your inventory that you think is important, type them separated by comma. If you don't remember its full name, you can type the part that you remember. but only the front part that will be recognized. (Ex. Shadowlord. If you type 'shadow', it's valid, but if you type 'lord', it's invalid.)
                     */
                    ;
                    iterator = (member.position == "Vanguard") ? "NIGHTMARE_SELECTION" : "SPEC_SELECTION";
                    (member.position == "Vanguard") ? 
                    m.channel.send("please provide your nightmare, **separated with comma**.\n" +
                    "e.g : eris,lind,golem,wisp,karkinos") :
                    m.channel.send("please input your specialization grid (Minstrel Only) : \n" +
                    "1. ATK Buff Grid \n 2. DEF Buff Grid \n 3. ATK+DEF Buff Grid \n 4. Cleric / Sorc")
                }
                else if(iterator === "SPEC_SELECTION"){
                    if(m.content != ''){
                        m.channel.send("please provide your nightmare, **separated with comma**.\n" +
                    "e.g : eris,lind,golem,wisp,karkinos");
                    switch(m.content){
                        case 1:
                            member.spec = 'ATK Buff';
                            break;
                        case 2:
                            member.spec = 'DEF Buff';
                            break;
                        case 3:
                            member.spec = 'ATK+DEF Buff';
                            break;
                        default:
                            member.spec = '';
                    }
                        member.spec = m.content;
                        iterator = "NIGHTMARE_SELECTION";
                    }
                    else{
                        m.channel.send("please input between 1-4");
                        return;
                    }
                }
                else if(iterator === "NIGHTMARE_SELECTION"){
                    let nmArray = m.content.split(',');

                    if(nmArray.length < 1){
                        m.channel.send("Please provide 1 nightmare minimal");
                        return;
                    }

                    if(nmArray.length > 5){
                        m.channel.send("you cannot exceed the maximum nightmare allowed in main grid (5 nightmare)");
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
                            m.channel.send('No nightmare(s) found based on your search query, please try again');
                            return;
                        }

                        member.nightmares = validNightmares;
                        m.channel.send(`We found ${validNightmares.join(' - ')} and added it/them to your nightmare list`);
                        m.channel.send('If you have given a summon task for one of these nightmares, please **type the nightmare name**, otherwise **type done**');

                        iterator = "SUMMON_JOB_SELECTION"
                    })


                }else if(iterator === "SUMMON_JOB_SELECTION"){
                    if(util.strToTitle(m.content) === "Done"){
                        this.localUtil.insertGear(m.author.id, member, db.collection(collectselect)).then(docRef => {
                            this.localUtil.stopCollector(m, collector);
                        }).catch(err => {
                            m.channel.send('Kurebot is catching some BUG, please inform Kureha');
                            console.error(err);
                        })
                    }

                    let nightmare = util.findNeedle(m.content.trim(), member.nightmares);

                    if(nightmare.length < 1){
                        m.channel.send(`There is no nightmare matching ${m.content} in your nightmare list, please try again`);
                        return;
                    }

                    member.summonJob = nightmare[0];
                    m.channel.send(`You are summoning ${member.summonJob} in the colosseum, please remember your nightmare name and don't be late!`);

                    this.localUtil.insertGear(m.author.id, member, db.collection(collectselect)).then(docRef => {
                        this.localUtil.stopCollector(m, collector);
                    }).catch(err => {
                        m.channel.send('Kurebot is catching some BUG, please inform Kureha');
                        console.error(err);
                    })

                }

            });
        });

    }
}