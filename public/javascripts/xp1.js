// Browser-client-javascript-code:
var socket;

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded');

  var d = 4; // delta-move-size.
  var mobElms = {}; // DOM elements.
  var mobs = {}; // Model objects. // PROBLEM: Must go to shared module.
  var ownClientId = 0; // undefined at start.

  socket = io.connect(); // how do we know we have io available?! is it layout.jade load-order?

  function moveMob(mob_id) {
    var mob = mobs[mob_id];
    var mobElm = procureMob(mob_id);
    mobElm.style.left = mob.x+"px"; // Update our view.
    mobElm.style.top  = mob.y+"px"; 
    console.log(mob);   // theAt.innerHTML  = mob.id;
  }

  function updateMobPos(mob_id, oldX, oldY) {  // NEW behaviour:
    var mob2 = Mob.at(mob_id);
    // Map.updatePos(newpos);
    Map.map2screenB(oldX, oldY);
    Map.map2screenB(mob2.x, mob2.y);    
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

  /* TODO/FIXME/NEXT STEPS So, what did I do.. I added module 'Mob', with map/array,
  and 'at(ix)' accessor.
    I have 'updateMobPos' in addition to moveMob; 
  updateMobPos is really about redrawing/invalidating old/new pos for redraw.
    Also, map-draw-loop now draws '§'.
  Apart from bugfixing/testing all this, I should now remove 
  all data-stuff from xp1.js.
    A key 'challenge' is confusion about ownership
  of nested hierarchical data - when am I referring to same struct,
  and when do I get copies..
    Also, probably some confusion about init-order (accessing undefined stuff/un-init'ed)

  And - I  still have the issue of lacking 'transfer init state'
   - I should transfer a 'seed struct'  from SERVER!

  in fact yes - I'm missing that server should  keep an 'original/updated' model,
  and eavesdrop on any changes coming through!
  */

  socket.on('welcome', function (data_json) {
    console.log('client-welcome, assigned client ID:', data_json);
    initMob(data_json.clientId); 
    Mob.initMob(data_json.clientId);
    // problem - this should give me ALL mobs, instead of just own mob.
    // (we need own id as well as info on all other mobs.)
  });

  socket.on('move-s-c', function (mob) {
    var oldPos = Mob.at(mob.id);
    mobs[mob.id] = mob;     // Transfer to our model-copy
    Mob.mobs[mob.id] = mob; // Transfer to our model-copy
    moveMob(mob.id); // JG: Consider: instead of this 'wholesale transfer', could we just transfer coords of foreign mob?
    updateMobPos(mob.id, oldPos.x, oldPos.y);
  });

  document.addEventListener('keydown', function(e) {
    var mob = mobs[ownClientId];
    var mob2 = Mob.at(ownClientId);
    var oldX = mob2.x, oldY = mob2.y;
    switch (e.keyCode) { // Chrome..? Also works in FF.
    case 37: mob.x-=d; mob2.x -=1; break; // 'ArrowLeft'
    case 38: mob.y-=d; mob2.y -=1; break; // 'ArrowUp'  
    case 39: mob.x+=d; mob2.x +=1; break; // 'ArrowRight'
    case 40: mob.y+=d; mob2.y +=1; break; // 'ArrowDown'
    }
    moveMob(mob.id); // ATM necessary, because broadcast doesn't hit yourself..
    updateMobPos(mob2.id, oldX, oldY);
    socket.emit('move-c-s', mob);      
  }); // on-keydown.

}); // on-DCL.






// From mexa.html:
document.addEventListener('DOMContentLoaded',function() { Map.init(); }); // Consider Mob.init too.

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
