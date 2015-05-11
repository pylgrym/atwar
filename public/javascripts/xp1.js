// Browser-client-javascript-code:
var socket = io.connect(); // how do we know we have io available?! is it layout.jade load-order?

var clientId = 0; // undefined at start.
var mobs = {}; //  dirty, fixme (here, so welcome and DCL both can see it.)

socket.on('welcome', function (data_json) {
  console.log('client-welcome, assigned client ID:', data_json);
  clientId = data_json.clientId; 
  mobs[clientId] = { x: 50, y: 50, id: clientId };
});


document.addEventListener('DOMContentLoaded', function() {

  var theAt = document.getElementById("at");
  var theAts = document.getElementById("atCont");

  var d = 4;
  var mobElms = {};

  function procureMob(id) {
    var ne;
    // mobElms.hasOwnProperty(id) 
    if (!(id in mobElms)) {
      // create it as dom-elm:
      ne = document.createElement('p');

      $(ne).addClass('atsign')
           .html('Z')
           .appendTo($('#atCont'))         
           .attr('id', id);

      mobElms[id] = ne; // store it.
    }
    return mobElms[id];
  } // end  procureMob.


  document.addEventListener('keydown', function(e) {

    var mob = mobs[clientId];
    switch (e.key) {
    case 'ArrowUp'   : mob.y-=d; break; 
    case 'ArrowDown' : mob.y+=d; break;
    case 'ArrowRight': mob.x+=d; break;
    case 'ArrowLeft':  mob.x-=d; break;
    }

    // ATM necessary, because broadcast doesn't hit yourself..
    // No, only move when receiving the move!
    theAt.style.left = mob.x+"px"; 
    theAt.style.top  = mob.y+"px"; 

    socket.emit('move-c-s', mob); 

    var mobElm = procureMob(clientId);
    mobElm.style.left = mob.x+"px"; // Update our view.
    mobElm.style.top  = mob.y+"px"; 
  }); // on-keydown.


  socket.on('move-s-c', function (mob) {
    var changeId = mob.id;
    var mobElm = procureMob(changeId);
    mobs[changeId] = mob; // Transfer to our model-copy.

    console.log(mob);
    theAt.style.left = mob.x+"px"; // Update our view.
    theAt.style.top  = mob.y+"px"; 
    theAt.innerHTML  = mob.id;

    mobElm.style.left = mob.x+"px"; // Update our view.
    mobElm.style.top  = mob.y+"px"; 
  });


}); // on-DCL.
