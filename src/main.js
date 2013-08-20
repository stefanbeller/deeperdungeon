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

var save = null;

// called after the html page is completely loaded
function init() {
	header.innerHTML = gui_setRandomTitle();
	dungeon.level = 0;
	p = new Player(15, 5, 5)

	save = new savegame();
	save.addObj(p);
	save.addObj(dungeon);
	save.parseData();
	if(save.isDataAvailable()) {
		var onYesButton = function () { save.load(); p.enterNewDungeon(); }
		var onNoButton = function () { p.enterNewDungeon(); }
		var onImportButton = function () {
			var onLoadButton = function(savestring) { save.loadString(savestring); p.enterNewDungeon(); }
			gui_requestLoadGameInput(onLoadButton);
		}
		gui_requestLoadGame(save, onYesButton, onNoButton, onImportButton);
	} else {
		var onLoadButton = function(savestring) { save.loadString(savestring); p.enterNewDungeon(); }
		gui_requestLoadGameInput(onLoadButton);
	}
}

function init_new_game() {
	header.innerHTML = gui_setRandomTitle();
	dungeon.level = 0;
	p = new Player(15, 5, 5)

	save = new savegame();
	save.addObj(p);
	save.addObj(dungeon);
	save.parseData();
	p.enterNewDungeon();
}

var KEYCODE_UP     = 38; // arrow up
var KEYCODE_DOWN   = 40; // arrow down
var KEYCODE_LEFT   = 37; // arrow left
var KEYCODE_RIGHT  = 39; // arrow right
var KEYCODE_ENTER  = 13;
var KEYCODE_SPACE  = 32;
var KEYCODE_ESC  = 27;
var KEYCODE_BACKSPACE  = 8;
var KEYCODE_W = 87;
var KEYCODE_A = 65;
var KEYCODE_S = 83;
var KEYCODE_D = 68;

function handleKeyUp(evt) {
	switch(evt.keyCode) {
		case KEYCODE_UP:
		case KEYCODE_W:
			p.tryWalkInDirection("up");
			break;
		case KEYCODE_DOWN:
		case KEYCODE_S:
			p.tryWalkInDirection("down");
			break;
		case KEYCODE_LEFT:
		case KEYCODE_A:
			p.tryWalkInDirection("left");
			break;
		case KEYCODE_RIGHT:
		case KEYCODE_D:
			p.tryWalkInDirection("right");
			break;
		case KEYCODE_ENTER:
		case KEYCODE_SPACE:
			p.tryPickFight();
			break;
		case KEYCODE_ESC:
		case KEYCODE_BACKSPACE:
			p.tryescape();
			break;
	}
	hideTooltip();
}

window.addEventListener('keyup', handleKeyUp, true);

/* // this may be necessary for compatibility with IE
if (window.addEventListener){
  window.addEventListener('keyup', handleKeyUp, true);
} else if (window.attachEvent){
  window.attachEvent('onkeyup', handleKeyUp);
}*/
