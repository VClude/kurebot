const get_self_guild = require('./ourguild.json');
const get_top = require('./get_top.json');

const serviceAccount = require('../../bot.config.json');
const mys = require('../../util/mysql');


for (let i = 0; i < get_self_guild.payload.guildMemberList.length; i++) {

    query = 'INSERT INTO gvgmembers VALUES(DEFAULT,?,?,?,?)';
    parser = [
        get_top.payload.gvgSchedule[0].gvgDataId,
        get_self_guild.payload.guildMemberList[i].maxHp,
        get_self_guild.payload.guildMemberList[i].userData.userId,
        get_self_guild.payload.guildMemberList[i].userData.name



        ];
    mys.doQuery(query,parser,function(results){
        console.log(results);
        return;
    });

}

