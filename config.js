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
    user: 'pdw_gm_apac_o' /*'sherman.tan@dentsuaegis.com'*/ ,
    password: 'EAiFlXmSD8up' /*'KmgXbUpRjzyK'*/ ,
    // user: 'sherman.tan@dentsuaegis.com',
    // password: 'KmgXbUpRjzyK',
    database: 'pdw_gm_apac',
    host: 'float.leader.mpp.prod.emea.media.global.loc:5439',
}

config.mongodb = {
    client: MongoClient,
    url: 'mongodb://localhost:27017/user_journey'
};

MongoClient.connect(config.mongodb.url, function(err, db) {
        // Use the admin database for the operation

        // List all the available databases
    })
    //module.exports = config

var client = new pg.Client("postgres://" + config.pgconfig.user + ":" + config.pgconfig.password + "@" + config.pgconfig.host + "/" + config.pgconfig.database);

create()

function create() {
    client.connect(function(err) {
        if (err) {
            return console.error('could not connect to postgres', err);
        }
        client.query('create table gm_apac.testdb (testcol int)', function(err, result) {
            if (err) {
                return console.error('error running query', err);
            }
            console.log(result);
            //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST) 
            client.end();
        });
    });
}
// select()

function select() {
    client.connect(function(err) {
        if (err) {
            return console.error('could not connect to postgres', err);
        }
        client.query('select * from gm_apac.testdb', function(err, result) {
            if (err) {
                return console.error('error running query', err);
            }
            console.log(result);
            //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST) 
            client.end();
        });
    });
}
//drop()

function drop() {
    client.connect(function(err) {
        if (err) {
            return console.error('could not connect to postgres', err);
        }
        client.query('drop table testdb', function(err, result) {
            if (err) {
                return console.error('error running query', err);
            }
            console.log(result);
            //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST) 
            client.end();
        });
    });
}
