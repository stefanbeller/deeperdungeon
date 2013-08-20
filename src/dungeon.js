/*
Copyright (c) <2013>, <Patrick Jebramcik>
Copyright (c) <2013>, <Dietrich Derksen>
Copyright (c) <2013>, <Florian Kraus>
Copyright (c) <2013>, <Jessica Tölke>
Copyright (c) <2013>, <Stefan Beller>
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.

    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer
      in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var nDungeonSize=[21,42, 8]; //min, +delta, levelrelated(sin) + linear
var nEnemies=[2,2,3];        // min, +delta, levelrelated(-cos)
var nItems=[3,2,2];          // min, +delta, levelrelated(cos)
var nHints=[3,6];            // min, +delta, levelrelated()

var dungeon = new Object();
dungeon.level = 0;
function generateDungeon() {
	dungeon.level += 1
	// clean data structures
	dungeon.room = new Array();
	dungeon.hint_status = new HintStatus();
	if (dungeon.level < 17)
		generateRandomDungeon();
	else if (dungeon.level == 17)
		generateBossLevel(1);
	else if (dungeon.level < 34)
		generateRandomDungeon();
	else if (dungeon.level == 34)
		generateBossLevel(2);
	else if (dungeon.level < 51)
		generateRandomDungeon();
	else if (dungeon.level == 51)
		generateBossLevel(3);
	else if (dungeon.level < 68)
		generateRandomDungeon();
	else if (dungeon.level == 68)
		generateBossLevel(4);
	else if (dungeon.level == 69)
		generateBossLevel(5);
	else if (dungeon.level == 70)
		generateBossLevel(6);
	else if (dungeon.level > 70)
		gui_showEOL(true);
}

function newRoom(room,xPos,yPos) {
	dungeon.room[room] = new Object();
	dungeon.room[room].neighbors = new Array();
	dungeon.room[room].x = xPos;
	dungeon.room[room].y = yPos;
	dungeon.room[room].content = null;
	dungeon.room[room].known = false;
}

function generateRandomDungeon() {

	DUNGEON_SIZE = nDungeonSize[0] + Math.floor(Math.random() * nDungeonSize[1]) + nDungeonSize[2] * Math.sin(dungeon.level) + dungeon.level

	for (var i=0; i<DUNGEON_SIZE; i++) {
		newRoom(i, 0, 0);
	}

	// 2d array to lay out rooms
	var layout = new Array();
	var maxsize = 2 * Math.sqrt(dungeon.room.length) + 2;

	dungeon.room[0].x = Math.round(maxsize/2);
	dungeon.room[0].y = Math.round(maxsize/2);

	// now wire up rooms:
	for (var i=1; i < dungeon.room.length; i++) {
		// create 2d array with information about neighborhood.
		for (var x=0; x < maxsize; x++) {
			layout[x] = new Array();
			for (var y=0; y < maxsize; y++) {
				layout[x][y] = 0;
			}
		}
		for (var j=0; j < i; j++) {
			layout[dungeon.room[j].x-1][dungeon.room[j].y] += 1;
			layout[dungeon.room[j].x+1][dungeon.room[j].y] += 1;
			layout[dungeon.room[j].x][dungeon.room[j].y+1] += 1;
			layout[dungeon.room[j].x][dungeon.room[j].y-1] += 1;
			layout[dungeon.room[j].x][dungeon.room[j].y] += 10;
		}

		// first create a list of possible locations:
		var locations_x = new Array();
		var locations_y = new Array();
		var loc_index = 0;
		// rooms must not be in corner or edge or 2d array, hence from (1..n-1)
		for (var x=1; x < maxsize-1; x++) {
			for (var y=1; y < maxsize-1; y++) {
				if (layout[x][y] > 0 && layout[x][y] < 4
					&& layout[x+1][y] < 13
					&& layout[x-1][y] < 13
					&& layout[x][y+1] < 13
					&& layout[x][y-1] < 13) {
					locations_x[loc_index]=x;
					locations_y[loc_index]=y;
					loc_index++;
				}
			}
		}

		// pick a random of these locations and place it:
		var loc = Math.floor(Math.random()* (loc_index));
		dungeon.room[i].x = locations_x[loc];
		dungeon.room[i].y = locations_y[loc];
	}
	// setup neighbors list:
	for (var i=0; i < dungeon.room.length; i++) {
		for (var j=0; j < i; j++) {
			var dX = dungeon.room[i].x - dungeon.room[j].x;
			var dY = dungeon.room[i].y - dungeon.room[j].y;
			if (i != j && ((dX == 0 && (dY == 1 || dY == -1)) || (dY == 0 && (dX == 1 || dX == -1)))) {
				dungeon.room[i].neighbors[dungeon.room[i].neighbors.length] = j
				dungeon.room[j].neighbors[dungeon.room[j].neighbors.length] = i
			}
		}
	}

	placeStairs();
	placeEnemies();
	placeItems();
	placeHints();
	gui_generateMap(maxsize, maxsize);
}

function generateBossLevel(bosslevel) {
	switch(bosslevel) {
		default:
		case 1:
		case 4:
		case 5:
			for (var i=0; i < 9; i++) {
				newRoom(i, 3, i+1);
			}
			dungeon.room[0].neighbors[0]=1;
			dungeon.room[8].neighbors[0]=7;
			for (var i=1; i < 8; i++) {
				dungeon.room[i].neighbors[0] = i-1;
				dungeon.room[i].neighbors[1] = i+1;
			}
			dungeon.room[2].content = createHint(2,dungeon.hint_status)
			if (bosslevel==1)
				dungeon.room[4].content = new Item("potion", "Spezieller Trank zum Kampf gegen Endgegner", 'm', room, 15+dungeon.level, 2, 2);
			else
				dungeon.room[4].content = new Item("potion", "Spezieller Trank zum Kampf gegen Endgegner", 'm', room, 45, 2, 2);
			dungeon.room[6].content = createEnemy(6)
			dungeon.room[8].content = createStairs(8)
			gui_generateMap(11, 11);
			return;
		case 2:
			for (var i=0; i < 13; i++) {
				newRoom(i, i+1, 12);
			}
			for (var i=0; i < 10; i++) {
				newRoom(i+13, 13, 11-i);
			}
			for (var i=0; i < 10; i++) {
				newRoom(i+23, 12-i, 2);
			}
			for (var i=0; i < 8; i++) {
				newRoom(i+33, 3, 3+i);
			}
			for (var i=0; i < 8; i++) {
				newRoom(i+41, 4+i, 10);
			}
			for (var i=0; i < 6; i++) {
				newRoom(i+49, 11, 9-i);
			}
			for (var i=0; i < 6; i++) {
				newRoom(i+55, 10-i, 4);
			}
			for (var i=0; i < 4; i++) {
				newRoom(i+61, 5, 5+i);
			}
			for (var i=0; i < 4; i++) {
				newRoom(i+65, 6+i, 8);
			}
			newRoom(69,9,7);
			newRoom(70,9,6);
			newRoom(71,8,6);
			newRoom(72,7,6);
			dungeon.room[0].neighbors[0]=1;
			dungeon.room[72].neighbors[0]=71;
			for (var i=1; i < 72; i++) {
				dungeon.room[i].neighbors[0] = i-1;
				dungeon.room[i].neighbors[1] = i+1;
			}
			dungeon.room[6].content = createHint(2,dungeon.hint_status)
			dungeon.room[44].content = new Item("potion", "Spezieller Trank zum Kampf gegen Endgegner", 'm', 44, 25, 5, 5);
			dungeon.room[66].content = createEnemy(66)
			dungeon.room[72].content = createStairs(72)
			gui_generateMap(15, 15);
			return;
		case 3:
			for (var i=0; i < 22; i++) {
				newRoom(i, 12, i+1);
			}
			dungeon.room[0].neighbors[0]=1;
			dungeon.room[21].neighbors[0]=20;
			for (var i=1; i < 21; i++) {
				dungeon.room[i].neighbors[0] = i-1;
				dungeon.room[i].neighbors[1] = i+1;
			}
			for (var i=5; i < 15; i++) {
				dungeon.room[i].content = new Item("potion", "Spezieller Trank zum Kampf gegen Endgegner", 'm', i, 3, 1, 1);
			}
			dungeon.room[17].content = createEnemy(17)
			dungeon.room[19].content = createStairs(19)
			dungeon.room[21].content = new function() {
				this.type = "hint"
				this.name = "\"Der nutzloseste Hinweis im ganzen Spiel\"";
				this.room = 21;
				this.getHint = function() {
					return "Dieser Hinweis ist der absolut nutzloseste Hinweis im ganzen Spiel. Er weist auf absolut gar nichts hin. Daher ist er auch an der strategisch besten Stelle plaziert."
				}
				this.getDescriptionAsNeighbor = function() {
					return "Achtung! Eine wichtige Durchsage. Im nächsten Feld ist der nutzloseste Hinweis im ganzen Spiel.";
				}
				this.unveilMap = function() {
				}
			}
			gui_generateMap(25, 25);
			return;
		case 6:
			for (var i=0; i < 5; i++) {
				newRoom(i, 3, 5-i);
			}
			dungeon.room[0].neighbors[0]=1;
			dungeon.room[4].neighbors[0]=3;
			for (var i=1; i < 4; i++) {
				dungeon.room[i].neighbors[0] = i-1;
				dungeon.room[i].neighbors[1] = i+1;
			}
			dungeon.room[2].content = new Item("potion", "Spezieller Trank zum Kampf gegen Endgegner", 'm', 2, 120, 10, 10);
			dungeon.room[3].content = createEnemy(3)
			dungeon.room[4].content = createStairs(4)
			gui_generateMap(7, 7);
			return;
	}
}


function placeStairs(room) {
	var roomindexes = new Array();
	var loc_index=0;
	for (i=0; i < dungeon.room.length; i++) {
		if (dungeon.room[i].neighbors.length == 3) {
			roomindexes[loc_index]=i;
			loc_index++;
		}
	}
	if (loc_index > 0) {
		var loc = Math.floor(Math.random()* (loc_index));
		var ind = roomindexes[loc];

		dungeon.room[ind].content = createStairs(ind)
	} else {
		// if no such room was found, take a random place
		var ind = 0
		for (var i=0; i < dungeon.room.length; i++) {
			if (dungeon.room[i].content != null) {
				ind = i
			}
		}
		dungeon.room[ind].content = createStairs(ind)
	}
}

function placeEnemies() {
	var enemies = nEnemies[0] + Math.floor(Math.random() * nEnemies[1]) - nEnemies[2] * Math.cos(dungeon.level);
	dungeon.enemies = 0

	var cnt=0;
	for (var i=0; i < enemies && cnt < 3 * enemies; i++) {
		var ind = Math.floor(Math.random() * (dungeon.room.length));
		if (dungeon.room[ind].content == null) {
			dungeon.room[ind].content = createEnemy(ind);
			dungeon.enemies++;
		} else {
			i--;
			cnt++;
		}
	}
}

function placeItems() {
	var items = nItems[0] + Math.floor(Math.random() * nItems[1]) + nItems[2] * Math.cos(dungeon.level);
	dungeon.items = 0

	// get a list at the end of the tunnels (suited for items, hints?)
	var roomindexes = new Array();
	var loc_index=0;
	for (i=0; i < dungeon.room.length; i++) {
		if (dungeon.room[i].neighbors.length < 3) {
			roomindexes[loc_index]=i;
			loc_index++;
		}
	}

	var cnt=0;
	for (var i=0; i < items && cnt < 3 * items; i++) {
		var loc = Math.floor(Math.random()* (loc_index));
		var ind = roomindexes[loc]
		if (dungeon.room[ind].content == null) {
			dungeon.room[ind].content = createItem(ind);
			dungeon.items++;
		} else {
			i--;
			cnt++;
		}
	}
}


function placeHints() {
	var hints = nHints[0] + Math.floor(Math.random() * nHints[1]);
	dungeon.hints = 0

	// get a list at the end of the tunnels (suited for items, hints?)
	var roomindexes = new Array();
	var loc_index=0;
	for (var i=0; i < dungeon.room.length; i++) {
		if (dungeon.room[i].neighbors.length < 3) {
			roomindexes[loc_index]=i;
			loc_index++;
		}
	}

	var cnt=0;
	for (var i=0; i < hints && cnt < 3 * hints; i++) {
		var loc = Math.floor(Math.random()* (loc_index));
		var ind = roomindexes[loc]
		if (dungeon.room[ind].content == null) {
			dungeon.room[ind].content = createHint(ind, dungeon.hint_status);
			dungeon.hints++;
		} else {
			i--;
			cnt++;
		}
	}
}

function dungeon_debug() {

	gui_setRoomText("");
	generateDungeon();


	for (i = 0; i < dungeon.room.length; i++) {
		if (dungeon.room[i].content) {
			gui_mapSet(dungeon.room[i].x, dungeon.room[i].y, i,dungeon.room[i].content.type);

			if (dungeon.room[i].content.type == "hint") {
				gui_addRoomText(dungeon.room[i].content.getHint()+ "<br>");
			}
		} else {
			gui_mapSet(dungeon.room[i].x, dungeon.room[i].y, i,"empty");
		}
	}
}

function guiViewRoom(room, color) {

	dungeon.room[room].known = true;

	if (!color) {
		if (dungeon.room[room].content)
			color= dungeon.room[room].content.type;
		else
			color = "empty";
	}

	gui_mapSet(dungeon.room[room].x, dungeon.room[room].y, room, color);
}

function guiViewWall(room, direction) {
	var dx=0;
	var dy=0;
	switch(direction) {
		case "top":
			dy = -1;
			break;
		case "bottom":
			dy = 1;
			break;
		case "left":
			dx = -1;
			break;
		case "right":
			dx = 1;
			break;
	}

	gui_mapSet(dungeon.room[room].x + dx, dungeon.room[room].y + dy, room, "wall");
}

function guiViewHero(newRoom, oldRoom) {
	gui_heroSet(dungeon.room[newRoom].x, dungeon.room[newRoom].y, dungeon.room[oldRoom].x, dungeon.room[oldRoom].y);
}

function getRelativePosition(anchorroom, room) {
	var ax = dungeon.room[anchorroom].x;
	var ay = dungeon.room[anchorroom].y;
	var x = dungeon.room[room].x;
	var y = dungeon.room[room].y;
	if(ax == x && ay == y + 1) {
		return "top";
	}
	if(ax == x && ay == y - 1) {
		return "bottom";
	}
	if(ay == y && ax == x + 1) {
		return "left";
	}
	if(ay == y && ax == x - 1) {
		return "right";
	}
	return "";
}

dungeon.save = function(save_game) {
	save_game.putValue("d.l", dungeon.level);
}

dungeon.load = function(save_game) {
	dungeon.level = save_game.getInt("d.l");
}
