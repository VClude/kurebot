
module.exports = {
    name: 'nightmare',
    description: 'Get a detailed information of a nightmare',
    usage: '<nightmare>',
    execute(message, args, client, FBAdmin) {
        const util = require('../util/util')

        if (args.length === 0) {
            message.channel.send('Please type a nightmare to show it\'s details.**\n Command usage : \`;nightmare <nightmare_name>\`**');
            return;
        }
        if(args.length > 1){
            args[0] = args.join(' ');
        }

        const searchStr = util.strToTitle(args[0]);

        const db = FBAdmin.firestore();
        const nmRef = db.collection('nightmares');

        let strLen = searchStr.length;
        let strFrontCode = searchStr.slice(0, strLen-1);
        let strEndCode = searchStr.slice(strLen-1, args[0].length);
        let endStr = strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);

        const query = nmRef.where('name', '>=', searchStr)
                            .where('name', '<', endStr);

        const snapshot = query.get().then(nightmares => {
            if(nightmares.empty){
                message.channel.send('No nightmares matched ' + args[0] + ' found!')
                return
            }
            nightmares.forEach(nm => {
                let nightmare = nm.data();
                message.channel.send(nightmare.name);
            })
        });
    }
}