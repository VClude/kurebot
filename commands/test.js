
const fs = require("fs");
const bot_config = require('../bot.config.json');
const prefix = bot_config.bot_config.prefix;
const mys = require('../util/mysql');
const util = require('../util/util');

let streng = [];

let paginator = function(items, page, per_page) {

  var page = page || 1,
  per_page = per_page || 10,
  offset = (page - 1) * per_page,

  paginatedItems = items.slice(offset).slice(0, per_page),
  total_pages = Math.ceil(items.length / per_page);
  return {
  page: page,
  per_page: per_page,
  pre_page: page - 1 ? page - 1 : null,
  next_page: (total_pages > page) ? page + 1 : null,
  total: items.length,
  total_pages: total_pages,
  data: paginatedItems
  };
}

module.exports = {
    name: 'codex',
    description: 'See your Codex',
    execute(message, args, client) {
        const user = message.guild.members.cache.get(message.author.id);

        let query = 'select * from gacha left join weapondb on gacha.weapid = weapondb.weapid where gacha.id = ? ORDER BY gacha.weapid';
        let parser = [user.user.id];

        mys.doQuery(query,parser,function(results){
            res =JSON.parse(JSON.stringify(results));
            pager = Math.ceil(res.length / 10);
            // console.log(pager);
            // return;
            

            const Discord = require('discord.js');
            const Pagination = require('discord-paginationembed');
    
            const embeds = [];
            
           
            for(let i = 1; i <= pager; i++){
                // console.log(i);
                thedata = paginator(res, i, 10);
                let textE = [];
                Object.keys(thedata.data).forEach((key, index) => {
                    // console.log(key);
                    textE.push(util.evalLB(thedata.data[key].qty, client) + ' ' + util.evalAttribute(thedata.data[key].weapattr, client) + ' ' + util.evalWeap(thedata.data[key].weaptype, client) + ' ' + thedata.data[key].weapname);
                });

                embeds.push(new Discord.MessageEmbed().addField('Entries ' + parseInt(i) * 10 - 10 + 1 + '/' + res.length, textE));

            }
    
            const myImage = message.author.displayAvatarURL();
            let nickname = user.nickname ? user.nickname : user.user.username;

            new Pagination.Embeds()
                .setArray(embeds)
                .setAuthorizedUsers([message.author.id])
                .setChannel(message.channel)
                .setPageIndicator(false)
                .setPage(1)
                // Methods below are for customising all embeds
                .setThumbnail(myImage)
                .setTitle(nickname + ' Codex')
                .build();
            
            
        });



    }
}