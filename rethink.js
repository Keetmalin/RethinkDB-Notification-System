let r = require('rethinkdb');
let dbName = 'rethinkNotifications';

module.exports.initialize = function (callback) {
    r.connect({
        host: 'localhost',
        port: 28015
    }, function (err, connection) {

        r.dbCreate(dbName).run(connection, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log('database created successfully');
            }

            r.db(dbName).tableCreate('notifications', {
                primaryKey: 'notification-id'
            }).run(connection, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(JSON.stringify(result.null, 2));
                }
            });
            callback();
        })
    });
};

module.exports.registerToRealTimeNotifications = function (callback) {
    r.connect({
        host: 'localhost',
        port: 28015
    }, function (err, connection) {
        if (err) {
            console.log(err);
        } else {

            r.db(dbName).table('notifications').changes().run(connection, function (err, cursor) {
                if (err) {
                    console.log(err);
                } else {
                    cursor.each(function (err, row) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(JSON.stringify(row, null, 2));
                            callback(row);
                        }
                    })
                }
            });
        }
    });
};

module.exports.insertNotificationToDatabase = function (data, callback) {
    r.connect({
        host: 'localhost',
        port: 28015
    }, function (err, connection) {
        if (err) {
            console.log(err);
        } else {

            r.db(dbName).table('notifications').insert(data).run(connection, function (err, result) {
                if (err) {
                    console.log(err);
                    callback(err);
                } else {
                    console.log(JSON.stringify(result, null, 2));
                }
            });
        }
    });
}