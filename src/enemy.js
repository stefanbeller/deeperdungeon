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

function Enemy(name, gender, room, hp, atk, def, hp_bonus, atk_bonus, def_bonus, descriptionText)
{
    this.type = "enemy"
    this.name = name;
    this.gender = gender;
    this.room = room;
    this.hp = hp;
    this.max_hp = hp;
    this.atk = atk;
    this.def = def;
    this.hp_bonus = hp_bonus;
    this.atk_bonus = atk_bonus;
    this.def_bonus = def_bonus;
    this.descriptionText = descriptionText;
    this.getDescriptionAsNeighbor = function() {
        return this.descriptionText;
    }
    this.getHealthDescription = function() {
        var messages = ["dem Tod nahe", "stark verwundet", "angeschlagen", "leidend", "verwundet", "heiter", "ziemlich gesund", "gesund", "quietschfidel", "kerngesund"];
        var s = messages[Math.floor(messages.length * this.hp/this.max_hp)]
        if (s)
            return nom[this.gender].capitalize() + " <b class='monster'>" + this.name + "</b> ist " + s + ".";
        else
            return "(Gesundheitsangabe nicht verfügbar, Datenschutz und so...)"
    }
}

function EnemyModifier(name, hp, atk, def, hp_bonus, atk_bonus, def_bonus)
{
    this.name = name;
    this.hp = hp;
    this.atk = atk;
    this.def = def;
    this.hp_bonus = hp_bonus;
    this.atk_bonus = atk_bonus;
    this.def_bonus = def_bonus;
}


function createEnemy(room) {
    //"Garbath the Weak"

    var enemyLst1 = [
        //                                                          hp, atk,def,hp+,atk+,def+
        new Enemy("Affe", "m", room,                                 4,  4,  4,  1,  1,  0,  "Du bemerkst einen stechenden Geruch."),
        new Enemy("Goblin", "m", room,                               3,  4,  4,  2,  0,  1,  "Du nimmst ein Augenfunkeln wahr."),
        new Enemy("Kobold", "m", room,                               5,  3,  4,  2,  0,  0,  "Es klimpert im Dunkeln."),
        new Enemy("Maatsjunge", "m", room,                           5,  4,  1,  1,  1,  0,  "\"Eine Seefahrt die ist lustig, eine Seefahrt...\" was ist das für Gesang?"),
        new Enemy("Stuhl", "m", room,                                3,  2,  5,  0,  0,  0,  "In der Nähe wäre ein guter Platz zum Rasten."),
        new Enemy("Wurm", "m", room,                                 3,  1,  1,  1,  0,  0,  "Du entdeckst Schleim auf dem Boden."),
        new Enemy("Toaster", "m", room,                              4,  4,  4,  1,  0,  0,  "Mhh... Riecht es gut hier!"),
        new Enemy("Wanderer", "m", room,                             3,  4,  3,  0,  1,  0,  "Stille Schritte sind hörbar."),
        new Enemy("Ochse", "m", room,                                6,  1,  3,  2,  0,  1,  "Hier stinkts nach Mist."),
        new Enemy("Greis", "m", room,                                5,  2,  3,  2,  0,  1,  "Der Geruch vom alten Fleisch liegt in der Luft."),
        new Enemy("Tollpatsch", "m", room,                           4,  3,  3,  1,  2,  0,  "Laute Geräusche sind hörbar. Bumms! Ist da was auf den Boden gefallen?"),
        new Enemy("Tintenfisch", "m", room,                          3,  4,  5,  2,  0,  0,  "Es ist ein nasser und kalter Ort."),
        new Enemy("Frosch", "m", room,                               3,  3,  3,  0,  0,  1,  "Es ist ein nasser und kalter Ort. Quack!"),
        new Enemy("Topfpflanze", "f", room,                          5,  1,  1,  1,  0,  0,  "Es riecht sehr angenehm.")
    ];

    var enemyLst2 = [
        //                                                          hp,atk,def,hp+,atk+,def+
        new Enemy("Gorilla", "m", room,                              5,  6,  5,  1,  0,  1,  "Der fade Duft alter Bananen steigt dir die Nase hoch."),
        new Enemy("Shamane", "m", room,                              6,  8,  5,  0,  1,  1,  "Toter Tiergeruch ist wahrzunehmen."),
        new Enemy("Zauberer", "m", room,                             3,  8,  5,  1,  1,  0,  "Ein offensichtlich magischer Ort."),
        new Enemy("Stier", "m", room,                                7,  6,  5,  0,  1,  0,  "Sind das eben Hufenschläge gewesen?"),
        new Enemy("Tisch", "m", room,                                7,  2,  10, 4,  0,  0,  "In der Nähe wär ein guter Platz zum Rasten."),
        new Enemy("Lendenwurm", "m", room,                           5,  5,  5,  0,  1,  0,  "Du entdeckst Schleim auf dem Boden."),
        new Enemy("Kühlschrank", "m", room,                         15,  3,  4,  7,  0,  0,  "Mhh.. Riecht es gut hier!"),
        new Enemy("Reitender Bote", "m", room,                        7,  5,  3,  0,  1,  0,  "Stille Trapser sind hörbar."),
        new Enemy("Frechdachs", "m", room,                           4,  5,  3,  3,  1,  0,  "Stille Trapser sind hörbar."),
        new Enemy("Kanibale", "m", room,                             5,  4,  4,  0,  1,  1,  "Hier riechts nach totem Menschenfleisch."),
        new Enemy("Philosoph", "m", room,                            5,  3,  5,  1,  0,  1,  "Hier liegen ja ganz viele Bücher."),
        new Enemy("Fettsack", "m", room,                             5,  3,  6,  0,  1,  0,  "Schwere Trapser sind hörbar."),
        new Enemy("Moosmann", "m", room,                            10,  1,  7,  0,  1,  0,  "Die Wände sind nass und der Boden weich."),
        new Enemy("Dryade", "f", room,                              10,  4,  4,  1,  0,  0,  "Laub raschelt."),
        new Enemy("Taube", "f", room,                                5,  4,  3,  2,  3,  0,  "Gur gur gur.")
    ];

    var enemyLst3 = [
        //                                                          hp,atk,def,hp+,atk+,def+
        new Enemy("Drache", "m", room,                              18,  5,  8,  5,  1,  1,  "Hier riechts nach verbrannten Leichen"),
        new Enemy("Flaschengeist", "m", room,                       10,  7,  3,  3,  1,  1,  "Ein Funkeln im Dunkeln."),
        new Enemy("Metzger", "m", room,                             10,  7,  3,  3,  1,  1,  "Der Geruch vom toten Fleisch liegt in der Luft."),
        new Enemy("Halbgott", "m", room,                            10, 10, 10,  1,  1,  1,  "Du spürst eine höhre Macht."),
        new Enemy("Schwarzer Magier", "m", room,                    7,  14,  8,  1,  3,  1,  "Dieser Ort ist verhext."),
        new Enemy("Wirt", "m", room,                                10,  7,  8,  1,  1,  4,  "Ein Gestank frischer Kotze schwebt in der Luft."),
        new Enemy("Paladin", "m", room,                             8,   9,  5,  1,  1,  4,  "Dies scheint ein edler Ort zu sein."),
        new Enemy("Hufschmied", "m", room,                          10,  7,  8,  2,  2,  1,  "Du vernimmst lautes Gehämmer."),
        new Enemy("Spartaner", "m", room,                           9,  10,  8,  1,  1,  3,  "Man sieht jemanden rasten."),
        new Enemy("Wikinger", "m", room,                            9,  10,  8,  1,  2,  2,  "Man sieht jemanden rasten."),
        new Enemy("Merkator", "m", room,                            7,   7, 10,  3,  2,  1,  "Hier klimpert Gold."),
        new Enemy("Gladiator", "m", room,                           10, 12,  8,  3,  1,  2,  "Hier klimpern Schwerter."),
        new Enemy("Schakal", "m", room,                             10, 10,  8,  3,  3,  3,  "Toter Tiergeruch ist wahrzunehmen."),
        new Enemy("Rauhe Else", "f", room,                          7, 10,  5,   2,  3,  3,  "Es riecht nach Fisch und Meerwasser."),
        new Enemy("Mumie", "f", room,                               5, 9,  12,   1,  2,  3,  "Modrige Luft weht dir entgegen."),
        new Enemy("Waldgeist", "m", room,                           5,  8,  20,  2,  2,  4,  "Ein kühler Wind umschweift deinen Körper.")
    ];

    var enemyLst4 = [
         new Enemy("Cthulhu", "m", room,                                 8,  13,  13,  2,  4,  4,  "Jetzt wirds noch dunkler."),
         new Enemy("Basilisk", "m", room,                                17,  4,  4,  2,  1,  3,  "Du nimmst ein Augenfunkeln war."),
         new Enemy("Lindwurm", "m", room,                                8,  13,  8,  3,  1,  3,  "Du entdeckst Schleim auf dem Boden."),
         new Enemy("Wolpertinger", "m", room,                            12,  12,  4,  2,  2,  2,  "Was tapsert herum?"),
         new Enemy("Stinthengst", "m", room,                             8,  12,  8,  2,  2,  3,  "Es ist ein nasser und kalter Ort."),
         new Enemy("Ghul", "m", room,                                    3,  17,  3,  2,  3,  4,  "Die Augen eines Dämons starren dich an."),
         new Enemy("Turul", "m", room,                                   7,  12,  14,  1,  2,  2,  "Du bekommst hier ein mulmiges Gefühl."),
         new Enemy("Werwolf", "m", room,                                 11,  5,  2,  2,  1,  1,  "Hier liegen ganz viele Tierhaare herum."),
         new Enemy("Vampir", "m", room,                                  12,  12,  8,  2,  3,  -1,  "Hier riecht es nach Blut."),
         new Enemy("Kraken", "m", room,                                  11,  11,  10,  1,  2,  2,  "Es ist ein nasser und kalter Ort."),
         new Enemy("Kentaur", "m", room,                                 6,  12,  12,  1,  1,  4,  "Lauf! Sonst wird es dich holen!"),
         new Enemy("Imp", "m", room,                                     8,  6,  14,  1,  2,  2,  "Ein teuflischer Ort."),
         new Enemy("Zombie", "m", room,                                  10,  7,  18,  2,  3,  3,  "Du siehst eine Gestalt an menschlichen Gebeinen nagen."),
         new Enemy("Oger", "m", room,                                    11,  8,  12,  2,  2,  1,  "Wer schnarcht hier so laut, dass die Erde erbebt?"),
         new Enemy("Troll", "m", room,                                   10,  12,  8,  1,  1,  1,  "Wer schnarcht hier so laut, dass die Erde erbebt?"),
         new Enemy("Grinch", "m", room,                                  5,  17,  8,  2,  2,  4,  "Eklige Zähne eines hämischen Gegrinses funkeln im Dunkel."),
         new Enemy("Gremlin", "m", room,                                 15,  5,  5,  2,  2,  2,  "Eklige Zähne eines hämischen Gegrinses funkeln im Dunkel."),
         new Enemy("Erzteufel", "m", room,                               10,  13,  8,  2,  2,  0,  "Flammen und Schatten erfüllen die Gänge."),
         new Enemy("Succubus", "f", room,                                10,  12,  12,  2,  4,  2,  "Du verfällst in einen tiefen Tagtraum.")
    ];

    var prefixLst = [
        //                                                    hp,atk,def,hp+,atk+,def+
        new EnemyModifier("Wilde",                             5,  5,  1,  0,  0,  1),
        new EnemyModifier("Dickbäuchige",                      3,  4,  4,  1,  0,  2),
        new EnemyModifier("Schnelle",                          5,  5,  0,  2,  0,  1),
        new EnemyModifier("Tanzende",                          6,  6,  2,  0,  1,  1),
        new EnemyModifier("Starrende",                         4,  7,  2,  1,  0,  1),
        new EnemyModifier("Grimmige",                          6,  4,  6,  0,  1,  2),
        new EnemyModifier("Gefürchtete",                       2,  5,  3,  1,  1,  1),
        new EnemyModifier("Feurige",                           3,  4,  3,  1,  0,  2),
        new EnemyModifier("Wütende",                           4,  3,  4,  2,  0,  0),
        new EnemyModifier("Heilende",                          6,  3,  2,  1,  2,  0),
        new EnemyModifier("Stinkende",                         6,  5,  3,  1,  0,  1),
        new EnemyModifier("Riesige",                           5,  4,  5,  1,  0,  1),
        new EnemyModifier("Ekelhafte",                         3,  5,  2,  2,  1,  2),
        new EnemyModifier("Epische",                           4,  6,  4,  1,  1,  1),
        new EnemyModifier("Durchsichtige",                     3,  6,  5,  2,  0,  1),
        new EnemyModifier("Feuerspuckende",                    3,  6,  -1,  1,  1, 2),
        new EnemyModifier("Antarktische",                      6,  3,  2,  1,  0,  0),
        new EnemyModifier("Untote",                            3,  4,  7,  1,  1,  1),
        new EnemyModifier("Irre",                              2,  7, -2,  0,  1,  1),
        new EnemyModifier("Elektrische",                       2,  5, -1,  1,  2,  1),
        new EnemyModifier("Fiese",                            -1,  6,  2,  1,  1,  0),
        new EnemyModifier("Dreckige",                          1,  4,  1,  1,  1,  1)

    ];

    var suffixLst = [
        //                                                    hp,atk,def,hp+,atk+,def+
        new EnemyModifier("mit zwei Gabeln",                    6,  7,  3,  2,  0,  0),
        new EnemyModifier("oben ohne",                          11,  6, -3,  0,  1,  0),
        new EnemyModifier("ohne Furcht",                        9,  7,  3,  1,  0,  0),
        new EnemyModifier("auf einer Schnecke reitend",         8,  3,  5,  0,  0,  1),
        new EnemyModifier("der dich verflucht",                 8,  6,  4,  1,  2,  1),
        new EnemyModifier("der dich besudelt",                  1,  12,  8,  1,  0,  0),
        new EnemyModifier("mit scharfen Zähnen",                5,  5,  10,  0,  1,  0),
        new EnemyModifier("mit einem riesigen Korkenzieher",    4,  9,  6,  3,  0,  0),
        new EnemyModifier("mit einer Taube auf dem Kopf",      -1,  5,  14,  1,  1,  0),
        new EnemyModifier("der Grausamkeit",                   -1,  13, -1,  1,  1,  0),
        new EnemyModifier("auf einem bärtigen Einhorn",         5,  6,  8,  1,  2,  1),
        new EnemyModifier("mit einer goldenen Klobürste",      -1,  12, -4,  0,  0,  2),
        new EnemyModifier("wirbelt Staub auf und blendet dich", 5,  8,  9,  1,  0,  2),
        new EnemyModifier("schnell wie Blitz",                  8,  3,  7,  2,  0,  2),
        new EnemyModifier("mit Nunchucks",                      8,  7,  1,  1,  1,  1),
        new EnemyModifier("mit einem Krümelmonster",            10,  1,  3,  3,  0,  0),
        new EnemyModifier("mit einem verwirrenden Blick",      -1,  8,  3,  1,  0,  1),
        new EnemyModifier("der Verdammnis",                     5,  8,  2,  1,  0,  1),
        new EnemyModifier("ohne besondere Fähigkeiten",         0,  0,  0,  0,  2,  2)
    ];

    var bossEnemyLst = [
         new Enemy("Zepar - Der rote Ritter", "m", room,                           33,  32,  22,  15,  5,  5,  "Die Wände färben sich blutrot."),
         new Enemy("Valefor - Der Herzog der Diebe", "m", room,                    35,  153,  25,  45,  7,  10,  "Du verlierst deine Strümpfe."),
         new Enemy("Furfur - Die Gräfin des Krieges", "f", room,                   25,  35,  21, 10,  2,  2,  "Die Erde erbebt. Dich umweht ein starker Wind."),
         new Enemy("Orobas - Der Prinz der Hölle", "m", room,                      41,  22,  15,  20,  5,  10,  "Um hier weiterzukommen musst du durchs Feuer gehen."),
         new Enemy("Eligor - Der Großherzog des Totenreichs", "m", room,           37,  32,  20,  25,  10,  10,  "Ein intensiver Leichengeruch macht dich Krank."),
         new Enemy("Lucifer - Der Bringer des Lichts", "m", room,                  40,  35,  40,  25,  25,  25,  "Angst durchstreift deine Glieder.")

    ];

    var enemy;
    var prefix;
    var suffix;

    if (dungeon.level >= 0 && dungeon.level <= 16) {
        enemy = enemyLst1[Math.floor(enemyLst1.length * Math.random())]
    } else if (dungeon.level > 17 && dungeon.level <= 33) {
        enemy = enemyLst2[Math.floor(enemyLst2.length * Math.random())]
    } else if (dungeon.level > 34 && dungeon.level <= 50) {
        enemy = enemyLst3[Math.floor(enemyLst3.length * Math.random())]
    } else if (dungeon.level > 51 && dungeon.level <= 67) {
        enemy = enemyLst4[Math.floor(enemyLst4.length * Math.random())]
    } else if (dungeon.level == 17) {
        enemy = bossEnemyLst[0]
    } else if (dungeon.level == 34) {
        enemy = bossEnemyLst[1]
    } else if (dungeon.level == 51) {
        enemy = bossEnemyLst[2]
    } else if (dungeon.level == 68) {
        enemy = bossEnemyLst[3]
    } else if (dungeon.level == 69) {
        enemy = bossEnemyLst[4]
    } else if (dungeon.level == 70) {
        enemy = bossEnemyLst[5]
    }

    if (dungeon.level > 4 && dungeon.level <= 8 || dungeon.level > 12 && dungeon.level <= 16 || dungeon.level > 21 && dungeon.level <= 22 || dungeon.level > 27 && dungeon.level <= 33 || dungeon.level > 38 && dungeon.level <= 42 || dungeon.level > 46 && dungeon.level <= 50 || dungeon.level > 55 && dungeon.level <= 59 || dungeon.level > 63 && dungeon.level <= 67){
        prefix = prefixLst[Math.floor(prefixLst.length * Math.random())]
        if (enemy.gender == "m")
            enemy.name = prefix.name + "r " + enemy.name;
        else
            enemy.name = prefix.name + " " + enemy.name;

        enemy.hp += prefix.hp;
        enemy.max_hp += prefix.hp;
        enemy.atk += prefix.atk;
        enemy.def += prefix.def;
        enemy.hp_bonus += prefix.hp_bonus;
        enemy.atk_bonus += prefix.atk_bonus;
        enemy.def_bonus += prefix.def_bonus;
    }

    if (dungeon.level > 8 && dungeon.level <= 16 || dungeon.level > 25 && dungeon.level <= 33 || dungeon.level > 42 && dungeon.level <= 50 || dungeon.level > 59 && dungeon.level <= 67){
        suffix = suffixLst[Math.floor(suffixLst.length * Math.random())]
        enemy.name = enemy.name + " " + suffix.name;
        enemy.hp += suffix.hp;
        enemy.max_hp += suffix.hp;
        enemy.atk += suffix.atk;
        enemy.def += suffix.def;
        enemy.hp_bonus += suffix.hp_bonus;
        enemy.atk_bonus += suffix.atk_bonus;
        enemy.def_bonus += suffix.def_bonus;
    }
    if (dungeon.level >= 0 && dungeon.level <= 17){
    	enemy.hp += dungeon.level*0.5;
    	enemy.atk += dungeon.level*0.8;
    	enemy.def += dungeon.level*0.4;
    } else if (dungeon.level >= 18 && dungeon.level <= 34){
    	enemy.hp += dungeon.level*0.4;
    	enemy.atk += dungeon.level*10;
    	enemy.def += dungeon.level*0.3;
    } else if (dungeon.level >= 35 && dungeon.level <= 51){
        enemy.hp *= dungeon.level/12;
        enemy.max_hp *= dungeon.level/12;
        enemy.atk *= dungeon.level/2;
        enemy.def *= dungeon.level/25;
        enemy.hp_bonus *= dungeon.level/25;
        enemy.atk_bonus *= dungeon.level/35;
        enemy.def_bonus *= dungeon.level/35;
    } else if (dungeon.level >= 52 && dungeon.level <= 70){
        enemy.hp *= dungeon.level/12;
        enemy.max_hp *= dungeon.level/12;
        enemy.atk *= dungeon.level/4;
        enemy.def *= dungeon.level/25;
        enemy.hp_bonus *= dungeon.level/25;
        enemy.atk_bonus *= dungeon.level/35;
        enemy.def_bonus *= dungeon.level/35;
    }

    enemy.hp_bonus = Math.floor(enemy.hp_bonus);
    enemy.atk_bonus = Math.floor(enemy.atk_bonus);
    enemy.def_bonus = Math.floor(enemy.def_bonus);


    return enemy;
}


