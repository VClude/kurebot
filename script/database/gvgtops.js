const get_top = require('./get_top.json');
const get_results = require('./get_results.json');

const serviceAccount = require('../../bot.config.json');
const mys = require('../../util/mysql');


// for (let i = 0; i < enemyguild.payload.guildMemberList.length; i++) {

    query = 'INSERT INTO gvgtops VALUES(DEFAULT,?,FROM_UNIXTIME(?),FROM_UNIXTIME(?),?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    parser = [
        get_top.payload.gvgSchedule[0].gvgDataId,
        get_top.payload.gvgSchedule[0].battleEndTime,
        get_top.payload.gvgSchedule[0].battleStartTime,
        get_top.payload.gvgSchedule[0].guildDataCountryCodeA,
        get_top.payload.gvgSchedule[0].guildDataCountryCodeB,
        get_top.payload.gvgSchedule[0].guildDataIdA,
        get_top.payload.gvgSchedule[0].guildDataIdB,
        get_top.payload.gvgSchedule[0].guildDataNameA,
        get_top.payload.gvgSchedule[0].guildDataNameB,
        get_top.payload.gvgSchedule[0].totalGuildPointA,
        get_top.payload.gvgSchedule[0].totalGuildPointB,
        get_top.payload.gvgSchedule[0].totalGuildPowerA,
        get_top.payload.gvgSchedule[0].totalGuildPowerB,
        get_results.payload.gvgResult.enemyComboCount,
        get_results.payload.gvgResult.selfComboCount,
        get_results.payload.gvgResult.enemySiegeWinCount,
        get_results.payload.gvgResult.selfSiegeWinCount

        ];
    mys.doQuery(query,parser,function(results){
        console.log(results);
        return;
    });

// }

