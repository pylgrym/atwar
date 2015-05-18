// Browser-client-javascript-code:
var socket;

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded');

  socket = io.connect(); // how do we know we have io available?! is it layout.jade load-order?

  function updateMobPos(mob_id, oldX, oldY) {  // NEW behaviour:
    var mob2 = Mob.at(mob_id);
    Map.map2screenB(oldX, oldY);
    Map.map2screenB(mob2.x, mob2.y);    
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
    Mob.mobs = data_json.initModel; // does this work?
    Mob.initMob(data_json.newClientId);
    // We must update ALL mobs on start-up.
    Map.map2screenB();
  });

  socket.on('move-s-c', function (mob) {
    var oldPos = Mob.at(mob.id);
    Mob.mobs[mob.id] = mob; // Transfer to our model-copy
    updateMobPos(mob.id, oldPos.x, oldPos.y);
  });

  document.addEventListener('keydown', function(e) {
    var mob2 = Mob.at(Mob.ownClientID());
    var oldX = mob2.x, oldY = mob2.y;
    var newX = oldX, newY = oldY;
    switch (e.keyCode) { // Chrome..? Also works in FF.
    case 37: newX -=1; break; // 'ArrowLeft'
    case 38: newY -=1; break; // 'ArrowUp'  
    case 39: newX +=1; break; // 'ArrowRight'
    case 40: newY +=1; break; // 'ArrowDown'
    default: return;
    }
    
    e.preventDefault();
    if (Map.posBlocked({x:newX,y:newY})) { console.log("blocked!"); return; }

    mob2.x = newX; mob2.y = newY;
    // ATM necessary, because broadcast doesn't hit yourself..
    updateMobPos(mob2.id, oldX, oldY);
    socket.emit('move-c-s', mob2);      
  }); // on-keydown.

}); // on-DCL.


document.addEventListener('DOMContentLoaded',function() { 
  Map.init(); 
 // Consider Mob.init too.
});

