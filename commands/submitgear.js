module.exports = {
    name: "submitgear",
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
        getNightmare: function (nmRef, nmArray) {

            return nmArray.map(nms => {
                let searchString = nms.trim();
                let strLen = searchString.length;
                let strFrontCode = searchString.slice(0, strLen-1);
                let strEndCode = searchString.slice(strLen-1, searchString.length);
                let endStr = strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);

                const query = nmRef.where('name', '>=', searchString)
                    .where('name', '<', endStr)
                    .limit(1);

                return query.get().then(nightmares => {
                    if(nightmares.empty) return undefined;

                    return nightmares.docs[0].data().name;
                });
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
        const config = require('../bot.config.json');
        const util = require('../util/util');

        const db = FBAdmin.firestore();
        const nmRef = db.collection('nightmares');

        if(!message.member.roles.cache.some(role => role.name === config.bot_config.guildmates_role)){
            message.channel.send("Sorry, you don't have the permission to enter this command");
            return;
        }

        message.channel.send(`${message.author} I've sent you a dm to guide you through the process, please check it!`);

        message.author.createDM().then(dmChannel => {
            const filter = m => m.author.id === message.author.id;
            const collector = dmChannel.createMessageCollector(filter, {time: 200000})

            /*
                The iterator have 4 phases: [POSITION_SELECTION, WEAPON_SELECTION, ELEMENT_SELECTION, NIGHTMARE_SELECTION]
            */

            let iterator = "POSITION_SELECTION";

            message.author.send('Welcome to the guildmate gear recording process.\nFirst, are you a **vanguard** or a **rearguard** ?')

            let member = {};

            collector.on('collect', m => {
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

                    if(member.position === "Vanguard"){
                        if(weapArray.length < 4){
                            m.channel.send('Please provide the correct format (<sword>,<heavy>,<projectile>,<polearm>');
                            return;
                        }
                    }else{
                        if(weapArray.length < 3){
                            m.channel.send('Please provide the correct format (<instrument>,<tome>,<staff>');
                            return;
                        }
                    }

                    member.weapon = this.localUtil.weaponParser(member.position, weapArray);
                    m.channel.send("Now, please type how much **fire, water, wind** element you have **in that specific order** just like before.");
                    iterator = "ELEMENT_SELECTION";

                }else if(iterator === "ELEMENT_SELECTION"){
                    let eleArray = m.content.split(',');

                    if(eleArray.length < 3){
                        m.channel.send('Please provide the correct format (<fire>,<water>,<wind>');
                        return;
                    }

                    member.element = this.localUtil.eleParser(m, eleArray);
                    /*
                    Now, type nightmares in your inventory that you think is important, type them separated by comma. If you don't remember its full name, you can type the part that you remember. but only the front part that will be recognized. (Ex. Shadowlord. If you type 'shadow', it's valid, but if you type 'lord', it's invalid.)
                     */
                    m.channel.send("Sekarang, ketik nightmare yang menurutmu penting dan ada di inventory mu, **dipisahkan dengan koma**.\n" +
                        "Jika tidak hafal dengan namanya, kamu dapat menulisnya dengan bagian pertama yang kamu ingat saja (misal `Shadowlord` bisa digantikan dengan `shadow` saja, namun tidak bisa dengan `lord` saja");
                    iterator = "NIGHTMARE_SELECTION"

                }else if(iterator === "NIGHTMARE_SELECTION"){
                    let nmArray = m.content.split(',');

                    if(nmArray.length < 1){
                        m.channel.send("Please provide 1 nightmare minimal");
                        return;
                    }

                    member.nightmares = [];

                    let result = this.localUtil.getNightmare(nmRef, nmArray);

                    Promise.all(result).then(nm => {
                        let validNightmares= [];
                        nm.map(nightmare => {
                            if(typeof nightmare != 'undefined') validNightmares.push(nightmare);
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
                        this.localUtil.insertGear(m.author.id, member, db.collection('guildmates')).then(docRef => {
                            this.localUtil.stopCollector(m, collector);
                        }).catch(err => {
                            m.channel.send('BPJS Bot is having trouble submitting the data, please contact @chillrend');
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

                    this.localUtil.insertGear(m.author.id, member, db.collection('guildmates')).then(docRef => {
                        this.localUtil.stopCollector(m, collector);
                    }).catch(err => {
                        m.channel.send('BPJS Bot is having trouble submitting the data, please contact @chillrend');
                        console.error(err);
                    })

                }

            });
        });

    }
}