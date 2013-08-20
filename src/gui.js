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

var BUTTON_RESTART = 1;
var BUTTON_YES = 2;
var BUTTON_NO = 4;
var BUTTON_LOAD = 8;
var BUTTON_IMPORT = 16;
var INPUTFIELD = 32;

function gui_setRoomNumber(x) {
	document.getElementById("room").innerHTML="Raum: "+x;
}

function gui_setDungeon(x) {
	document.getElementById("dungeon").innerHTML="Ebene: "+x;
}

function gui_setRoomText(text) {
	document.getElementById("roomtext").innerHTML=text;
}

function gui_addRoomText(text) {
	document.getElementById("roomtext").innerHTML += text;
}

function gui_setStats(field, value) {
	document.getElementById(field).innerHTML = value;
}

function gui_clearStats() {
	document.getElementById("stats").innerHTML="";
}

function gui_setRandomTitle() {
	var rnd_a = new Array("Accursed", "Ancient", "Baneful", "Batrachian", "Black", "Bloodstained", "Cold", "Dark", "Devouring", "Diabolical", "Ebon", "Eldritch", "Forbidden", "Forgotten", "Haunted", "Hidden", "Lonely", "Lost", "Malevolent", "Misplaced", "Nameless", "Ophidian", "Scarlet", "Secret", "Shrouded", "Squamous", "Strange", "Tenebrous", "Uncanny", "Unspeakable", "Unvanquishable", "Unwholesome", "Vanishing", "Weird");
	var rnd_b = new Array("Abyss", "Catacombs", "Caverns", "Citadel", "City", "Cyst", "Depths", "Dungeons", "Fane", "Fortress", "Halls", "Haunts", "Isle", "Keep", "Labyrinth", "Manse", "Maze", "Milieu", "Mines", "Mountain", "Oubliette", "Panopticon", "Pits", "Ruins", "Sanctum", "Shambles", "Temple", "Tower", "Vault");
	var rnd_c = new Array("the Axolotl", "Blood", "Bones", "Chaos", "Curses", "the Dead", "Death", "Demons", "Despair", "Deviltry", "Doom", "Evil", "Fire", "Frost", "Gloom", "Hells", "Horrors", "Ichor", "Iron", "Madness", "Mirrors", "Mists", "Monsters", "Mystery", "Necromancy", "Oblivion", "the (Table I) One(s)", "Peril", "Phantasms", "Random Harlots", "Secrets", "Shadows", "Sigils", "Skulls", "Slaughter", "Sorcery", "Syzygy", "Terror", "Torment", "Treasure", "the Undercity", "the Underworld", "the Unknown");

	return rnd_a[Math.floor(Math.random()*rnd_a.length)] + " " + rnd_b[Math.floor(Math.random()*rnd_b.length)] + " of " + rnd_c[Math.floor(Math.random()*rnd_c.length)];
}

var gui_numInfos=0;
var gui_infoFields=[];
var gui_infoValues=[];

function gui_addInfo(field, value) {
	gui_infoFields[gui_numInfos] = field;
	gui_infoValues[gui_numInfos] = value;
	gui_numInfos++;
	var outputtext = "";
	for (var i=0; i<gui_numInfos; i++) {
    	outputtext = outputtext + gui_infoFields[i] + ": " + gui_infoValues[i] + "<br>";
	}
	document.getElementById("infos").innerHTML=outputtext;
}

function gui_clearInfos() {
	gui_infoFields=[];
	gui_infoValues=[];
	gui_numInfos=0;
	document.getElementById("infos").innerHTML="";
}

function gui_mapSet(x, y, room ,color) {
	document.getElementById("map"+x+"x"+y).className="map_tile "+color;
	document.getElementById("map"+x+"x"+y).title = room;
}

function gui_heroSet(x_new, y_new, x_old, y_old) {
	document.getElementById("map"+x_old+"x"+y_old).style.borderColor = 'black';
	document.getElementById("map"+x_new+"x"+y_new).style.borderColor='red';
}

function gui_unveilMap(x, y) {
	document.getElementById("map"+x+"x"+y).style.borderColor = 'white';
}

function gui_mapAddWarning(x, y) {

}

function gui_generateMap(w, h) {
	var output="<table class=map cellpadding=0 cellspacing=0>";
	for(var y=0; y<h; ++y) {
		output += "<tr>";
		for(x=0; x<w; ++x) {
			output += "<td id='map" + x + "x" + y + "' class='map_tile map_unknown'></td>";
		}
		output = output + "</tr>";
	}
	output+="</table>";
	document.getElementById("map").innerHTML=output;
}

function gui_showPopup(text, buttons) {
	document.getElementById("overlay_background").style.display = "inline";
	document.getElementById("overlay_window").style.display = "inline";
	document.getElementById("overlay_text").innerHTML = text;

	if(buttons & BUTTON_RESTART)
		document.getElementById("overlay_button_restart").style.display = "inline-block";
	else
		document.getElementById("overlay_button_restart").style.display = "none";

	if(buttons & BUTTON_YES)
		document.getElementById("overlay_button_yes").style.display = "inline-block";
	else
		document.getElementById("overlay_button_yes").style.display = "none";

	if(buttons & BUTTON_NO)
		document.getElementById("overlay_button_no").style.display = "inline-block";
	else
		document.getElementById("overlay_button_no").style.display = "none";

	if(buttons & BUTTON_LOAD)
		document.getElementById("overlay_button_load").style.display = "inline-block";
	else
		document.getElementById("overlay_button_load").style.display = "none";

	if(buttons & BUTTON_IMPORT)
		document.getElementById("overlay_button_import").style.display = "inline-block";
	else
		document.getElementById("overlay_button_import").style.display = "none";

	if(buttons & INPUTFIELD)
		document.getElementById("overlay_input_wrapper").style.display = "inline-block";
	else
		document.getElementById("overlay_input_wrapper").style.display = "none";
}

function gui_hideOverlay() {
	document.getElementById("overlay_background").style.display = "none";
	document.getElementById("overlay_window").style.display = "none";
	document.getElementById("overlay_button_restart").style.display = "none";
	document.getElementById("overlay_button_yes").style.display = "none";
	document.getElementById("overlay_button_no").style.display = "none";
	document.getElementById("overlay_button_load").style.display = "none";
	document.getElementById("overlay_input_wrapper").style.display = "none";
}

var buttondescriptors=[];

function gui_addButton(buttondescriptor) {
	var id = buttondescriptors.length;
	buttondescriptors[id] = buttondescriptor;

	if (buttondescriptor.tooltip)
		document.getElementById("actions").innerHTML += "<div id=button_" + id + " class=actionbutton onClick='javascript:hideTooltip();gui_buttonClicked(" + id +");' onMouseOver='javascript:showTooltip(\""+buttondescriptor.tooltip + "\");' onMouseOut='javascript:hideTooltip();'>" + buttondescriptor.label + "</div><br>";
	else
		document.getElementById("actions").innerHTML += "<div id=button_" + id + " class=actionbutton onClick='javascript:gui_buttonClicked(" + id +");'>" + buttondescriptor.label + "</div><br>";
}

function gui_clearButtons() {
	document.getElementById("actions").innerHTML = "";
}

function gui_buttonClicked(id) {
	var desc = buttondescriptors[id];
	desc.onClick();
}

function gui_setHealth(health, max_health) {
	document.getElementById("healthbarlabel").innerHTML = "HP: " + parseInt(health);
	var w = (health/max_health*100);
	document.getElementById("healthbar").style.width = w+"%";
	document.getElementById("healthbar").style.marginLeft = (-w/2) + "%";
	document.getElementById("healthbar_wrapper").onmouseover = function() { showTooltip(parseInt(health) + '/' + parseInt(max_health)); }
	document.getElementById("healthbar_wrapper").onmouseout = function() { hideTooltip(); }
}

function tooltipdescriptor(tooltip) {
	this.label = tooltip;
}

var tooltip_bonus = new Array();
function showItemTooltip(obj) {
	showTooltip(tooltip_bonus[obj.id]);
}

function gui_clearItem(slot) {
	document.getElementById(slot).innerHTML = "";
	tooltip_bonus[slot] = "";
}

function gui_viewItem(item) {
	tooltip_bonus[item.itemtype] = item.getTooltip();
	document.getElementById(item.itemtype).innerHTML = item.name;

	document.getElementById(item.itemtype).onmouseover = function() { showItemTooltip(this); }
	document.getElementById(item.itemtype).onmouseout = function() { hideTooltip(); }
}

// Tooltips
wmtt = null;
document.onmousemove = updateTooltip;

function showTooltip(text) {
	if(text && text != "") {
		wmtt = document.getElementById('tooltip');
		wmtt.style.display = "block";
		wmtt.innerHTML = text;
	}
}

function updateTooltip(e) {
	if (wmtt != null && wmtt.style.display == 'block') {
		x = (e.pageX ? e.pageX : window.event.x) + wmtt.offsetParent.scrollLeft - wmtt.offsetParent.offsetLeft;
		y = (e.pageY ? e.pageY : window.event.y) + wmtt.offsetParent.scrollTop - wmtt.offsetParent.offsetTop;
		wmtt.style.left = (x + 20) + "px";
		wmtt.style.top = (y + 20) + "px";
	}
}

function hideTooltip() {
	if(wmtt) {
		wmtt.style.display = "none";
	}
}

function gui_showEOL(victory) {
	var s="";
	if(victory) {
		s = "<h1>Du hast gewonnen!</h1>";
		s += "<p>Gegen dich ist kein Kraut gewachsen. Du hast alle Gegner besiegt. </p><p> Herzlichen Glückwunsch!</p>";
	} else {
		s = "<h1>Das war wohl nichts!</h1>";
		s += "<p>Dein letzter Gegner war zu stark für dich und hat dich besiegt. Aber halb so schlimm, du kannst es ja noch einmal probieren!</p>";
	}
	s += "<p>Bei deinen Kämpfen bist du bis in den Dungeon Nummer " + dungeon.level + " vorgedrungen und hast dabei " + p.killedEnemies + " Monster besiegt. ";
	if(dungeon.level > 10 || p.killedEnemies > 10) {
		s += "Gute Leistung!</p>";
	} else {
		s += "Da musst du wohl noch etwas üben!</p>";
	}
	gui_showPopup(s, BUTTON_RESTART);
}

var gui_onYesButton = null;
var gui_onNoButton = null;
var gui_onLoadButton = null;
function gui_button_yes() {
	if(gui_onYesButton)
		gui_onYesButton();
}

function gui_button_no() {
	if(gui_onNoButton)
		gui_onNoButton();
}

function gui_button_import() {
	if(gui_onImportButton)
		gui_onImportButton();
}

var gui_inputtext = "";
function gui_button_load() {
	if(gui_onLoadButton) {
		gui_onLoadButton(document.getElementById("overlay_input").value);
	}
}

function gui_onInputUpdate(text) {
	gui_inputtext = text;
}

function gui_requestLoadGame(save_game, onYes, onNo, onImport) {
	var s="<h1>Spiel laden?</h1>";
	s += "Das Spiel wurde zuletzt am " + save_game.getValue("saveDay") + " um " + save_game.getValue("saveTime") + " beim Verlassen der Ebene " + save_game.getValue("d.l") + " gespeichert. Soll dieses Spiel geladen werden?";
	gui_onYesButton = onYes;
	gui_onNoButton = onNo;
	gui_onImportButton = onImport;
	gui_showPopup(s, BUTTON_YES | BUTTON_NO | BUTTON_IMPORT);
}

function gui_requestLoadGameInput(onLoad) {
	var s="<h1>Spiel importieren?</h1>";
	s += "Den zu importierenden Spielstand in das folgende Feld einfügen:";
	gui_onLoadButton = onLoad;
	gui_showPopup(s, BUTTON_LOAD | BUTTON_RESTART | INPUTFIELD);
}

function formatBonus(b, separator) {
	if(!b || b==0) {
		return "";
	}
	if(b > 0) {
		return "+" + separator + b;
	} else {
		return "-" + separator + (-b);
	}
}
