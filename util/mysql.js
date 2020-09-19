const mysql = require('mysql');
const bot_config = require('../bot.config.json');
module.exports = {

    doQuery: function(query, parser, callback){

        let connection = mysql.createConnection({
            host     : bot_config.sql_config.host,
            user     : bot_config.sql_config.user,
            password : bot_config.sql_config.password,
            database : bot_config.sql_config.database
          });
          connection.connect();
           if(parser){
            connection.query(query, parser, function (error, results, fields) {
                if (error) throw error;
           
                return callback(results); 
              });
           }

           else{
            connection.query(query, function (error, results, fields) {
                if (error) throw error;
              
                return callback(results); 
              });
           }
          
           
          connection.end();
    }
}