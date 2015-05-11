// Browser-client-javascript-code:
var socket = io.connect(); 

socket.on('message', function (data_json) {
  console.log(data_json);
  socket.emit('pong', { my: 'data-pong' });
});

