var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html'); //send the shipper.html file
});

io.on('connection', function(socket){
    socket.on('chat message',function(msg){
        console.log('message: '+ msg); //dont need this
        io.emit('chat message', msg);
    });
});

/*
io.on('connection', function(socket){
    socket.on('button action',function(action){
        console.log('message: '+ action); //dont need this
        io.emit('button action', action);
    });
});
*/


http.listen(3000, function(){
  console.log('listening on *:3000');
});