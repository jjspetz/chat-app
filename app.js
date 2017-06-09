var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function(req, resp) {
  resp.render('chat.hbs');
});

io.on('connection', function(client) {
  console.log('CONNECTED');

  client.on('disconnect', function() {
    console.log('EXITED');
  });

  client.on('incoming', function(msg){
    io.emit('chat-msg', msg);
  });
  
});

http.listen(8000, function() {
  console.log('Listening on port 8000');
});
