"use strict";

window.Attribute = ["GES", "STÄ", "ZÄH", "WAH", "WIL", "CHA"];

// nicht dieselbe Reihenfolge
window.Attributsstartwerte = [17, 16, 15, 12, 11, 10];

//0 1 2
//-----
//0 0 0    1
//1 0 0    2
//1 1 0    3
//1 1 1    4
//2 1 1    5
//2 2 1    6
//2 2 2
//3 2 2 
//3 3 2
//3 3 3
var Steigerung = function (count, Kreis, index) {
    var arr = [];
    for (var i = 0; i < count; i++) {
        arr[i] = 0;
    }
    for (var i = 1; i < Kreis; i++) {
        if (i % 6 == 5) {
            continue;
        }
        arr[(i - 1) % count]++;
    }
    return arr[index];
};

var Attributswert = function (count, Kreis, index) {
    var wert = Attributsstartwerte[index];
    if (index < count) {
        wert += Steigerung(count, Kreis, index);
    }
    return wert;
};

var Stufe = function (wert) {
    return Math.floor((wert - 1) / 3 + 2);
};

function GetPropOrVal(char, propName) {
    if (char[propName] !== 'undefined') {
        return char[propName];
    }
    return window[propName];
}

var Character = function (Disziplin, Kreis, RundenVorlauf) {
    var t = _.extend({}, Disziplin);
    t.Kreis = Kreis;
    t.RundenVorlauf = RundenVorlauf;
    t.Disziplin = Disziplin;
    _.union(Disziplin.Attribute, _.difference(["GES", "STÄ", "ZÄH", "WAH", "WIL", "CHA"], Disziplin.Attribute)).forEach(function (key, i) {
        t[key + "Wert"] = Attributswert(Disziplin.Attribute.length, Kreis, i);
        t[key] = Stufe(Attributswert(Disziplin.Attribute.length, Kreis, i));
    });
    t.Waffe = Disziplin.Waffe + Math.floor(Kreis / 2);
    t.GrundKarma = 4;
    t.Rang = Kreis + 1;
    var gegner = Gegner(Kreis);
    t.GegnerIni = gegner.Ini;
    t.GegnerWsk = {};
    t.GegnerWsk[kWsk] = gegner.Wsk.kWsk;
    t.GegnerWsk[mWsk] = gegner.Wsk.mWsk;
    t.GegnerWsk[sWsk] = gegner.Wsk.sWsk;
    t.GegnerRüstung = {};
    t.GegnerRüstung[kWsk] = gegner.Rüstung.kWsk;
    t.GegnerRüstung[mWsk] = gegner.Rüstung.mWsk;
    t.GegnerAngriff = gegner.Angriff;
    t.GegnerAnzahl = gegner.Anzahl;
    t.GegnerVerteiltRadius = gegner.verteilt_auf_Radius;
    t.get = function get(propName) {
        return funValue(GetPropOrVal(this, propName), this);
    };
    return t;
};

function flattenInherits(x) {
    if (x == null) {
        return null;
    }
    if (x.inherits != null) {
        const inherits = flattenInherits(x.inherits);
        delete x.inherits;
        _.defaults(x, inherits);
    }
    return x;
}

function createChar(disziplin, Kreis, kombo, rundenVorbereitung) {
    return _.extend({}, Character(flattenInherits(disziplin), Kreis, rundenVorbereitung), flattenInherits(kombo));
}
