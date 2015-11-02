var config = require('./config'),
    mongodb = config.mongodb;

checkConnection()

function checkConnection() {
    mongodb.client.connect(mongodb.url, function(err, db) {
        console.log(db.collection('users'))
        db.close()
    })
}
