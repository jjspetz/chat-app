var express = require('express');
var app = express();
var jwt = require('jsonwebtoken');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var SECRET = 'DEV';

app.use('/static', express.static('public'));

app.get('/', function(req, resp) {
  var token =jwt.sign({user: 'annonymous'}, SECRET, {expiresIn: 60*60})
  resp.render('chat.hbs');
});

io.on('connection', function(client) {
  console.log('CONNECTED');

  client.on('disconnect', function() {
    console.log('EXITED');
  });

  // client.on('incoming', function(msg){
  //   io.emit('chat-msg', msg);
  // });

  client.on('join-room', function(room) {
    client.join(room, function() {
      console.log('client.rooms');
      io.to(room).emit('chat-msg', '** new user joined **');
    });

    client.on('incoming', function(msg) {
      io.to(msg.room).emit('chat-msg', msg.msg);
    });
  });

});

http.listen(8000, function() {
  console.log('Listening on port 8000');
});
