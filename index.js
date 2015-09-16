// Setup basic express server
var express = require('express');
var app = express();
var port = 3000;
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var bodyParser = require("body-parser");

app.use(express.static(__dirname + '/public'));

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});
