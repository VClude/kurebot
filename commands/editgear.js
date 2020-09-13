module.exports = {
    name: "editgear",
    description: "Edit or update your gear in the archive",
    usage: "`<geartype>` **(geartype: weapon or wp to edit weapon, elements or ele to edit elements, nightmare or nm to edit nightmares)**",
    execute(message, args, client, FBAdmin){
        const util = require('../util/util');

        const db = FBAdmin.firestore();
        const guildRef = db.collection('guildmates');
        const query = guildRef.doc(message.author.id).get();

        var wepObject = {};

        if(args.length < 1){
            message.channel.send("Please provide the correct arguments for the command: " + this.usage);
        }

        if(args[0] === "weapon" || args[0] === "wp"){
            query.then(guildmate => {
                if(!guildmate.exists){
                    message.channel.send(`${message.author} you haven't filled out the gear archive form yet, run \`;submitgear\` to submit your gear!`);
                    return;
                }

                message.channel.send(`${message.author} I've sent you a dm to guide you through the process, please check it!`);
                message.author.createDM().then(dmChannel => {
                    let gm = guildmate.data();

                    const filter = m => m.author.id === message.author.id;
                    const collector = dmChannel.createMessageCollector(filter, {time: 120000})

                    if(gm.position === "Vanguard"){
                        dmChannel.send("Please type the amount of **Sword, Heavy, Projectile, Polearm** " +
                            "weapons you have on your main grid **in that specific order, separated by comma (,).**\n" +
                            "(e.g you have **3 swords, 3 heavies, 3 projectiles, and 3 polearms**. Therefore type `3,3,3,3`)");

                        wepObject = {
                            sword: gm.weapon.sword,
                            heavy: gm.weapon.heavy,
                            projectile: gm.weapon.projectile,
                            polearm: gm.weapon.polearm
                        }
                    }else{
                        dmChannel.send("Now, please type the amount of **Instrument, Tome, Staff** " +
                            "weapons you have on your main grid **in that specific order, separated by comma (,).**\n" +
                            "(e.g you have **3 instruments, 3 tomes, and 3 staves.** Therefore type `3,3,3`)");

                        wepObject = {
                            instrument: gm.weapon.instrument,
                            tome: gm.weapon.tome,
                            staff: gm.weapon.staff
                        }
                    }

                    collector.on('collect', m => {
                        let split = m.content.split(',');

                        if(split.length !== Object.keys(gm.weapon).length){
                            m.channel.send('Please provide the correct amount of weapons');
                            return;
                        }

                        Object.keys(wepObject).forEach((key, index) => {
                            wepObject[key] = isNaN(parseInt(split[index].trim())) ? wepObject[key] : parseInt(split[index].trim());
                        })

                        if(split.length !== Object.keys(gm.weapon).length){
                            m.channel.send('Please provide the correct amount of weapons');
                            return;
                        }

                        Object.keys(gm.weapon).forEach((key, index) => {
                           gm.weapon[key] = wepObject[key];
                        });

                        guildRef.doc(m.author.id).set(gm).then(success => {
                            m.channel.send('Your gear have been successfully updated!');
                            collector.stop();
                        }).catch(err => {
                            m.channel.send('BPJS Bot is having problem submitting your update request, please contact @Chillrend');
                            console.error(err);
                        })
                    });
                });
            });
        }
    }
}