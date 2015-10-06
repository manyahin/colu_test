var express = require('express');
var bodyParser = require('body-parser')
var app = express();

var path = require('path');
var http = require('http').Server(app);

var io = require('socket.io')(http);
var encoder = require('./encoder');

app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({
  extended: true
}));

var clients = [];
var intervals = [];

io.on('connect', function(socket) {
  console.log('New client connected with socket id: ' + socket.id);
  clients[socket.id] = socket;

  socket.on('disconnect', function(data) {
    clearInterval(intervals[this.id]);
    delete intervals[this.id];
    console.log('Socket ID ' + this.id + ' disconnected');
  }) 
});

app.post('/startEmitter', function(req, res) {
  var frequency = req.body.emit_frequency;
  var socketId = req.body.socket_id;

  // Reset old interval if exist
  if (intervals[socketId]) {
    clearInterval(intervals[socketId]);
  }

  clients[socketId].emit('data', generateItem());
  intervals[socketId] = setInterval(function() {
    clients[socketId].emit('data', generateItem());
  }, 1000 / frequency)
  
  res.setHeader('Cache-Control', 'no-cache');
  res.json({status: 'ok'});
});

app.get('/emitterPage', function(req, res) {
  res.sendFile(__dirname + '/emitterPage.html');
});

http.listen(3000, function(){
  console.log('Server started on http://localhost:3000');
});

var generateItem = function() {
  var item = {};
  item.timestamp = Date.now()
  item.number = Math.floor((Math.random() * Math.pow(10, 10) - 1) + 1);
  item.encoded_number = '0x' + encoder.encode(item.number).toString('hex');
  return item;
};