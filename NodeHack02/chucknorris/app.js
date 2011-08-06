/**
 * Module dependencies.
 */
var express = require('express'),
    app     = express.createServer(),
    io      = require('socket.io').listen(app),

    options = {
        host : 'localhost',
        port : 1337
    },
    
    facts   = [];

// Express configuration
app.configure(function(){
    app.register('.html', require('ejs'));
  app.set('view engine', 'html');
  app.set('views', __dirname + '/view');

  app.use(app.router);
  app.use(express.static(__dirname + '/public'));

  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

// Socket.IO configuration
io.configure(function() {
    io.set('log level', 1);
});

// Socket.IO events
io.of('/chucknorris')
    .on('connection', function(socket) {
        socket.on('nickname', function(nickname) {
            socket.set('nickname', nickname, function() {
                socket.emit('ready', facts);

                socket.on('message', function(data) {
                    facts.push(data);
                    socket.broadcast.emit('message', data);
                });
            });
        });
    });

// Routes
app.get('/', function(req, res){
  res.render('index', { title: 'Chuck Norris Facts' });
});

app.listen(options.port, options.host, function() {
    console.log("Server running on http://%s:%d, powered by Chuck Norris", options.host, options.port);
});
