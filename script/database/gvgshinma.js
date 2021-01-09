const get_top = require('./get_top.json');
const get_results = require('./get_results.json');

const serviceAccount = require('../../bot.config.json');
const mys = require('../../util/mysql');


for (let i = 0; i < get_top.payload.gvgUltimateArtInfoList[0].gvgUltimateArtDataList.length; i++) {

    query = 'INSERT INTO gvgshinmas VALUES(DEFAULT,?,?,?,?,?)';
    parser = [
        get_top.payload.gvgSchedule[0].gvgDataId,
        get_top.payload.gvgUltimateArtInfoList[0].gvgUltimateArtDataList[i].artMstId,
        get_top.payload.gvgUltimateArtInfoList[0].gvgUltimateArtDataList[i].guildACount,
        get_top.payload.gvgUltimateArtInfoList[0].gvgUltimateArtDataList[i].guildBCount,
        get_top.payload.gvgUltimateArtInfoList[0].gvgUltimateArtDataList[i].ultimateArtMethodMstId


        ];
    mys.doQuery(query,parser,function(results){
        console.log(results);
        return;
    });

}

