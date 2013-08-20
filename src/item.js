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

function Item(itemtype, name, gender, room, hp_bonus, atk_bonus, def_bonus)
{
    this.type = "item"
    this.name = name;
    this.gender = gender;
    this.room = room;
    this.itemtype = itemtype; // weapon, armor, jewel
    this.hp_bonus = hp_bonus;
    this.atk_bonus = atk_bonus;
    this.def_bonus = def_bonus;
    this.hp_initial = hp_bonus;
    this.atk_initial = atk_bonus;
    this.def_initial = def_bonus;

    this.getDescriptionAsNeighbor = function() {
        return "";
    }
    this.equip = function() {
        p.atk    += this.atk_bonus;
        p.def    += this.def_bonus;
        p.hp     += this.hp_bonus;
    }

    this.unequip = function() {
        p.atk    -= this.atk_bonus;
        p.def    -= this.def_bonus;
        p.hp     -= this.hp_bonus;
    }

    this.damageItem = function() {
        switch(Math.floor(Math.random()*3)) {
            case 0:
                if (this.hp_initial == 0)
                    return false;
                var hp_damage = this.hp_initial * Math.random()/4;
                hp_damage = Math.floor(Math.max(1, hp_damage));
                this.hp_bonus -= hp_damage;
                p.hp -= hp_damage;
                break;
            case 1:
                if (this.def_initial == 0)
                    return false;
                var def_damage = this.atk_initial * Math.random()/4;
                def_damage = Math.floor(Math.max(1, def_damage));
                this.def_bonus -= def_damage;
                p.def -= def_damage;
                break;
            case 2:
                if (this.atk_initial == 0)
                    return false;
                var atk_damage= this.atk_initial * Math.random()/4;
                atk_damage = Math.floor(Math.max(1, atk_damage));
                this.atk_bonus -= atk_damage;
                p.atk -= atk_damage;
                break;
        }
        return true;
    }

    this.getTooltip = function() {
        if (this.itemtype == "potion") {
            return "<table><tr> " + this.name + " (wird sofort getrunken!)</tr></table>";
        } else {
            var bonus="<table><tr>"
            switch(this.itemtype) {
                case "weapon": bonus += "Waffe"; break;
                case "armor": bonus += "Rüstung"; break;
                case "jewel": bonus += "Talisman"; break;
            }
            if (this.atk_bonus) {
                bonus+="<td>Atk: </td><td>"+formatBonus(this.atk_bonus, '');
            }
            if (this.def_bonus) {
                bonus+="</td></tr><tr><td>Def: </td><td>"+formatBonus(this.def_bonus, '');
            }
            if (this.hp_bonus) {
                bonus+="</td></tr><tr><td>HP: </td><td>"+formatBonus(this.hp_bonus, '');
            }
            bonus += "</td></tr></table>"
            return bonus
        }
    }
}

function CreateWeakItem(room)
{
    var health_items = [
        ["Warmes Ei", 'n'],
        ["Bunte Murmel", 'f'],
        ["Hundemarke", 'f'],
        ["Herzkette", 'f'],
        ["Einfacher Ring", 'm'],
        ["Talisman", 'm'],
        ["Wilder Vodoo-Wecker", 'm'],
        ["Huhn auf dem Kopf", 'n'],
        ["Sankt-Martins-Umhang", 'm'],
        ["Tüte mit Grass", 'f'],
        ["Tüte mit Oregano", 'f'],
        ["Duft-Fläschchen", 'n'],
        ["Mächtiges Amulett", 'n'],
        ["Gutschein für einen Stärkungstrank", 'm'],
        ["Kleines Silberamulett", 'm'],
        ["Eisenring aus Silber", 'm'],
        ["geweihte Bandage", 'f'],
        ["schwere Goldkette", 'f'],
        ["Echt-Leder-Gucci-Umhängetasche", 'f'],
        ["Schillernder Talisman", 'm']
    ];

    var atk_items = [
        ["Rostige Nagelschere", 'f'],
        ["Rostiges Messer", 'n'],
        ["kurzer Ast", 'm'],
        ["Stabiler Ast", 'm'],
        ["Ast mit Nagel", 'm'],
        ["Hammer", 'm'],
        ["Vorschlaghammer", 'm'],
        ["Schleimiger Riesendildo", 'm'],
        ["Holzstab mit eingebautem Damagedealer", 'm'],
        ["Klobürste der argen Verwüstung", 'f'],
        ["Pinsel", 'm'],
        ["Silberschwert aus Eisen", 'n'],
        ["Goldener Löffel", 'm'],
        ["unbenutzter Besen", 'm'],
        ["Lampenständer", 'm'],
        ["Schlaftabletten (zum Werfen)", 'f'],
        ["Druckerkabel", 'n'],
        ["Dönerspieß", 'm'],
        ["Jojo", 'n'],
        ["Schraubendreher", 'm'],
        ["Schraubenzieher", 'm'],
        ["Eisenstange", 'f'],
        ["Plastik-Baguette", 'n'],
        ["Gurke", 'f'],
        ["Stange Lauch", 'f']
    ];

    var def_items = [
        ["Schmutziges Hemd", 'n'],
        ["Zerfranste Hosen", 'f'],
        ["Stoffkappe", 'f'],
        ["Alditüte mit Smiley", 'f'],
        ["Kettenhemd", 'n'],
        ["Lederrüstung", 'f'],
        ["Stachelige Knieschoner", 'f'],
        ["große Wadenschoner", 'f'],
        ["Batman Kostüm", 'n'],
        ["Straßenschild", 'n'],
        ["rostiger Harnisch aus Plastik", 'm'],
        ["Herzchen Kissen", 'n'],
        ["Schutzausrüstung", 'f'],
        ["Unbeschreibliches Etwas", 'n'],
        ["Papierrüstung (feuerfest)", 'f'],
        ["magischer Schutz", 'm'],
        ["Konfetti zur Ablenkung", 'n'],
        ["Schutzengel", 'm']
    ];

    var cases = 4;
    var type = Math.floor(Math.min(Math.random()*cases, Math.random() * cases * 3 +  dungeon.level));
    if (type == 0) {
        var i = Math.floor(Math.min(Math.random(), Math.random()) * atk_items.length);
        var bonus = 1 +
                    Math.floor(Math.random()*dungeon.level) +
                    Math.floor(Math.min(6 * Math.random(),
                                        10 * Math.random())
                             * i / atk_items.length);
        return new Item("weapon", atk_items[i][0], atk_items[i][1], room, 0, bonus, 0);
    }
    if (type == 1) {
        var i = Math.floor(Math.min(Math.random(), Math.random()) * def_items.length);
        var bonus = 1 +
                    Math.floor(Math.random()*dungeon.level) +
                    Math.floor(Math.min(7 * Math.random(),
                                        10 * Math.random())
                            * i / def_items.length);
        return new Item("armor", def_items[i][0], def_items[i][1], room, 0, 0, bonus);
    }
    if (type == 2) {
        var i = Math.floor(Math.min(Math.random(), Math.random()) * health_items.length);
        var bonus = 1 +
                    Math.floor(Math.random()*dungeon.level) +
                    Math.floor(Math.min(5 * Math.random(),
                                        10 * Math.random())
                            * i / health_items.length);
        return new Item("jewel", health_items[i][0], health_items[i][1], room, bonus, 0, 0);
    }
    if (type == 3) {
        var cases = 22;
        var id = Math.floor(Math.min(Math.random() * cases, Math.random() * 3 * cases + dungeon.level/10));
        var ah = Math.floor(dungeon.level/5);
        switch (id) {
            case 0: return new Item("potion", "Überraschungstrank (bestimmt gar nicht böse)", 'm', room, ah-1, 0, 0);
            case 1: return new Item("potion", "schwacher Heiltrank", 'm', room, ah+2, 0, 0);
            case 2:
            case 3: return new Item("potion", "kleiner Heiltrank", 'm', room, ah+3, 0, 0);
            case 4:
            case 5: return new Item("potion", "mittlerer Heiltrank", 'm', room, ah+4, 0, 0);
            case 6:
            case 7: return new Item("potion", "ordentlicher Heiltrank", 'm', room, ah+5, 0, 0);
            case 8:
            case 9: return new Item("potion", "leckerer Heiltrank", 'm', room, ah+4, 0, 0);
            case 10:
            case 11: return new Item("potion", "großer Heiltrank", 'm', room, ah+6, 0, 0);
            case 12:
            case 13: return new Item("potion", "riesiger Heiltrank", 'm', room, ah+7, 0, 0);
            case 14: return new Item("potion", "fast vollständiger Heiltrank", 'm', room, ah+7, 0, 0);
            case 15: return new Item("potion", "Überraschungstrank", 'm', room, ah+Math.floor(-1 +Math.random()*4), 0, 0);
            case 16: return new Item("potion", "giftgrüner Trank der Nutzlosigkeit", 'm', room, ah+0, 0, 0);
            case 17: return new Item("potion", "Trank des Zufalls", 'm', room, 0, ah+Math.floor(Math.random()*4), Math.floor(Math.random()*4));
            case 18: return new Item("potion", "Überrauschungstrank", 'm', room, 0, ah+Math.floor((Math.random()*5)-2), Math.floor((Math.random()*5)-2));
            case 19: return new Item("potion", "Trank der Wut", 'm', room, ah, ah+1, 0);
            case 20: return new Item("potion", "Trank der Kraft", 'm', room, ah, ah+2, 0);
            case 21: return new Item("potion", "Trank der Stärke", 'm', room, ah, 0, ah+1);
            case 22: return new Item("potion", "Trank des Willens", 'm', room, ah, 0, ah+2);
        }
    }

    return new Item("none", "Trash", 'm', room, 0, 0, 0);
}

function CreateNormalItem(room)
{
    var newItem = CreateWeakItem(room)
    newItem.atk_bonus += 1
    newItem.def_bonus += 1
    newItem.hp_bonus += 1
    newItem.name+=" (verbessert)"
    return newItem
}

function CreateGoodItem(room)
{
    var newItem = CreateNormalItem(room)
    newItem.atk_bonus += 1
    newItem.def_bonus += 1
    newItem.hp_bonus += 1
    newItem.name+=" (und noch mehr verbessert)"
    return Item
}

function createItem(room)
{
    var r = -Math.log(0.00001 + Math.random())
    if (r < 4)
        return CreateWeakItem(room)
    if (r < 8)
        return CreateNormalItem(room)

    return CreateGoodItem(room)
}

function loadItem(save_game, prefix) {
	var itemtype = save_game.getValue(prefix + "it");
	var name = save_game.getValue(prefix + "n");
	var gender = save_game.getValue(prefix + "g");
	var room = save_game.getInt(prefix + "r");
	var hp_b = save_game.getFloat(prefix + "hb");
	var hp_i = save_game.getFloat(prefix + "hi");
	var atk_b = save_game.getFloat(prefix + "ab");
	var atk_i = save_game.getFloat(prefix + "ai");
	var def_b = save_game.getFloat(prefix + "db");
	var def_i = save_game.getFloat(prefix + "di");
	var loaditem = new Item(itemtype, name, gender, room, hp_b, atk_b, def_b);
	loaditem.hp_initial = hp_i;
	loaditem.atk_initial = atk_i;
	loaditem.def_initial = def_i;
	return loaditem;
}

function saveItem(save_game, item, prefix) {
	save_game.putValue(prefix + "it", item.itemtype);
	save_game.putValue(prefix + "n", item.name);
	save_game.putValue(prefix + "g", item.gender);
	save_game.putValue(prefix + "r", item.room);
	save_game.putValue(prefix + "hb", item.hp_bonus);
	save_game.putValue(prefix + "hi", item.hp_initial);
	save_game.putValue(prefix + "ab", item.atk_bonus);
	save_game.putValue(prefix + "ai", item.atk_initial);
	save_game.putValue(prefix + "db", item.def_bonus);
	save_game.putValue(prefix + "di", item.def_initial);
}

