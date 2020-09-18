const nightmares = require('../../assets/json/enemy.json');
const serviceAccount = require('../../bot.config.json');
const admin = require('firebase-admin');

require('firebase/firestore');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount.firebase),
    databaseUrl: serviceAccount.bot_config.db_url
});

var db = admin.firestore();

for (let i = 0; i < nightmares.length; i++) {

    db.collection("enemy").doc("ASTELLIA").set(nightmares[i]).then(docRef => {
        console.log("Document written with ID: ", "ASTELLIA");
    }).catch(err => {
        console.error("Error adding document: ", err)
    });

}

