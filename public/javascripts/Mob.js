"use strict";
// Module Mob.
var Mob; // a module handle/accessor, in the global namespace.

( 
function() { // An anonymous function, to yield an isolated scope for our module.

  var mobs = {}; // Model objects. // PROBLEM: Must go to shared module.
  var ownClientId = 0; // undefined at start.

  function at(mobId) {
    return mobs[mobId];
  }

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
  } // initMob.


  Mob = { // INTERFACE module;
    mobs: mobs,
    initMob: initMob,
    at: at
  } 
} () ); // Mob module.
