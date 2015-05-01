//initializing app to be a function handler that you can supply to an HTTP server(as seen in line 3)
var app = require('express')();
var http = require('http').Server(app);

//I initialize a new instance of socket.io by passing the http (the HTTP server) object.
var io = require('socket.io')(http);


//Defined a route handler / that gets called when we hit our website home
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

//I listen on the connection event for incoming sockets, and I print out the chat messages to the console.
io.on('connection', function(socket){
	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
		console.log('message: ' + msg);
	});
});

//We make the http server listen on port 3000
http.listen(3000, function(){
	console.log('listening on *:3000');
});