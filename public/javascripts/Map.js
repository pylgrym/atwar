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
  isInitDone = 0,
  ctx,
  module = { // Our actual module as a hash:

    map2screenB: function(pos_x, pos_y) { // "pos is the cell we invalidate/draw"
    	var i,j,row,y,x,side=20, curColor, 
    	  minx=0,miny=0,maxx=map[0].length-1,maxy=map.length-1,
        mob;

    	if (!(pos_x === undefined)) {
    		minx=maxx=pos_x; miny=maxy=pos_y;
    	}

      ctx.fillStyle = "#110";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "20px sans-serif"; // monospace"; //serif";

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
  			row = map[i]; 
        for (j=minx; j<=maxx; ++j) { // row.length
          x = j*side;
          curColor = "#0d6";
          if (ctx.fillStyle != curColor) { ctx.fillStyle = curColor; }
          //ctx.fillRect(x,y,side,side);
          ctx.fillText(row[j],x+side*0.5,y+side*0.5);
        } // for j.
  		} // for i.

      // fixme: draw @'s: Can't do, while coords are in xp1 instead of map.
      for (i in Mob.mobs()) {
        mob = Mob.at(i);
        if (mob == undefined) {
          console.log('argh',Mob.mobs());
        }
        ctx.fillStyle = mob.mobColor;
        ctx.fillText('@',(mob.x+0.5)*side,(mob.y+0.5)*side);        
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


