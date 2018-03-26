var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//var gpio = require('rpi-gpio');
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LEDred = new Gpio(4, 'out'); //use GPIO pin 4 as output  red LED
var LEDgreen = new Gpio(27, 'out'); //use GPIO pin 27 as output for green LED
var pushButton = new Gpio(17, 'in', 'both'); //use GPIO pin 17 as input, and 'both' button presses, and releases should be handled

/*
gpio.setup(7, gpio.DIR_OUT, redOff); // define the red LED - GPIO4
gpio.setup(13, gpio.DIR_OUT, greenOn); // define the green LED - GPIO27
gpio.setup(11, gpio.DIR_IN, gpio.EDGE_BOTH); // define the button as input - GPIO17 - 'both' button presses, and releases should be handled
*/

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

/*
io.on('connection', function(socket){
    socket.on('chat message',function(msg){
        console.log('message: '+ msg); //dont need this
        io.emit('chat message', msg);
    });
});
*/

io.on('connection', function(socket){
	var redOn = 0
	var greenOn = 0
	
	pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton
    if (err) { //if an error
      console.error('There was an error', err); //output error message to console
      return;
    }
    redOn = value;
    greenOn = 1-value;
    LEDred.writeSync(redOn) //turn on the red LED
    LEDgreen.writeSync(greenOn) //turn off the red LED
    socket.emit('button status',value);
    socket.emit('red status',redOn);
    socket.emit('green status', greenOn);
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

/*
gpio.on('change', function(channel, value) {
		console.log('channel ' + channel + ' value is now ' + value);
		if (value = true) { //button is pushed, turn on red LED, turn off green LED
			action = 'redOn';
			redOn();
			greenOff();
		};
		if (value = false) { //button is NOT pushed, turn off red LED, turn on green LED
			action = 'greenOn';
			greenOn();
			redOff();
		};
	});
	

function redOn() {
	gpio.write(7, true, function(err) {
		if (err) throw err;
		console.log ('red LED turned on');
	});
}
function redOff() {
	gpio.write(7, false, function(err) {
		if (err) throw err;
		console.log ('red LED turned off');
	});
}
function greenOn() {
	gpio.write(13, true, function(err) {
		if (err) throw err;
		console.log ('green LED turned on');
	});
}
function greenOff() {
	gpio.write(13, false, function(err) {
		if (err) throw err;
		console.log ('green LED turned off');
	});
}

gpio.on('export', function(channel) {
    console.log('Channel set: ' + channel);
});

*/
