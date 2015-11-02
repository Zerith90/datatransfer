var config = {},
    mysql = require("mysql"),
    pg = require("pg"),
    mongodb = require("mongodb"),
    MongoClient = mongodb.MongoClient;
config.mysqlpool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: '1234',
    database: 'adcelerate'
});
config.pgconfig = {
    user: 'sherman.tan@dentsuaegis.com',
    password: 'KmgXbUpRjzyK',
    database: 'pdw_dan_sea_int',
    host: 'leader.mpp.int.emea.media.global.loc:5439',
}

config.mongodb = {
    client: MongoClient,
    url: 'mongodb://localhost:27017/user_journey'
};

MongoClient.connect(config.mongodb.url, function(err, db) {
    // Use the admin database for the operation

    // List all the available databases
})
module.exports = config
