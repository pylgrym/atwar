// Browser-client-javascript-code:
var socket = io.connect(); // how do we know we have io available?! is it layout.jade load-order?

var clientId = 0; // undefined at start.
var mobs = {}; //  dirty, fixme (here, so welcome and DCL both can see it.)

var mobColors = [ // 8
  "#f00",
  "#0f0",
  "#00f",
  "#ff0",
  "#0ff",
  "#f0f",
  "#f80",
  "#8f0",
];

socket.on('welcome', function (data_json) {
  var mobColor;
  console.log('client-welcome, assigned client ID:', data_json);
  clientId = data_json.clientId; 
  mobColor = mobColors[ (clientId%8) ];
  mobs[clientId] = { 
    x: 50, 
    y: 50, 
    id: clientId,
    mobColor: mobColor 
  };
});


document.addEventListener('DOMContentLoaded', function() {

  var theAts = document.getElementById("atCont");
  // var theAt = document.getElementById("at");

  var d = 4;
  var mobElms = {};

  function procureMob(id) {
    var ne;
    var mobColor;
    // mobElms.hasOwnProperty(id) 
    if (!(id in mobElms)) {
      mobColor = mobs[id].mobColor;

      // create it as dom-elm:
      ne = document.createElement('p');
      ne.style.color = mobColor;

      $(ne).addClass('atsign')
           .html('@')
           .appendTo($('#atCont'))         
           .attr('id', id);

      mobElms[id] = ne; // store it.

    }
    return mobElms[id];
  } // end  procureMob.
  
  function moveMob(mob_id) {
    var mob = mobs[mob_id];
    var mobElm = procureMob(mob_id);
    mobElm.style.left = mob.x+"px"; // Update our view.
    mobElm.style.top  = mob.y+"px"; 
    // theAt.innerHTML  = mob.id;
    console.log(mob);
  }

  document.addEventListener('keydown', function(e) {
    var mob = mobs[clientId];
    switch (e.key) {
    case 'ArrowUp'   : mob.y-=d; break; 
    case 'ArrowDown' : mob.y+=d; break;
    case 'ArrowRight': mob.x+=d; break;
    case 'ArrowLeft':  mob.x-=d; break;
    }
    moveMob(mob.id);
    socket.emit('move-c-s', mob);      // ATM necessary, because broadcast doesn't hit yourself..
  }); // on-keydown.

  socket.on('move-s-c', function (mob) {
    mobs[mob.id] = mob; // Transfer to our model-copy
    moveMob(mob.id);
  });


}); // on-DCL.
