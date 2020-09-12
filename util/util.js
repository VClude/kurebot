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

    evalAttribute: function (attribute, client) {
        switch (attribute) {
            case 1:
                return `${client.emojis.cache.get('753074904374444063')}`;
            case 2:
                return `${client.emojis.cache.get('753083655357857942')}`;
            case 3:
                return `${client.emojis.cache.get('753083703684759673')}`;
            case "fire":
                return `${client.emojis.cache.get('753074904374444063')}`;
            case "water":
                return `${client.emojis.cache.get('753083655357857942')}`;
            case "wind":
                return `${client.emojis.cache.get('753083703684759673')}`;
            default:
                return undefined;
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
                return {job: 'breaker', priority: 1, emojiId: '753833365118910494'};
            case "heavy":
                return {job: 'crusher', priority: 2, emojiId: '753811624011366460'};
            case "projectile":
                return {job: 'gunner', priority: 3, emojiId: '753833334852812903'};
            case "polearm":
                return {job: 'paladin', priority: 4, emojiId: '753833319254196305'};
            case "instrument":
                return {job: 'minstrel', priority: 5, emojiId: '753833301399306280'};
            case "tome":
                return {job: 'sorcerer', priority: 6, emojiId: '753833378478030848'};
            case "staff":
                return {job: 'cleric', priority: 7, emojiId: '753833351080575037'};
            default:
                return undefined;
        }
    },
}