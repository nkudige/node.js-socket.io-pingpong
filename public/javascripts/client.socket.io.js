var server_name = window.location.host;
var server = io.connect(server_name);
console.log('Client: Connecting to server ' + server_name);

$(document).ready(function() {
	$('#ping-req-1').click(function() {
		server.emit('ping-from-client');
		console.log('Client: Sent ping request to server');
		$('#ping-sent-c').html(parseInt($('#ping-sent-c').text(), 10) + 1);
		$('#pong-res-1').html('PING...');
		$('#pong-res-1').hide('slow');
	});
});

server.on('pong-from-server', function(data) {
    console.log('Client: Pong received from server' );
//	document.getElementById("pong-res-1").innerHTML = "PONG!";
	$('#pong-res-1').show('slow');
	$('#pong-res-1').html('PONG!');
	document.getElementById("pong-rec-c").innerHTML = parseInt(document.getElementById("pong-rec-c").innerHTML) + 1;
});

server.on('ping-from-server', function(data) {
	console.log('Client: Ping received from server');
	document.getElementById("ping-req-2").innerHTML = "PING...";
	$('#ping-req-2').effect('shake');
	document.getElementById("ping-rec-c").innerHTML = parseInt(document.getElementById("ping-rec-c").innerHTML) + 1;

	setTimeout(function() {
	    server.emit('pong-from-client');
		console.log('Client: Sent pong response to server');
		document.getElementById("pong-res-2").innerHTML = "PONG!";
		$('#pong-res-2').effect('shake');
		document.getElementById("pong-sent-c").innerHTML = parseInt(document.getElementById("pong-sent-c").innerHTML) + 1;
    }, 200 + Math.round(2000 * Math.random()));
});
