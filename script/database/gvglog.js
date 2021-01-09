const get_nm = require('./get_battle_history.json');

const serviceAccount = require('../../bot.config.json');
const mys = require('../../util/mysql');

let total = 0;
let buff = [];

async function run() {



for await (const line of get_nm.payload.gvgBattleHistory) {
    await sleep(50);



    query = 'INSERT INTO gvglogs VALUES(DEFAULT,FROM_UNIXTIME(?),?,?,?,?,?,?,?)';
    parser = [
        line.actTime,
        line.guildDataId,
        line.gvgDataId,
        line.gvgHistoryId,
        line.isOwnGuild,
        line.readableText,
        line.userId,
        line.userName,
    ];
    await mys.doQuery(query,parser,function(results){
        console.log(results);

    });



}


function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  } 

console.log('end');

// for await (let i = 0; i < get_nm.payload.gvgBattleHistory.length; i++) {


    
//     query = 'INSERT INTO gvglogs VALUES(DEFAULT,FROM_UNIXTIME(?),?,?,?,?,?,?,?)';
//     parser = [
//         get_nm.payload.gvgBattleHistory[i].actTime,
//         get_nm.payload.gvgBattleHistory[i].guildDataId,
//         get_nm.payload.gvgBattleHistory[i].gvgDataId,
//         get_nm.payload.gvgBattleHistory[i].gvgHistoryId,
//         get_nm.payload.gvgBattleHistory[i].isOwnGuild,
//         get_nm.payload.gvgBattleHistory[i].readableText,
//         get_nm.payload.gvgBattleHistory[i].userId,
//         get_nm.payload.gvgBattleHistory[i].userName



//         ];


//         run(query,parser).catch(console.log);
// }


}
run().catch(console.log);