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

function Player(hp, atk, def)
{
    this.hp = hp;
    this.atk = atk;
    this.def = def;
    this.weapon = null;
    this.armor = null;
    this.jewel = null;
    this.room = 0;
    this.oldroom = 0;
    this.freewalking = true;
    this.dead = false;
    this.successfulEscapeProbability=0.5;
    this.enemyDamagesItemProbability=0.8;
    this.max_hp = hp;
    this.killedEnemies=0;
    gui_setHealth(this.hp, this.max_hp);
    gui_clearItem("weapon");
    gui_clearItem("armor");
    gui_clearItem("jewel");

    this.enterNewDungeon = function() {
        generateDungeon()
        gui_setDungeon(dungeon.level)
        for (var i=0; i < dungeon.room.length;i++) {
            if (dungeon.room[i].content==null) {
                this.room=i;
                break;
            }
        }
        gui_clearInfos();
        this.displayAtkDef();
        gui_setHealth(this.hp, this.max_hp);
        this.enterRoom(this.room);

		var d_a = new Object();
		d_a.label="Spielstand exportieren";
		d_a.onClick = function() { gui_addRoomText("<br>" + save.getSaveGameString() + "<br>"); }
		gui_addButton(d_a);

    }

    this.displayAtkDef = function() {
        var atk_bonus = 0;
        if (this.weapon != null)
            atk_bonus += this.weapon.atk_bonus;
        if (this.armor != null)
            atk_bonus += this.armor.atk_bonus;
        if (this.jewel != null)
            atk_bonus += this.jewel.atk_bonus;

        var def_bonus = 0;
        if (this.weapon != null)
            def_bonus += this.weapon.def_bonus;
        if (this.armor != null)
            def_bonus += this.armor.def_bonus;
        if (this.jewel != null)
            def_bonus += this.jewel.def_bonus;

        var atk_base = this.atk - atk_bonus;
        var def_base = this.def - def_bonus;

        var atk_string = "" + atk_base;
        var def_string = "" + def_base;

        if (atk_bonus != 0)
            atk_string += " " + formatBonus(atk_bonus, ' ');

        if (def_bonus != 0)
            def_string += " " + formatBonus(def_bonus, ' ');

        gui_setStats("attack_value", atk_string);
        gui_setStats("armor_value", def_string);
    }

    this.showNavigationButtons = function(room) {
        this.freewalking = true;

        var translation = new Array();
        translation["left"] = "Westen";
        translation["right"] = "Osten";
        translation["bottom"] = "Süden";
        translation["top"] = "Norden";

        for (var i=0; i < dungeon.room[room].neighbors.length; i++) {
            var d_a = new Object();
            d_a.label="Gehe in Raum "+ dungeon.room[room].neighbors[i] + " (" + translation[getRelativePosition(room, dungeon.room[room].neighbors[i])]+ ")";
            d_a.id = dungeon.room[room].neighbors[i]
            d_a.onClick = function() { p.enterRoom(this.id); }
            gui_addButton(d_a);
        }
    }

    this.showFightButtons = function () {
        gui_clearButtons();

        var enemy = dungeon.room[this.room].content;
        var d_a = new Object();
        d_a.label = "Kämpfe gegen " + akk[enemy.gender] + " '" + enemy.name + "'";
        d_a.onClick = function() { p.fight(); }
        gui_addButton(d_a);

        var d_a = new Object();
        d_a.label = "Fliehe vor dem Monster";
        d_a.oldroom = this.oldroom;
        d_a.room = this.room;
        d_a.onClick = function() { p.escape(); }
        gui_addButton(d_a);
    }
    this.pickup = function(room) {
        if (!dungeon.room[room].content)
            return
        tobedropped=null

        if (dungeon.room[room].content.itemtype == "weapon") {
            if (this.weapon)
                this.weapon.unequip()
            gui_clearItem("weapon");
            tobedropped = this.weapon
            this.weapon = dungeon.room[room].content
            this.weapon.equip()
            gui_viewItem(this.weapon)
        }
        if (dungeon.room[room].content.itemtype == "armor") {
            if (this.armor)
                this.armor.unequip()
            gui_clearItem("armor");
            tobedropped = this.armor
            this.armor = dungeon.room[room].content
            this.armor.equip()
            gui_viewItem(this.armor)
        }
        if (dungeon.room[room].content.itemtype == "jewel") {
            if (this.jewel)
                this.jewel.unequip()
            gui_clearItem("jewel");
            tobedropped = this.jewel
            this.jewel = dungeon.room[room].content
            this.jewel.equip()
            gui_viewItem(this.jewel)
        }
        if (dungeon.room[room].content.itemtype == "potion") {
            this.atk += dungeon.room[room].content.atk_bonus;
            this.def += dungeon.room[room].content.def_bonus;
            this.hp += dungeon.room[room].content.hp_bonus;
            this.max_hp = Math.max(this.hp, this.max_hp);
        }

        dungeon.room[room].content = tobedropped
        this.displayAtkDef()
        this.max_hp = Math.max(this.hp, this.max_hp);
        gui_setHealth(this.hp, this.max_hp);

        this.enterRoom(room)
    }


    this.readHint = function(room) {
        if (!dungeon.room[room].content)
            return

        gui_addRoomText("<br>" + dungeon.room[room].content.getHint())
        gui_addInfo(dungeon.room[room].content.name, dungeon.room[room].content.getHint())
        dungeon.room[room].content.unveilMap();
    }


    this.describeRoom = function(room) {
        guiViewRoom(this.room)
        guiViewHero(this.room, this.oldroom)
        gui_setRoomNumber(room)

        var environment=[];
        environment['top'] = null;
        environment['bottom'] = null;
        environment['left'] = null;
        environment['right'] = null;
        var s = ""
        var thisroom = dungeon.room[room]

        if (thisroom.content != null && thisroom.content.type != "deadenemy") {
            if(thisroom.content.gender) {
                if(thisroom.content.type == "enemy") {
                    s += "Du siehst " + akk_u[thisroom.content.gender] + " <b class='monster'>" + thisroom.content.name + "</b>.<br>";
                } else if(thisroom.content.type == "item") {
                    s += "Du siehst " + akk_u[thisroom.content.gender] + " <b class='item'>" + thisroom.content.name + "</b>.<br>";
                } else if(thisroom.content.type == "hint") {
                    s += "Du siehst " + akk_u[thisroom.content.gender] + " <b class='hint'>" + thisroom.content.name + "</b>.<br>";
                } else if(thisroom.content.type == "stairs") {
                    s += "Du siehst " + akk_u[thisroom.content.gender] + " <b class='stairs'>" + thisroom.content.name + "</b>.<br>";
                } else {
                    s += "Du siehst " + akk_u[thisroom.content.gender] + " <b>" + thisroom.content.name + "</b>.<br>";
                }
            } else {
                s += "Du siehst '" + thisroom.content.name + "'.<br>";
            }
        }

        for (var i=0; i < thisroom.neighbors.length; i++) {
            var neigh = dungeon.room[thisroom.neighbors[i]]
            environment[getRelativePosition(room, thisroom.neighbors[i])] = neigh;
            if (neigh.content)
                if (neigh.content.type != "deadenemy")
                    s += neigh.content.getDescriptionAsNeighbor() + "<br>"
        }
        if(environment['top'] == null) {
            guiViewWall(this.room, 'top');
        }
        if(environment['bottom'] == null) {
            guiViewWall(this.room, 'bottom');
        }
        if(environment['left'] == null) {
            guiViewWall(this.room, 'left');
        }
        if(environment['right'] == null) {
            guiViewWall(this.room, 'right');
        }
        gui_setRoomText(s)
    }

    this.formatHp = function(hp) {
        return "" + Math.floor(hp);
    }

    this.fight = function() {
        var enemy = dungeon.room[this.room].content;
        enemy.hp -= Math.max(1, this.atk)/Math.max(1, enemy.def) * (25 * Math.random() + 75)/100;
        var s = "";
        enemy.wasAttacked = true;
        if(enemy.hp > 0) {
            s = enemy.getHealthDescription() + "<br>"
        } else {
            s= "Du hast " + akk[enemy.gender] + " <b class='monster'>" + enemy.name + "</b> besiegt!<br>";
            this.killedEnemies++;
            enemy.type="deadenemy";
            if (enemy.atk_bonus) {
                this.atk += enemy.atk_bonus;
                s += "Deine Kampfkraft ist gestiegen! <br>";
            }
            if (enemy.def_bonus) {
                this.def += enemy.def_bonus;
                s += "Deine Verteidigung ist gestiegen! <br>";
            }
            if (enemy.hp_bonus) {
                this.hp += enemy.hp_bonus;
                this.max_hp = Math.max(this.hp, this.max_hp);
                s += "Deine Lebenskraft ist gestiegen! <br>";
            }
            this.displayAtkDef();
            gui_setHealth(this.hp, this.max_hp);
            guiViewRoom(this.room, "deadenemy");
            gui_clearButtons();
            this.showNavigationButtons(this.room);
        }
        gui_setRoomText(s);

        if(enemy.hp > 0) {
            this.enemyattack(this.room);
        }
    }

    this.enemyattack = function(room) {
        var enemy = dungeon.room[room].content;
        var delta_hp = Math.max(1, enemy.atk)/Math.max(1,this.def) * (25 * Math.random() + 75)/100;
        this.hp -= delta_hp;
        if(parseInt(this.hp) <= 0) {
            gui_setHealth(0, this.max_hp);
            gui_setRoomText(nom[enemy.gender].capitalize() + " " + enemy.name + " hat dich besiegt und du bist gestorben!");
            guiViewRoom(room, "enemy");
            gui_clearButtons();
            this.dead = true;
            gui_showEOL(false);
            save.deleteData();
        } else {
            if(enemy.wasAttacked) {
                gui_addRoomText(text_monsterStrikesBack(enemy)+"<br>");
            } else {
                gui_addRoomText(text_onEnemyInitialAttack(enemy)+"<br>");
            }

            if(Math.random() < this.enemyDamagesItemProbability) {
                var varitems=new Array();
                if(this.weapon)
                    varitems[varitems.length] = this.weapon;
                if(this.armor)
                    varitems[varitems.length] = this.armor;
                if(this.jewel)
                    varitems[varitems.length] = this.jewel;

                if(varitems.length > 0) {
                    var toDamage = varitems[Math.floor(Math.random() * varitems.length)];
                    if (toDamage.damageItem()) {
                        gui_addRoomText(text_damageItem(toDamage));
                        gui_viewItem(toDamage);
                    }
                    this.displayAtkDef();
                }
            }
            gui_setHealth(this.hp, this.max_hp);
        }
    }

    this.escape = function() {
        if (this.dead)
            return
        gui_setRoomText("")
        var enemy = dungeon.room[this.room].content;
        if (Math.random() < this.successfulEscapeProbability) {
            this.enterRoom(this.oldroom);
            enemy.wasAttacked = false;
        } else {
            gui_addRoomText("<br>" + text_escapeFailed(enemy) + "<br>");
            this.enemyattack(this.room);
            if (!this.dead)
                this.showFightButtons();
        }
    }

    this.enterRoom = function(room) {

        this.oldroom = this.room;
        this.room = room;
        gui_clearButtons();
        this.freewalking = false;

        this.describeRoom(room);

        if (!dungeon.room[room].content) {
            this.showNavigationButtons(room);
        } else {
            switch(dungeon.room[room].content.type) {
                case "item":
                    var d_a = new Object();
                    d_a.label="Hebe " + dungeon.room[room].content.name + " auf.";
                    d_a.onClick = function() { p.pickup(room); }
                    d_a.tooltip=dungeon.room[room].content.getTooltip();
                    gui_addButton(d_a);
                    this.showNavigationButtons(room);
                    break;
                case "hint":
                    var d_a = new Object();
                    d_a.label="Lese " + dungeon.room[room].content.name;
                    d_a.onClick = function() { p.readHint(room); }
                    gui_addButton(d_a);
                    this.showNavigationButtons(room);
                    break;
                case "stairs":
                    var d_a = new Object();
                    d_a.label = "Betrete nächsten Dungeon";
                    d_a.onClick = function() { save.save(); p.enterNewDungeon(); }
                    gui_addButton(d_a);
/*                    var d_a = new Object();
                    d_a.label = "Speichern";
                    d_a.onClick = function() { save.save(); gui_addRoomText("<br>Der Spielstand wurde gespeichert!"); }
                    gui_addButton(d_a);*/
                    this.showNavigationButtons(room);
                    break;
                case "deadenemy":
                    this.showNavigationButtons(room);
                    gui_addRoomText("Hier ruht " + nom[dungeon.room[room].content.gender] + " '"+dungeon.room[room].content.name+"'");
                    break;
                case "enemy":
                    this.showFightButtons();
                    if(Math.random() < 0.25) {
                        this.enemyattack(room);
                    } else {
                        gui_addRoomText(text_onEnemyField(dungeon.room[room].content));
                    }
                    break;
            }
        }
    }
    this.tryWalkInDirection = function(direction) {
        if (!this.freewalking || this.dead)
            return;

        thisroom = dungeon.room[this.room]
        for (var i=0; i < thisroom.neighbors.length; i++) {
            neigh = dungeon.room[thisroom.neighbors[i]]
            if (direction == "right" && thisroom.x-neigh.x == -1 && thisroom.y-neigh.y == 0)
                this.enterRoom(thisroom.neighbors[i])
            if (direction == "left" && thisroom.x-neigh.x == 1 && thisroom.y-neigh.y == 0)
                this.enterRoom(thisroom.neighbors[i])
            if (direction == "up" && thisroom.x-neigh.x == 0 && thisroom.y-neigh.y == 1)
                this.enterRoom(thisroom.neighbors[i])
            if (direction == "down" && thisroom.x-neigh.x == 0 && thisroom.y-neigh.y == -1)
                this.enterRoom(thisroom.neighbors[i])
        }
    }

    this.tryPickFight = function() {
        if (!dungeon.room[this.room].content || this.dead) {
            return;
        }
        switch(dungeon.room[this.room].content.type) {
            case "enemy":
                p.fight();
                break;
            case "item":
                p.pickup(this.room);
                break;
            case "hint":
                p.readHint(this.room);
                break;
            case "stairs":
                save.save();
                p.enterNewDungeon();
                break;
        }
    }

    this.tryescape = function() {
        if(!dungeon.room[this.room].content)
            return;
        if(dungeon.room[this.room].content.type=="enemy")
            this.escape();
    }

    this.save = function(save_game) {
        save_game.putValue("p.hp", this.hp);
        save_game.putValue("p.maxhp", this.max_hp);
        save_game.putValue("p.atk", this.atk);
        save_game.putValue("p.def", this.def);
        save_game.putValue("p.ke", this.killedEnemies);
        save_game.putValue("p.w", this.weapon?1:0);
        save_game.putValue("p.j", this.jewel?1:0);
        save_game.putValue("p.a", this.armor?1:0);
        if(this.weapon) {
            saveItem(save_game, this.weapon, "p.w.");
        }
        if(this.jewel) {
            saveItem(save_game, this.jewel, "p.j.");
        }
        if(this.armor) {
            saveItem(save_game, this.armor, "p.a.");
        }
    }

    this.load = function(save_game) {
        this.hp = save_game.getInt("p.hp");
        this.max_hp = save_game.getInt("p.maxhp");
        this.atk = save_game.getInt("p.atk");
        this.def = save_game.getInt("p.def");
        this.killedEnemies = save_game.getInt("p.ke");
        this.weapon=null;
        this.jewel=null;
        this.armor=null;
        if(save_game.getBool("p.w")) {
            this.weapon = loadItem(save_game, "p.w.");
            gui_viewItem(this.weapon);
        }
        if(save_game.getBool("p.j")) {
            this.jewel = loadItem(save_game, "p.j.");
            gui_viewItem(this.jewel);
        }
        if(save_game.getBool("p.a")) {
            this.armor = loadItem(save_game, "p.a.");
            gui_viewItem(this.armor);
        }
        gui_setHealth(this.hp, this.max_hp);
    }
}

var p = null;
