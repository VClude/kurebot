module.exports = {
    strToTitle: function (string) {
        return string.replace(
            /\w\S*/g,
            function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    },

    stripAndSplitStr: function (string) {
        let strip = string.replace(/[^\w\s]/gi, '');
        return strip.split(" ");
    },

    getNightmaresList: async function(args, nmRef, message){

        for (let i = 0; i < args.length; i++) {
            args[i]  = this.strToTitle(args[i]);
        }


        let joinedArgs = "";
        if(args.length > 1){
            joinedArgs = args.join(' ');
        }else{
            joinedArgs = args[0];
        }

        if(joinedArgs.length < 3){
            message.channel.send('Please provide more than 3 characters for searching.');
            return;
        }

        const searchStr = joinedArgs;

        let strLen = searchStr.length;
        let strFrontCode = searchStr.slice(0, strLen-1);
        let strEndCode = searchStr.slice(strLen-1, args[0].length);
        let endStr = strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);

        const queries = [
            nmRef.where('name', '>=', searchStr)
                .where('name', '<', endStr),
            nmRef.where('searchString', 'array-contains-any', args)
        ]

        let promiseArray = [];
        for (let i = 0; i < queries.length; i++) {
            promiseArray[i] = await queries[i].get();
            if(!promiseArray[i].empty) break;
        }

        let nightmares = [];
        for (let i = 0; i < promiseArray.length; i++) {
            nightmares = nightmares.concat(promiseArray[i].docs);
            if(nightmares.length > 0) break;
        }

        return nightmares;
    },
    getTrueNightmare: function(trueArgs, nightmares){

        let found = false;
        let trueNightmare = undefined;
        for (let i = 0; i < nightmares.length; i++) {
            let nightmare = nightmares[i].data();

            let wordsEvalResult = [];
            for (let j = 0; j < trueArgs.length; j++) {
                if(nightmare.name.includes(trueArgs[j])){
                    wordsEvalResult.push(true)
                }else{
                    wordsEvalResult.push(false);
                    break;
                }
            }

            const isAllTrue = (val) => val === true;
            if(wordsEvalResult.every(isAllTrue)){
                trueNightmare = nightmare;
                found = true;
            }

            if(found) break;
        }

        return trueNightmare;
    },

    evalAttribute: function (attribute, guild) {
        switch (attribute) {
            case 1:
                return `${guild.emojis.cache.find(emoji => emoji.name === 'api')}`;
            case 2:
                return `${guild.emojis.cache.find(emoji => emoji.name === 'water')}`;
            case 3:
                return `${guild.emojis.cache.find(emoji => emoji.name === 'wind')}`;
            case "fire":
                return `${guild.emojis.cache.find(emoji => emoji.name === 'api')}`;
            case "water":
                return `${guild.emojis.cache.find(emoji => emoji.name === 'water')}`;
            case "wind":
                return `${guild.emojis.cache.find(emoji => emoji.name === 'wind')}`;
            default:
                return 'non ';
        }
    },

    evalLB: function (attribute, guild) {
        switch (attribute) {
            case 0:
                return '';
            case 1:
                return `${guild.emojis.cache.find(emoji => emoji.name === 'LB1')}`;
            case 2:
                return `${guild.emojis.cache.find(emoji => emoji.name === 'LB2')}`;
            case 3:
                return `${guild.emojis.cache.find(emoji => emoji.name === 'LB3')}`;
            case 4:
                return `${guild.emojis.cache.find(emoji => emoji.name === 'LB4')}`;
            default:
                return '';
        }
    },

    evalWeap: function (attribute, guild) {
        switch (attribute) {
            case 0:
                return "[NM]";
            case 1:
                return `${guild.emojis.cache.find(emoji => emoji.name === 'instrument')}`;
            case 2:
                return `${guild.emojis.cache.find(emoji => emoji.name === 'instrument')}`;
            case 3:
                return `${guild.emojis.cache.find(emoji => emoji.name === 'instrument')}`;
            case 4:
                return `${guild.emojis.cache.find(emoji => emoji.name === 'tome')}`;

            case 5:
                return `${guild.emojis.cache.find(emoji => emoji.name === 'orb')}`;

            case 6:
                return `${guild.emojis.cache.find(emoji => emoji.name === 'staff')}`;

            case 7:
                return `${guild.emojis.cache.find(emoji => emoji.name === 'pedang')}`;

            case 8:
                return `${guild.emojis.cache.find(emoji => emoji.name === 'pedang')}`;

            case 9:
                return `${guild.emojis.cache.find(emoji => emoji.name === 'pedang')}`;

            case 10:
                return `${guild.emojis.cache.find(emoji => emoji.name === 'pedang')}`;

            case 11:
                return `${guild.emojis.cache.find(emoji => emoji.name === 'heavy')}`;

            case 12:
                return `${guild.emojis.cache.find(emoji => emoji.name === 'heavy')}`;

            case 13:
                return `${guild.emojis.cache.find(emoji => emoji.name === 'heavy')}`;

            case 14:
                return `${guild.emojis.cache.find(emoji => emoji.name === 'projectile')}`;

            case 15:
                return `${guild.emojis.cache.find(emoji => emoji.name === 'projectile')}`;

            case 16:
                return `${guild.emojis.cache.find(emoji => emoji.name === 'projectile')}`;

            case 17:
                return `${guild.emojis.cache.find(emoji => emoji.name === 'projectile')}`;

            case 18:
                return `${guild.emojis.cache.find(emoji => emoji.name === 'polearm')}`;

            case 19:
                return `${guild.emojis.cache.find(emoji => emoji.name === 'polearm')}`;

            case 20:
                return `${guild.emojis.cache.find(emoji => emoji.name === 'polearm')}`;
            default:
                return 'non ';
        }
    },

    evalRarity: function (attribute, guild) {
        switch (attribute) {
            case 'SR':
                return `${guild.emojis.cache.find(emoji => emoji.name === 'eser')}`;
            case 'S':
                return `${guild.emojis.cache.find(emoji => emoji.name === 'es')}`;
            case 'A':
                return `${guild.emojis.cache.find(emoji => emoji.name === 'ranka')}`;
            default:
                return `${guild.emojis.cache.find(emoji => emoji.name === 'ranka')}`;
        }
    },

    findNeedle: function (needle, haystack) {
        let query = this.strToTitle(needle);
        return haystack.filter(item => item.indexOf(query) >= 0);
    },

    getJobFromWeapon: function (client, weaponObject) {
        let maxWepValue = 0, maxWeaponName = "";

        Object.keys(weaponObject).forEach((key, index) => {
            if (weaponObject[key] > maxWepValue) {
                maxWepValue = weaponObject[key];
                maxWeaponName = key;
            }
        })

        switch (maxWeaponName) {
            case "sword":
                return {job: 'breaker', priority: 1, emojiId: '755241841523425330'};
            case "heavy":
                return {job: 'crusher', priority: 2, emojiId: '755247997381640242'};
            case "projectile":
                return {job: 'gunner', priority: 3, emojiId: '755247997163405403'};
            case "polearm":
                return {job: 'paladin', priority: 4, emojiId: '755247997398417478'};
            case "instrument":
                return {job: 'minstrel', priority: 5, emojiId: '755247997213737091'};
            case "tome":
                return {job: 'sorcerer', priority: 6, emojiId: '755247997167730761'};
            case "staff":
                return {job: 'cleric', priority: 7, emojiId: '755247997314531411'};
            default:
                return undefined;
        }
    },
}