// Browser-client-javascript-code:
var socket;

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded');

  var d = 4; // delta-move-size.
  var mobElms = {}; // DOM elements.
  var mobs = {}; // Model objects.
  var ownClientId = 0; // undefined at start.

  socket = io.connect(); // how do we know we have io available?! is it layout.jade load-order?

  function moveMob(mob_id) {
    var mob = mobs[mob_id];
    var mobElm = procureMob(mob_id);
    mobElm.style.left = mob.x+"px"; // Update our view.
    mobElm.style.top  = mob.y+"px"; 
    // theAt.innerHTML  = mob.id;
    console.log(mob);
  }

  function procureMob(id) {
    var newElm; 
    var mob;
    // mobElms.hasOwnProperty(id) 
    if (!(id in mobElms)) {
      mob = mobs[id];
      // create it as a DOM-elm:
      newElm = document.createElement('p');
      newElm.style.color = mob.mobColor;

      $(newElm).addClass('atsign')
           .html('@')
           .appendTo($('#atCont'))         
           .attr('id', id);

      mobElms[id] = newElm; // store it.
    }
    return mobElms[id];
  } // end  procureMob.
  
  function initMob(assignedId) {
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
    var mobColor, mob;

    ownClientId = assignedId;
    mobColor = mobColors[ (ownClientId%8) ];
    mob = { 
      x: 50, 
      y: 50, 
      id: ownClientId,
      mobColor: mobColor      
    };

    mobs[mob.id] = mob;
    moveMob(mob.id);
  }

  socket.on('welcome', function (data_json) {
    console.log('client-welcome, assigned client ID:', data_json);
    initMob(data_json.clientId);
  });

  document.addEventListener('keydown', function(e) {
    var mob = mobs[ownClientId];
    //console.log('kd, oi:', ownClientId);
    
    //                    FireFox             Chrome
    //console.log(e.char, e.key, e.charCode, e.keyCode, e.code);

    /*
    switch (e.key) { // Firefox..? Doesn't work for chrome.
    case 'ArrowUp'   : mob.y-=d; break; 
    case 'ArrowDown' : mob.y+=d; break;
    case 'ArrowRight': mob.x+=d; break;
    case 'ArrowLeft':  mob.x-=d; break;
    }
    */
    switch (e.keyCode) { // Chrome..? Also works in FF.
    case 37:  mob.x-=d; break; // 'ArrowLeft'
    case 38 : mob.y-=d; break; // 'ArrowUp'  
    case 39:  mob.x+=d; break; // 'ArrowRight'
    case 40 : mob.y+=d; break; // 'ArrowDown'
    }
    moveMob(mob.id); // ATM necessary, because broadcast doesn't hit yourself..
    socket.emit('move-c-s', mob);      
  }); // on-keydown.

  socket.on('move-s-c', function (mob) {
    mobs[mob.id] = mob; // Transfer to our model-copy
    moveMob(mob.id);
  });


}); // on-DCL.






// From mexa.html:
document.addEventListener('DOMContentLoaded',function() { Map.init(); });

document.addEventListener('keydown', function(e) {
  var newpos,oldpos;

  // if (!Map.initDone()) { Map.init(); }
  oldpos = Map.getCoords();
  newpos = Map.keymove(e, oldpos);
  if (!newpos) { return; } // If not a position-change, don't do further stuff.

  // If we reach here, we've used a (arrow) keypress.
  e.preventDefault(); // Avoid browser scrolling.

  // If the map is blocked in that direction, abandon the move-attempt:
  if (Map.posBlocked(newpos)) { console.log("blocked dir."); return; }

  Map.updatePos(newpos);
  Map.map2screenB(oldpos.x, oldpos.y);
  Map.map2screenB(newpos.x, newpos.y);
});
