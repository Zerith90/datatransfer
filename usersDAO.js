var config = require('./config'),
    fs = require("fs"),
    mongodb = config.mongodb,
    networkClick = 'data_transfer/networkClick',
    networkActivity = 'data_transfer/networkActivity',
    networkImpression = 'data_transfer/networkImpression',
    dir = 'data_transfer';

checkConnection()

function checkConnection() {
    fs.readdir(dir, function(error, list) {
        console.log(list)
            //read directory
        for (i in list) {
            console.log(list[i])
            fs.readdir(dir + '/' + list[i], function(error, files) {
                if (files.length == 0)
                    return
                else
                    console.log(files)
            })
        }
    })

    // mongodb.client.connect(mongodb.url, function(err, db) {
    //     console.log(db.collection('users'))
    //     db.close()
    // })

}

function spe() {
    fs.readdir(dir, function(error, list) {
        if (error)
            console.log(error);

        list.forEach(function(file, index) {
            //read files that needs to be uploaded only
            if (file.split('.')[1] === 'log') {
                //identify table to be inserted to
                var table = file.split('_')[0].toLowerCase();
                file = 'data_transfer/' + file
                    //read file

                fs.readFile(file, 'binary', function(err, data) {
                    //show completion rate via uploads
                    var startTime = new Date().getTime();
                    var row_data = data.split('\n')
                    var insert_statement = "insert into " + table;
                    var counter = 1;
                    var completion_rate = 0
                    row_data.every(function(line, index) {
                            completion_rate = (counter / (row_data.length)) * 100
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

                            if (counter % 10000 == 0 || counter == row_data.length) {
                                //if (counter == 150) {
                                console.log(counter + ":" + row_data.length)
                                return false
                            } else {
                                console.log(counter + ":" + row_data.length)
                                if (counter != 1) {
                                    console.log(completion_rate + '%')
                                    insert_statement += ','
                                }
                                counter++;
                                return true
                            }

                        })
                        /*********************************************
                        End of row loop
                        **********************************************/
                    console.log(insert_statement)
                        // config.db.connect(function(err) {
                        //     if (err) {
                        //         return console.error('could not connect to postgres', err);
                        //     }
                        //     config.db.query(insert_statement, function(err, result) {
                        //         if (err) {
                        //             return console.error('error running query', err);
                        //         }
                        //         console.log("Total Time: " + (new Date().getTime() - startTime) / 1000 / 60 + 'mins')
                        //         console.log(result);
                        //         //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST) 
                        //         config.db.end();
                        //     });
                        // });


                })
            }
        })
    })
}
