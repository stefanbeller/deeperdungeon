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
var pronoun=[];
pronoun['f'] = "deine";
pronoun['n'] = "dein";
pronoun['m'] = "deinen";

var pronoun2=[];
pronoun2['f'] = "deine";
pronoun2['n'] = "dein";
pronoun2['m'] = "dein";

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var pro = new Array()
pro['m'] = "er";
pro['f'] = "sie";
pro['n'] = "es";

var pro_g = new Array();
pro_g['m'] = "sein";
pro_g['f'] = "ihr";
pro_g['n'] = "sein";

var nom = new Array()
nom['m'] = "der";
nom['f'] = "die";
nom['n'] = "das";

var akk = new Array()
akk["m"] = "den";
akk["f"] = "die";
akk['n'] = "das";

var dat = new Array();
dat['m'] = "dem";
dat['f'] = "der";
dat['n'] = "dem";

var nom_u = new Array();
nom_u['m'] = "ein";
nom_u['f'] = "eine";
nom_u['n'] = "ein";

var akk_u = new Array();
akk_u['m'] = "einen";
akk_u['f'] = "eine";
akk_u['n'] = "ein";

var dat_u = new Array()
dat_u['m'] = "einem";
dat_u['f'] = "einer";
dat_u['n'] = "einem";

function text_uppercase(word) {
	return word.substring(0,1).toUpperCase() + word.substring(1);
}

function text_onEnemyField(enemy) {
	var texts = [nom_u[enemy.gender].capitalize() + " <b class='monster'>" + enemy.name + "</b> steht direkt vor dir. ",
				"Du betrittst den Raum und stößt mit " + dat_u[enemy.gender] + " " + enemy.name + " zusammen.",
				nom[enemy.gender].capitalize() + " <b class='monster'>" + enemy.name + "</b> wohnt schon länger hier. " + pro[enemy.gender].capitalize() + " guckt dich böse an und möchte dich verhauen.",
				nom[enemy.gender].capitalize() + " <b class='monster'>" + enemy.name + "</b> in diesem Raum sieht nicht so aus, als wäre " + pro[enemy.gender] + " über deinen Besuch erfreut."];
	return texts[Math.floor(Math.random()*texts.length)];
}

function text_onEnemyInitialAttack(enemy) {
	var texts = [nom_u[enemy.gender].capitalize() + " <b class='monster'>" + enemy.name + "</b> greift dich an: <br> Du wirst vom Monster verletzt, bevor du weglaufen kannst. ",
				"Du wolltest nur durch diese Tür gehen. Plötzlich wurdest du verhauen. Als du wieder zu dir kamst konntest du deinen Angreifer, " + akk_u[enemy.gender] + " " + enemy.name + ", erkennen.",
				nom[enemy.gender].capitalize() + " <b class='monster'>" + enemy.name + "</b> in diesem Raum mag wohl keinen Besuch, " + pro_g[enemy.gender] + " Schlag war jedenfalls schmerzhaft."];
	return texts[Math.floor(Math.random()*texts.length)];
}

function text_damageItem(item) {
	var texts = [
				"Das war ein harter Schlag. Deine Ausrüstung wurde beschädigt. ",
				"Pass auf, deine Ausrüstung war schonmal stärker.",
				"Das war nicht gut für " + pronoun[item.gender] + " <b class='item'>" + item.name + "</b>.",
				text_uppercase(pronoun2[item.gender]) + " <b class='item'>" + item.name + "</b> musste viel aushalten und ist jetzt weniger stabil."
				];
	return texts[Math.floor(Math.random()*texts.length)];
}

function text_monsterStrikesBack(enemy) {
	var texts = [
				"Das Monster schlägt zurück.",
				nom[enemy.gender].capitalize() + " <b class='monster'>" + enemy.name + "</b> lacht dich für deinen Angriffsversuch aus und verhaut dich.",
				"Aua. Das Monster wehrt sich gegen dich.",
				"Du hast auf einen kurzen Kampf gehofft? Fehlanzeige, hier wird richtig gekämpft. Der letzte Schlag kam vom Monster und war ziemlich schmerzhaft."
				];
	return texts[Math.floor(Math.random()*texts.length)];
}

function text_escapeFailed(enemy) {
	var texts = [
				"Das Monster hält dich fest!",
				"So ein Pech, " + nom[enemy.gender] + " <b class='monster'>" + enemy.name + "</b> steht zwischen dir und deinem Weg in die Freiheit.",
				"Du bist gestolpert, jetzt steht " + nom[enemy.gender] + " <b class='monster'>" + enemy.name + "</b> über dir.",
				"Die Tür ist hinter dir zugefallen und du bekommst sie in der Eile nicht geöffnet.",
				"Feigling! Nützt dir aber auch nichts, dieses Spiel ist unfair und dieser Fluchtversuch scheitert."
				];
	return texts[Math.floor(Math.random()*texts.length)];
}
