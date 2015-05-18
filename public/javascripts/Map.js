"use strict";
// Module Map.
var Map; // a module handle/accessor, in the global namespace.

/* Lesson to learn:
(a) purpose of 'hidden scope' variables is precisely,
that they are not visible from outside..
  So "of course", Map.localVariable doesn't work!
(b) but derived lesson from this, is more important:
- given that variable-access 'fails silently',
I should use FUNCTIONS instead of variables as accessors.
  Reason is, that FUNCTIONS do NO fail silently, because they 
require their correct type as FUNCTIONS, which means they fail
LOUDLY as    
"TypeError: Map.initDone is not a function mexa.html:85:7"
which is much better!

Lesson (c): My function-methods must be accessed
as this.method1() locally, but my VARIABLES not so.

*/

( 
function() { // An anonymous function, to yield an isolated scope for our module.

  // Here we are mainly declaring the module variables  
  // some of them will only get correct values later,
  // but this way, at least they are present in the scope!


  var map = [ // scoped variables in the anonymous function, that will be visible to each other.
	"012345678901234567890123456789012345678901234567890123456789",
	"############################################################",
	"#..............................#...........................#",
	"########.#######ABgD############...........................#",
	"#..p............DyBA...........#...........................#",
	"######.####.####abcd############...........................#",
	"#.........#...k.....+++++++....#...........................#",
	"#.#######.##########+###+#######...........................#",
	"#...................+++++......#...........................#",
	"##.######.##########+###+#######...........................#",
	"#..............................#...........................#",
	"################.###############...........................#",
	"#..............................#...........................#",
	"########.#######ABCD########.###...........................#",
	"#..p...........................#...........................#",
	"######.####.####abcd############...........................#",
	"#.........#...k.....+++++++....#...........................#",
	"#.#######.##########+###+#######...........................#",
	"#...................+++++..................................#",
	"##.######.##########+###+##.####...........................#",
	"#..............................#...........................#",
	"##################################################.#########",
	"######.####.####abcd############...........................#",
	"#.........#...k.....+++++++....#...........................#",
	"#.#######.##########+###+#######...........................#",
	"#...................+++++..................................#",
	"##.######.##########+###+##.####...........................#",
	"#...................+++++..................................#",
	"##.######.##########+###+##.####...........................#",
	"#..............................#...........................#",
	"############################################################"
  ], // end var map.
  coords = { x: 10, y: 4 },
  // term = '', //document.getElementById("term"), // Doesn't work, because page hasn't loaded yet!
  // children = '', //term.children,
  isInitDone = 0,
  ctx,
  module = { // Our actual module as a hash:

    map2screenB: function(pos_x, pos_y) { // "pos is the cell we invalidate/draw"
    	var i,j,row,y,x,side=12, curColor, 
    	  minx=0,miny=0,maxx=map[0].length-1,maxy=map.length-1,
        mob;

    	if (!(pos_x === undefined)) {
    		minx=maxx=pos_x; miny=maxy=pos_y;
    	}

      ctx.fillStyle = "#110";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "12px sans-serif"; // monospace"; //serif";

      // Thoughts: I might as well erase full rect (it's doublebuffered).
      // Thoughts: only change ctx-color if different.
  		for (i=miny; i<=maxy; ++i) { // map.length
  			y = i*side;
  			row = map[i]; // (i != coords.y) ? map[i] : this.atRow(i);				
        for (j=minx; j<=maxx; ++j) { // row.length
          x = j*side;
          ctx.fillRect(x,y,side,side);
          //ctx.fillText(row[j],x+side*0.5,y+side*0.5);
        } // for j.
  		} // for i.

      ctx.fillStyle = "orange";
  		for (i=miny; i<=maxy; ++i) { // map.length
  			y = i*side;
        // console.log('i:',i,coords.y);
  			row = (i != coords.y) ? map[i] : this.atRow(i);
        // console.log('row:',row, 'j:',j);
        for (j=minx; j<=maxx; ++j) { // row.length
          x = j*side;
          curColor = (i==coords.y && j==coords.x) ? "#ccf" : "#0d6"; // "#f80";
          if (ctx.fillStyle != curColor) { ctx.fillStyle = curColor; }
          //ctx.fillRect(x,y,side,side);
          ctx.fillText(row[j],x+side*0.5,y+side*0.5);
        } // for j.
  		} // for i.

      // fixme: draw @'s: Can't do, while coords are in xp1 instead of map.
      console.log('m:',Mob.mobs);
      for (i in Mob.mobs) {
        mob = Mob.at(i);
        // console.log('i:',i);
        ctx.fillStyle = mob.mobColor;
        ctx.fillText('§',(mob.x+0.5)*side,(mob.y+0.5)*side);        
      }      
    }, // map2screenB.

  	subst: function(str, pos, sub) { // a fix for javascript not having modifiable strings (replace a char).
  	  // (Replace char at 'pos' in 'str' with 'sub'.)
  	  var left, right; // string parts surrounding part to be replaced.

  	  // If pos is outside string, then leave string unaffected:
  	  if (pos < 0) { return str; }
  	  if (pos >= str.length) { return str; }

        // Construct a new string, with left and right parts around new 'sub'	char:  
  	  left  = str.substr(0,pos);
  	  right = str.substr(pos+1);
  	  return (left+sub+right);
  	}, // subst

    /* DISABLED TOGETHER!
    keymove: function(ev, coord) { // FIXME, MUST GO!
      var newpos = { x: coord.x, y: coord.y };
      switch (ev.keyCode) { // Chrome..? Also works in FF.
      case 37:  newpos.x-=1; break; // 'ArrowLeft'
      case 38 : newpos.y-=1; break; // 'ArrowUp'  
      case 39:  newpos.x+=1; break; // 'ArrowRight'
      case 40 : newpos.y+=1; break; // 'ArrowDown'
  	  default: return 0; // Ignore other keys.  zero counts as false.
  	  }
      return newpos;
    },

    getCoords: function() { return coords; }, // FIXME, MUST GO!    

    updatePos: function(newcoord) {  coords = newcoord; },     // FIXME, MUST GO!

    // atRow: function() {  return this.subst( map[coords.y], coords.x, '@'); }, // FIXME, MUST GO!
    */

    initDone: function() { return isInitDone; }, 

    mapAtPos: function(coord) { return map[coord.y][coord.x]; }, 

    posBlocked: function(coord) { return (this.mapAtPos(coord) == '#'); },     

    init: function() {
      var cnv;
      if (this.initDone()) { return; } // console.log('Map.init already done?!');

      cnv = document.getElementById("canvas1"); // Only call when doc/dom has loaded.
      ctx = cnv.getContext("2d");
      this.map2screenB();
 
      isInitDone = 1;
    } // init.
  }; // module.

  Map = module; 

} () ); // Map module.


