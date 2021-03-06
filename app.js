var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var server = require('http').createServer(app);
app.set('port', process.env.PORT || 5000);
server.listen(app.get('port'), function() {
    console.log("Socket dashboard server listening at port: " + app.get('port'));
});

var sio = require('socket.io').listen(server);

sio.sockets.on('connection', function(socket) {
    console.log('Web client connected');

	socket.on('ping-from-client', function() {
		setTimeout(function() {
	    	socket.emit('pong-from-server');
			console.log('Sent pong');
    }, 200 + Math.round(2000 * Math.random()));
	});

	var interval = setInterval(function() {
		socket.emit('ping-from-server');
		console.log('Ping sent');
	}, 1000 + Math.round(5000 * Math.random()));

	socket.on('pong-from-client', function() {
		console.log('Received pong');
	});

    socket.on('disconnect', function(socket) {
	console.log('Web client disconnected');
	clearInterval(interval);
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
