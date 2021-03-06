"use strict";

var Attribute = ["GES","STÄ","ZÄH","WAH","WIL","CHA"];

// nicht dieselbe Reihenfolge
var Attributsstartwerte = [17,16,15,12,11,10];

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
var Steigerung = function(count,Kreis,index) {
  var arr = [];
  for (var i = 0; i < count; i++) {
    arr[i] = 0;
  }
  for (var i = 1; i < Kreis; i++) {
    if (i%6==5) {
      continue;
    }
    arr[(i-1) % count]++;
  }
  return arr[index];
};

var Attributswert = function(count,Kreis,index) {
  var wert = Attributsstartwerte[index];
  if (index<count) {
    wert += Steigerung(count,Kreis,index);
  }
  return wert;
};

var Stufe= function(wert) {
  return Math.floor((wert-1)/3+2);
};

var Gegner_Grundwert = 1;
var Gegner_Steigerungsbasis = 1;
var Gegner_Steigung = 1;
var Gegner_Delta_Ini = 0;
var Gegner_Delta_kWsk = 2;
var Gegner_Delta_mWsk = -1;
var Gegner_Delta_sWsk = -2;
var Gegner_Delta_kRüstung = -3;
var Gegner_Delta_mRüstung = -5;


var Gegner = function(Kreis) {
  var grundwert = Gegner_Grundwert + Gegner_Steigung * Kreis + Math.pow(Gegner_Steigerungsbasis,Kreis);
  return {
    Ini: Math.max(1,grundwert+Gegner_Delta_Ini),
    Wsk: {
      kWsk: Math.max(1,grundwert+Gegner_Delta_kWsk),
      mWsk: Math.max(1,grundwert+Gegner_Delta_mWsk),
      sWsk: Math.max(1,grundwert+Gegner_Delta_sWsk),
    },
    Rüstung: {
      kWsk: Math.max(0,grundwert+Gegner_Delta_kRüstung),
      mWsk: Math.max(0,grundwert+Gegner_Delta_mRüstung)
    }
  };
};

var Character = function(Disziplin,Kreis,RundenVorbereitung) {
  var t = {};
  t.Kreis = Kreis;
  t.RundenVorbereitung = RundenVorbereitung;
  t.Disziplin = Disziplin;
  _.union(Disziplin.Attribute,_.difference(["GES","STÄ","ZÄH","WAH","WIL","CHA"],Disziplin.Attribute)).forEach(function(key,i){
    t[key+"Wert"]=Attributswert(Disziplin.Attribute.length,Kreis,i);
    t[key]=Stufe(Attributswert(Disziplin.Attribute.length,Kreis,i));
  });
  t.Waffe = Disziplin.Waffe + Math.floor(Kreis/2);
  t.GrundKarma = 4;
  t.Rang = Kreis+1;
  var gegner = Gegner(Kreis);
  t.GegnerIni = gegner.Ini;
  t.GegnerWsk = {};
  t.GegnerWsk[kWsk] = gegner.Wsk.kWsk;
  t.GegnerWsk[mWsk] = gegner.Wsk.mWsk;
  t.GegnerWsk[sWsk] = gegner.Wsk.sWsk;
  t.GegnerRüstung = {};
  t.GegnerRüstung[kWsk] = gegner.Rüstung.kWsk;
  t.GegnerRüstung[mWsk] = gegner.Rüstung.mWsk;
  t.get = function get(propName) {
    return funValue(this[propName],this);
  };
  return t;
};

function createChar(disziplin,Kreis,kombo,rundenVorbereitung) {
  return _.extend({},Character(disziplin,Kreis,rundenVorbereitung),kombo);
}
