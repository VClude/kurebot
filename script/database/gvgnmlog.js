const get_nm = require('./get_battle_history_nm.json');

const serviceAccount = require('../../bot.config.json');
const mys = require('../../util/mysql');


for (let i = 0; i < get_nm.payload.gvgBattleHistory.length; i++) {

    query = 'INSERT INTO gvgnmlogs VALUES(DEFAULT,FROM_UNIXTIME(?),?,?,?,?,?,?,?)';
    parser = [
        get_nm.payload.gvgBattleHistory[i].actTime,
        get_nm.payload.gvgBattleHistory[i].guildDataId,
        get_nm.payload.gvgBattleHistory[i].gvgDataId,
        get_nm.payload.gvgBattleHistory[i].gvgHistoryId,
        get_nm.payload.gvgBattleHistory[i].isOwnGuild,
        get_nm.payload.gvgBattleHistory[i].readableText,
        get_nm.payload.gvgBattleHistory[i].userId,
        get_nm.payload.gvgBattleHistory[i].userName



        ];
    mys.doQuery(query,parser,function(results){
        console.log(results);
        return;
    });

}

