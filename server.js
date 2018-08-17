let db = require('./rethink');
let app = require('express')();
let http = require('http').Server(app);
var io = require('socket.io')(http);

db.initialize(register);

function register() {
    db.registerToRealTimeNotifications(function (data) {
        io.emit('realtime:user', data.new_val.username);
    });
}

app.get('/', function(req, res){
    res.sendFile('index.html', {root: __dirname});
});

io.on('connection', function (socket) {
    socket.on('send:message', function (data) {
      db.insertNotificationToDatabase({
            message: data.message
          },
          function (err, saved) {
            console.log("Message saved:  %s", saved);
            if (err) {
              console.log("Message error:  %s", err);
            }
            return;
          }
      );
    });
});

http.listen(3000, function () {
    console.log('application running on localhost 3000');
});

