var config = require('./config'),
    fs = require('fs'),
    stream = require('stream'),
    readline = require('readline'),
    byline = require('byline'),
    pool = config.mysqlpool,
    dir = 'data_transfer'


/*
For local testing only
Use the mysql on the windows container to test.
*/
//testDB()


function testDB() {
    pool.getConnection(function(err, connection) {
        connection.query('select 1 from networkclick', function(err, results, fields) {
            if (err)
                console.log("error" + err)
            if (results)
                console.log("results" + results)
        })
    })
}
// readFile()

function readFile() {

    fs.readdir(dir, function(error, list) {
        if (error)
            console.log(error);

        list.forEach(function(file, index) {

            if (file.toLowerCase().indexOf("networkimpression") > -1) {
                console.log("file2: " + file.toLowerCase())
                var create = "create table `networkimpression`(";
                fs.readFile(dir + '/' + file, 'binary', function(err, data) {
                    console.log(err)
                    var row_data = data.split('\n')
                    var row = row_data[0].split('\xfe');
                    for (i in row) {
                        //  console.log(row[i])
                        if (row[i].indexOf('ID') > -1) {
                            create += "`" + row[i] + "`" + " INT,"
                        } else {
                            create += "`" + row[i] + "`" + " text,"
                        }

                    }
                    console.log(create)
                })
                return false

            }
        })
    })
}
// readStream()

function readStream() {

    fs.readdir(dir, function(error, list) {
        if (error)
            console.log(error);

        list.forEach(function(file, index) {

            if (file.toLowerCase().indexOf("networkimpression") > -1) {

                var lineCount = 1;


                var stream = fs.createReadStream(dir + '/' + file, {
                    encoding: 'binary'
                })
                var create = "create table `networkimpression`(";
                stream.on('readable', function() {
                    var row = stream.read().split('\n')[0].split('\xfe')
                    console.log(row)
                    for (i in row) {
                        if (row[i].indexOf('ID') > -1) {
                            create += "`" + row[i] + "`" + " INT,"
                        } else {
                            create += "`" + row[i] + "`" + " text,"
                        }
                    }
                    console.log(create)

                })


            }
        })
    })
}

upload_daily()

function upload_daily() {
    pool.getConnection(function(err, connection) {

        fs.readdir(dir, function(error, list) {
            if (error)
                console.log("lol" + error);

            list.forEach(function(file) {
                //read files that needs to be uploaded only
                if (file.split('.')[1] === 'log') {



                    //identify table to be inserted to
                    var table = file.split('_')[0].toLowerCase();

                    //read file via a stream.
                    if (file.toLowerCase().indexOf('networkimpression') > -1) {
                        console.log(file + "hahaha")
                        return readFile(table, file)
                    } else {
                        console.log(file)
                        fs.readFile(dir + '/' + file, "binary", function(err, data) {
                            var counter = 1;
                            var row_data = data.split('\n');
                            var insert_statement = "insert into " + table;

                            row_data.forEach(function(line) {
                                //console.log(line)
                                /*
                                Note down the completion rate for debugging purposes
                                */

                                if (counter == 1) {
                                    //HEADER ROWS
                                    insert_statement += '(' + line.split('\xfe').map(function(id) {
                                        return '"' + id.toLowerCase() + '"'
                                    }).join(',') + ') VALUES '
                                } else if (counter <= row_data.length) {
                                    //intermdiate rows
                                    insert_statement += "(" + line.split('\xfe').map(function(id, index) {

                                        if (id.length == 0) {
                                            //DADL dont take delimited zero input
                                            return 'null';
                                        } else {
                                            if (index == 0) {
                                                //convert time to a more universal format
                                                id = new Date(id).getTime();
                                                return id;
                                            } else {
                                                return "'" + escape(id.toLowerCase()) + "'";
                                            }

                                        }
                                    }).join(',') + ")"
                                }
                                /***********************************************************************
                                BULK INSERT INTO THE DATABASE AT 10000?
                                ***********************************************************************/



                            })

                            return true
                        })

                    }

                } else {
                    return true
                }
            })
        })

        function readFile(table, file) {

            var stream = byline(fs.createReadStream(dir + '/' + file, {
                encoding: 'ascii'
            }))
            var counter = 1;
            var startTime = new Date().getTime();
            //  var row_data = stream.read().split('\n')

            var insert_statement = "insert into " + table;

            var completion_rate = 0
            stream.on('data', function(line) {
                    console.log(line)
                    if (counter == 1) {
                        //HEADER ROWS
                        insert_statement += '(' + line.split('\xfe').map(function(id) {
                            return '"' + id.toLowerCase() + '"'
                        }).join(',') + ') VALUES '
                    } else {
                        //intermdiate rows
                        insert_statement += "(" + line.split('\xfe').map(function(id, index) {

                            if (id.length == 0) {
                                //DADL dont take delimited zero input
                                return 'null';
                            } else {
                                if (index == 0) {
                                    //convert time to a more universal format
                                    id = new Date(id).getTime();
                                    return id;
                                } else {
                                    return "'" + escape(id.toLowerCase()) + "'";
                                }

                            }
                        }).join(',') + ")"
                    }
                    /***********************************************************************
                    BULK INSERT INTO THE DATABASE AT 10000?
                    ***********************************************************************/

                    counter += 1



                })
                /*end stream readable*/
        }
    })
}
