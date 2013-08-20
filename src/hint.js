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

function RoomContentHint(name, gender, room, info_room, hint_status)
{
    this.type = "hint"
    this.name = name;
    this.gender = gender;
    this.room = room;
    this.info_room = info_room;
    this.hint_status = hint_status;
    this.getHint = function()
    {
        if(this.info_room == -1) {
            var ro = Math.floor(Math.random() * dungeon.room.length);
            var fail = 0;
            while ((this.hint_status.used_rooms.indexOf(ro) != -1
                    || dungeon.room[ro].known
                    || dungeon.room[ro].content == null)
                && fail < 50)
            {
                ro = Math.floor(Math.random() * dungeon.room.length);
                fail++;
            }
            this.hint_status.used_rooms[this.hint_status.used_rooms.length] = ro;
            this.info_room = ro;
        }
        if (dungeon.room[this.info_room].content == null)
            return "Raum " + this.info_room + " ist leer.";
        else
            return "In Raum " + this.info_room + " befindet sich '" + dungeon.room[this.info_room].content.name + "'.";
    }
    this.getDescriptionAsNeighbor = function() {
        return "";
    }
    this.unveilMap = function() {
        guiViewRoom(this.info_room)
    }
}

function ConnectionHint(name, gender, room)
{
    this.type = "hint"
    this.name = name;
    this.gender = gender;
    this.room = room;
    this.info_room = -1;

    this.getHint = function()
    {
        if (this.info_room == -1) {
            for (var i = 0; i < dungeon.room.length; i++) {
                if (!dungeon.room[i].known) {
                    this.info_room = i;
                    i = dungeon.room.length;
                }
            }
            // handle if all rooms are known
            if (this.info_room == -1)
                this.info_room = 0;
        }

        return "Raum " + this.info_room + " ist verbunden mit den Räumen " + dungeon.room[this.info_room].neighbors + ".";
    }

    this.unveilMap = function() {
        var thisroom = dungeon.room[this.info_room];
        thisroom.known = true;
        gui_unveilMap(thisroom.x, thisroom.y);
        for (var i=0; i < dungeon.room[this.info_room].neighbors.length;i++) {
            var neigh = dungeon.room[dungeon.room[this.info_room].neighbors[i]];
            neigh.known = true;
            gui_unveilMap(neigh.x, neigh.y);
        }
    }

    this.getDescriptionAsNeighbor = function() {
        return "";
    }
}

CONTENT_MONSTER = 1;
CONTENT_ITEM    = 2;
CONTENT_HINT    = 3;

function ContentHint(name, gender, room, hinttype)
{
    this.type = "hint"
    this.name = name;
    this.gender = gender;
    this.room = room;
    this.hinttype = hinttype;
    this.getHint = function()
    {
        if (hinttype == CONTENT_MONSTER) {
            if (dungeon.enemies != 1)
                return "Auf dieser Ebene des Dungeons befinden sich " + dungeon.enemies + " feindselige Kreaturen.";
            else
                return "Auf dieser Ebene des Dungeons lauert eine feinselige Kreatur.";
        }
        if (hinttype == CONTENT_ITEM) {
            if (dungeon.items != 1)
                return "Auf dieser Ebene des Dungeons befinden sich " + dungeon.items + " nützliche Gegenstände.";
            else
                return "Auf dieser Ebene des Dungeons gibt es einen nützlichen Gegenstand zu finden.";
        }
        if (hinttype == CONTENT_HINT) {
            if (dungeon.hints != 1)
                return "Auf dieser Ebene des Dungeons befinden sich " + dungeon.hints + " Hinweise der Erbauer.";
            else
                return "Auf dieser Ebene des Dungeons gibt es keine weiteren Hinweise zu finden.";
        }
        return "Es scheint, die Erbauer dieser Welt haben einen Fehler begangen, deshalb bekommst du hier keinen nützlichen Tipp."
    }
    this.getDescriptionAsNeighbor = function() {
        return "";
    }
    this.unveilMap = function() {
    }
}

function HintStatus() {

    this.used_rooms = [];
    this.enemy_hints = false;
    this.item_hints = false;
    this.hint_hints = false;
}

function createHint(room, hint_status) {
    names=[["Steintafel", "f"],
    ["Schriftrolle", "f"],
    ["Buch", "n" ],
    ["Skript", "n" ],
    ["Papierfetzen", "m" ],
    ["Notiz", "f"],
    ["Dokument", "n" ],
    ["Tafel", "f" ],
    ["Tablet-Computer zB. aus dem Hause Apple", "m" ],
    ["Zeitung von Gestern", "f"]];
    var name_gen = names[Math.floor(Math.random() * names.length)]
    name = name_gen[0];
    gender = name_gen[1];
    var r = Math.random();

    if (r < 0.2) {
        if (!hint_status.enemy_hints) {
            hint_status.enemy_hints = true;
            return new ContentHint(name, gender, room, CONTENT_MONSTER);
        }
        if (!hint_status.item_hints) {
            hint_status.item_hints = true;
            return new ContentHint(name, gender, room, CONTENT_ITEM);
        }
        if (!hint_status.hint_hints) {
            hint_status.hint_hints = true;
            return new ContentHint(name, gender, room, CONTENT_HINT);
        }
    }

    if (r < 0.8) {
        return new RoomContentHint(name, gender, room, -1, hint_status);
    }

    return new ConnectionHint(name, gender, room);
}
