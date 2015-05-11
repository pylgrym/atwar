// Browser-client-javascript-code:
var socket = io.connect(); 

socket.on('message', function (data_json) {
  // console.log(data_json);
  socket.emit('pong', { my: 'data-pong' });
});


document.addEventListener('DOMContentLoaded', function() {

  var theAt = document.getElementById("at");

  var x = 50, // theAt.style.left || theAt.offsetLeft, // clientX,
      y = 50, //theAt.style.top  || theAt.offsetTop;
      d = 4;

  document.addEventListener('keydown', function(e) {

    switch (e.key) {
    case 'ArrowUp'   : y-=d; break; 
    case 'ArrowDown' : y+=d; break;
    case 'ArrowRight': x+=d; break;
    case 'ArrowLeft':  x-=d; break;
    }

    // ATM necessary, because broadcast doesn't hit yourself..
    // No, only move when receiving the move!
    theAt.style.left = x+"px"; 
    theAt.style.top  = y+"px"; 

    socket.emit('move-c-s', { x: x, y: y }); // .broadcast. does not belong here.
  }); // on-keydown.


  socket.on('move-s-c', function (data) {
    console.log(data);
    x = data.x; y = data.y; // Transfer to our model-copy.
    theAt.style.left = x+"px"; // Update our view.
    theAt.style.top  = y+"px"; 
  });


}); // on-DCL.