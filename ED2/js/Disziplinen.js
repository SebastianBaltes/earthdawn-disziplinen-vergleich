"use strict";

var probe = function(stufe, mindestwurf) {
  //  return function(x) {
  //    var v = funValue(stufe,x);
  //    return (1+v-Math.floor(v)) * Dices(Stufen[Math.floor(v)]).probabilityToReach(funValue(mindestwurf,x));
  //  };
  return function(x) {
    return probability(funValue(stufe, x), funValue(mindestwurf, x));
  };
  //    return div(stufe, mul(2, mindestwurf));
};

var MaximaleVorbereitungsRunden = 3;
var kWsk = "kWsk";
var mWsk = "mWsk";
var sWsk = "sWsk";

// hilfsvariablen
var p = val('p');
var r = val('r');
var k = val('k');

// Werte
var GES = val("GES");
var STÄ = val("STÄ");
var WAH = val("WAH");
var WIL = val("WIL");
var Rang = val("Rang");
var Waffe = val("Waffe");
var GrundKarma = val("GrundKarma");
var Karma = val("Karma");
var KarmaVerbrauch = val("KarmaVerbrauch");
var Ini = val("Ini");
var Kreis = val("Kreis");
var KomboKreis = val("KomboKreis");
var GegnerIni = val("GegnerIni");
var Art = val("Art");
var Stufe = val("Stufe");
var Schaden = val("Schaden");
var Treffer = val("Treffer");
var Wiederholungen = val("Wiederholungen");
var Überanstrengung = val("Überanstrengung");
var GegnerWsk = property(val("GegnerWsk"), Art);
var GegnerMwsk = property(val("GegnerWsk"), mWsk);
var GegnerRüstung = property(val("GegnerRüstung"), Art);
var MixturKreis = val("MixturKreis");
var Fäden = val("Fäden");
var Webschwierigkeit = val("Webschwierigkeit");
var RundenVorbereitung = val("RundenVorbereitung");
var RundenWirkung = val("RundenWirkung");
var maximaleAngriffe = val("maximaleAngriffe");
var Min2xIni = probe(Ini, mul(2, GegnerIni));
var MinIni = probe(Ini, GegnerIni);
var MinWsk = probe(Stufe, GegnerWsk);
var MinFadenweben = min(1, probe(add(WAH, Rang, Karma), Webschwierigkeit));
var MinZauberWsk = mul(MinFadenweben, probe(Stufe, GegnerWsk));
var KampfsinnRang = mul(probe(add(Rang, WAH), GegnerMwsk), MinIni, Rang);
var KampfsinnKarmaRang = mul(probe(add(Rang, WAH, Karma), GegnerMwsk), MinIni, Rang);
var Fehlschlag = val("Fehlschlag");
var AlchmFehlschlag = mul(0.05, sub(3, min(3, sub(Kreis, MixturKreis))));
var AlchmTreffer = sub(1, AlchmFehlschlag);
var KarmaVerbrauchSchütze = min(15, Rang);
var AnzahlRundenAngriffAlsAktion = val("AnzahlRundenAngriffAlsAktion");
var FolgeRundenAngriffAutomatisch = val("FolgeRundenAngriffAutomatisch");
var AngriffNurErsteRunde = val("AngriffNurErsteRunde");

// kann maximaleAngriffe Angriffe ausführen, bricht allerdings ab, sobald ein Angriff fehlschlägt
// Summenformel für n Treffer q als Wahrscheinlichkeit [0,1[ (ist für 1 nicht definiert, daher max 1-e) :
// q^1+q^2+...+q^n = q-q^(n+1) / (1-q)
var q = min(0.999999999, MinWsk);
var WiederholungenBisAngriffFehlschlägt = div(div(sub(q, pow(q, add(maximaleAngriffe, 1))), sub(1, q)), Treffer);

//y = 0.0260111023x2 - 0.4160983347x + 1.236439334
// Treffer 0.5 => 1 x Rüstung
// Treffer 1 => 0.9 x Rüstung
// Treffer 2, also in 0.5 aller Fälle durch => 0.5 x Rüstung
// Treffer 4 => 0 x Rüstung
var DurchtrefffaktorAufRüstung = max(0, min(1, add(mul(0.0260111023, GegnerRüstung, GegnerRüstung), mul(-0.4160983347, GegnerRüstung),
    1.236439334)));

var StandardSchadenEinzelrunde = sub(mul(Wiederholungen, min(1, Treffer), max(0, sub(mul(Schaden, max(1, min(3,
    FolgeRundenAngriffAutomatisch))), mul(GegnerRüstung, DurchtrefffaktorAufRüstung)))), mul(AlchmFehlschlag, Schaden));

var StandardSchadenProRunde = div(StandardSchadenEinzelrunde, add(max(0, sub(Fäden, sub(AnzahlRundenAngriffAlsAktion, 1))), 1));

var SchadenProRundeSum = sub(sumOver("Angriffe.SchadenProRunde"), add(Überanstrengung));
var SchadenEinzelrundeSum = sub(sumOver("Angriffe.SchadenEinzelrunde"), add(Überanstrengung));

var Disziplinen = [

    ///////////////////////////////////////////////////////////////////////
    {
      Name : "Tiermeister",
      Attribute : [
          "GES", "STÄ"
      ],
      Kombos : [
          {
            Karma : GrundKarma,
            KomboKreis : 1,
            Kombo : "Krallenhand",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            RundenVorbereitung : 0,
            Überanstrengung : 0,
            KarmaVerbrauch : 1,
            Angriffe : [
              {
                Art : kWsk,
                Stufe : add(GES, Rang),
                Schaden : add(Rang, STÄ, 3, Karma),
                Treffer : MinWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fehlschlag : 0,
                Fäden : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 6,
            Kombo : "Krallenhand+Froschsprung",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            RundenVorbereitung : 0,
            Überanstrengung : 0,
            KarmaVerbrauch : 1,
            Angriffe : [
              {
                Art : kWsk,
                Stufe : add(GES, Rang),
                Schaden : add(Rang, STÄ, 3, Karma, Rang),
                Treffer : MinWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fehlschlag : 0,
                Fäden : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 7,
            Kombo : "Blutige Krallen+Krallenhand+Froschsprung",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            RundenVorbereitung : 0,
            // maximale Angriffe, kann Rang nehmen, aber will maximal 8 Angriffe = unter Verwundungsschwelle
            maximaleAngriffe : max(Rang, 8),
            Überanstrengung : maximaleAngriffe,
            KarmaVerbrauch : 1,
            Angriffe : [
              {
                Art : kWsk,
                Stufe : add(GES, Rang, Karma),
                Schaden : add(Rang, STÄ, 3, Karma, Rang),
                Treffer : MinWsk,
                Wiederholungen : WiederholungenBisAngriffFehlschlägt,
                SchadenProRunde : StandardSchadenProRunde,
                Fehlschlag : 0,
                Fäden : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          },
      
      ]
    },

    ///////////////////////////////////////////////////////////////////////
    
    {
      Name : "Geisterbeschwörer",
      Attribute : [
          "WAH", "WIL"
      ],
      Kombos : [
          {
            Karma : GrundKarma,
            KomboKreis : 1,
            Kombo : "Geisterhand",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            Fäden : 0,
            Webschwierigkeit : 0,
            RundenVorbereitung : Fäden,
            Überanstrengung : 0,
            KarmaVerbrauch : 1,
            Angriffe : [
              {
                Art : mWsk,
                Stufe : add(WAH, Rang, Karma),
                Schaden : add(WIL, 6),
                Treffer : MinZauberWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fehlschlag : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          },
          // Willensstärke ab Kreis 4
          {
            Karma : GrundKarma,
            KomboKreis : 4,
            Kombo : "Geisterhand+Willensstärke",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            Fäden : 0,
            Webschwierigkeit : 0,
            RundenVorbereitung : Fäden,
            Überanstrengung : 0,
            KarmaVerbrauch : 1,
            Angriffe : [
              {
                Art : mWsk,
                Stufe : add(WAH, Rang, Karma),
                Schaden : add(WIL, Rang, 6),
                Treffer : MinZauberWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fehlschlag : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          },
          // Erweiterte Matrix ab Kreis 6
          {
            Karma : GrundKarma,
            KomboKreis : 6,
            Kombo : "Knochenbrecher",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            Fäden : 1,
            Webschwierigkeit : 0,
            RundenVorbereitung : Fäden,
            Überanstrengung : 0,
            KarmaVerbrauch : 1,
            Angriffe : [
              {
                Art : mWsk,
                Stufe : add(WAH, Rang, Karma),
                // maximal 3 - fachen Schaden gegen ein einzelnes Ziel
                // oder war das einzelangriff?
                Schaden : mul(3, add(WIL, Rang, 8)),
                Treffer : MinZauberWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fehlschlag : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          },
      
      ]
    },

    ///////////////////////////////////////////////////////////////////////
    
    {
      Name : "Schütze",
      Attribute : [
          "WAH", "STÄ", "GES", "WIL"
      ],
      Waffe : 5,
      Kombos : [
          {
            Karma : GrundKarma,
            KomboKreis : 1,
            Kombo : "Blattschuss",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            RundenVorbereitung : 0,
            Überanstrengung : 0,
            KarmaVerbrauch : KarmaVerbrauchSchütze,
            Angriffe : [
              {
                Art : kWsk,
                Stufe : add(WAH, Rang, mul(KarmaVerbrauch, Karma)),
                Schaden : add(Waffe, STÄ),
                Treffer : MinWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fehlschlag : 0,
                Fäden : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 3,
            Kombo : "Blattschuss+Brandpfeil",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            RundenVorbereitung : 0,
            Überanstrengung : 2,
            KarmaVerbrauch : KarmaVerbrauchSchütze,
            Angriffe : [
              {
                Art : kWsk,
                Stufe : add(WAH, Rang, mul(KarmaVerbrauch, Karma)),
                Schaden : add(Rang, WIL, 3, Karma),
                Treffer : MinWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fehlschlag : 0,
                Fäden : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 4,
            Kombo : "Blattschuss+Brandpfeil+Faden+Kampfsinn",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            RundenVorbereitung : 0,
            Überanstrengung : 2,
            KarmaVerbrauch : KarmaVerbrauchSchütze,
            Angriffe : [
              {
                Art : kWsk,
                Stufe : add(WAH, Rang, mul(KarmaVerbrauch, Karma), KampfsinnRang),
                Schaden : add(Waffe, Rang, WIL, Karma),
                Treffer : MinWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fehlschlag : 0,
                Fäden : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 7,
            Kombo : "(Blattschuss+Brandpfeil+Faden+Kampfsinn)+(Zweitschuss+Brandpfeil+Faden+Kampfsinn)",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            RundenVorbereitung : 0,
            Überanstrengung : 3,
            KarmaVerbrauch : KarmaVerbrauchSchütze,
            Angriffe : [
                {
                  Art : kWsk,
                  Stufe : add(WAH, Rang, mul(KarmaVerbrauch, Karma), KampfsinnRang),
                  Schaden : add(Waffe, Rang, WIL, Karma),
                  Treffer : MinWsk,
                  SchadenProRunde : StandardSchadenProRunde,
                  Wiederholungen : 1,
                  Fehlschlag : 0,
                  Fäden : 0,
                  AnzahlRundenAngriffAlsAktion : 1,
                  FolgeRundenAngriffAutomatisch : 0,
                }, {
                  Art : kWsk,
                  Stufe : add(GES, Rang, Karma, KampfsinnRang),
                  Schaden : add(Waffe, Rang, WIL, Karma),
                  Treffer : MinWsk,
                  SchadenProRunde : StandardSchadenProRunde,
                  Wiederholungen : 1,
                  Fehlschlag : 0,
                  Fäden : 0,
                  AnzahlRundenAngriffAlsAktion : 1,
                  FolgeRundenAngriffAutomatisch : 0,
                }
            ]
          },
      
      ]
    },

    ///////////////////////////////////////////////////////////////////////
    
    {
      Name : "Elementarist",
      Attribute : [
          "WAH", "WIL", "GES"
      ],
      Kombos : [
          {
            Karma : GrundKarma,
            KomboKreis : 1,
            Kombo : "Breitschwert",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            Fäden : 0,
            Webschwierigkeit : 0,
            RundenVorbereitung : 0,
            Überanstrengung : 0,
            KarmaVerbrauch : 0,
            Waffe : 6,
            Angriffe : [
              {
                Art : kWsk,
                Stufe : GES,
                Schaden : add(STÄ, Waffe),
                Treffer : MinWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fehlschlag : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 1,
            Kombo : "Erdpfeile",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            Fäden : 1,
            Webschwierigkeit : 5,
            RundenVorbereitung : Fäden,
            Überanstrengung : 0,
            KarmaVerbrauch : 2,
            Angriffe : [
              {
                Art : mWsk,
                Stufe : add(WAH, Rang, Karma),
                Schaden : add(WIL, 6),
                Treffer : MinZauberWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fehlschlag : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 3,
            Kombo : "Eisbola",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            Fäden : 0,
            Webschwierigkeit : 0,
            RundenVorbereitung : Fäden,
            Überanstrengung : 0,
            KarmaVerbrauch : 1,
            Angriffe : [
              {
                Art : mWsk,
                Stufe : add(WAH, Rang, Karma),
                Schaden : add(WIL, 5),
                Treffer : MinZauberWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fehlschlag : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          },
          // Willensstärke ab Kreis 5
          {
            Karma : GrundKarma,
            KomboKreis : 5,
            Kombo : "Erdstab",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            Fäden : 1,
            Webschwierigkeit : 11,
            RundenVorbereitung : Fäden,
            Überanstrengung : 0,
            KarmaVerbrauch : 1,
            Angriffe : [
              {
                // Angriff ist körperlich über den Stab mit Geschicklichkeit, für Rang Runden möglich
                Art : kWsk,
                Stufe : GES,
                Schaden : add(STÄ, 10),
                Treffer : MinZauberWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fehlschlag : 0,
                AnzahlRundenAngriffAlsAktion : Rang,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 5,
            Kombo : "Eisbola+Willensstärke",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            Fäden : 0,
            Webschwierigkeit : 0,
            RundenVorbereitung : Fäden,
            Überanstrengung : 0,
            KarmaVerbrauch : 1,
            Angriffe : [
              {
                Art : mWsk,
                Stufe : add(WAH, Rang, Karma),
                Schaden : add(WIL, 5, Rang),
                Treffer : MinZauberWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fehlschlag : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 5,
            Kombo : "Feuerball",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            Fäden : 1,
            Webschwierigkeit : 12,
            RundenVorbereitung : Fäden,
            Überanstrengung : 0,
            KarmaVerbrauch : 1,
            Angriffe : [
              {
                Art : mWsk,
                Stufe : add(WAH, Rang, Karma),
                Schaden : add(WIL, 8, Rang),
                Treffer : MinZauberWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fehlschlag : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 6,
            Kombo : "Querschläger",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            Fäden : min(Rang, evaluate("MaximaleVorbereitungsRunden")),
            Webschwierigkeit : 12,
            RundenVorbereitung : Fäden,
            Überanstrengung : 0,
            KarmaVerbrauch : Fäden,
            maximaleAngriffe : Fäden,
            Angriffe : [
              {
                Art : mWsk,
                Stufe : add(WAH, Rang, Karma),
                Schaden : add(WIL, 12, Rang),
                Treffer : MinWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : WiederholungenBisAngriffFehlschlägt,
                Fehlschlag : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          },
          // Erweiterte Matrix ab kreis 7
          {
            Karma : GrundKarma,
            KomboKreis : 7,
            Kombo : "Erdpfeile erw. Matrix",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            Fäden : 0,
            Webschwierigkeit : 0,
            RundenVorbereitung : Fäden,
            Überanstrengung : 0,
            KarmaVerbrauch : 1,
            Angriffe : [
              {
                Art : mWsk,
                Stufe : add(WAH, Rang, Karma),
                Schaden : add(WIL, 6),
                Treffer : MinZauberWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fehlschlag : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 7,
            Kombo : "Feuerball erw. Matrix",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            Fäden : 0,
            Webschwierigkeit : 0,
            RundenVorbereitung : Fäden,
            Überanstrengung : 0,
            KarmaVerbrauch : 1,
            Angriffe : [
              {
                Art : mWsk,
                Stufe : add(WAH, Rang, Karma),
                Schaden : add(WIL, 8, Rang),
                Treffer : MinZauberWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fehlschlag : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 7,
            Kombo : "Querschläger erw. Matrix",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            Fäden : min(Rang, evaluate("MaximaleVorbereitungsRunden")),
            Webschwierigkeit : 12,
            RundenVorbereitung : Fäden,
            Überanstrengung : 0,
            KarmaVerbrauch : add(1, Fäden),
            maximaleAngriffe : add(1, Fäden),
            Angriffe : [
              {
                Art : mWsk,
                Stufe : add(WAH, Rang, Karma),
                Schaden : add(WIL, 12, Rang),
                Treffer : MinWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : WiederholungenBisAngriffFehlschlägt,
                Fehlschlag : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 7,
            Kombo : "Todesregen",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            Fäden : 0,
            Webschwierigkeit : 0,
            RundenVorbereitung : Fäden,
            Überanstrengung : 0,
            KarmaVerbrauch : 1,
            Angriffe : [
              {
                Art : mWsk,
                Stufe : add(WAH, Rang, Karma),
                // Todesregen dauert mehrere Runden, aber er muss sich konzentrieren
                Schaden : add(WIL, 5, Rang),
                Treffer : MinZauberWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fehlschlag : 0,
                AnzahlRundenAngriffAlsAktion : Rang,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          },
      ]
    },

    ///////////////////////////////////////////////////////////////////////
    
    {
      Name : "Magier",
      Attribute : [
          "WAH", "WIL"
      ],
      Kombos : [
          {
            Karma : GrundKarma,
            KomboKreis : 1,
            Kombo : "mentaler Dolch",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            Fäden : 0,
            Webschwierigkeit : 0,
            RundenVorbereitung : Fäden,
            Überanstrengung : 0,
            KarmaVerbrauch : 1,
            Angriffe : [
              {
                Art : mWsk,
                Stufe : add(WAH, Rang, Karma),
                Schaden : add(WIL, 2),
                Treffer : MinZauberWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fehlschlag : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          },
          // Willensstärke ab Kreis 5
          {
            Karma : GrundKarma,
            KomboKreis : 5,
            Kombo : "Improvisiertes Geschoss",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            Fäden : 1,
            Webschwierigkeit : 9,
            RundenVorbereitung : Fäden,
            Überanstrengung : 0,
            KarmaVerbrauch : 2,
            Angriffe : [
              {
                Art : mWsk,
                Stufe : add(WAH, Rang, Karma),
                Schaden : add(WIL, Rang, 6),
                Treffer : MinZauberWsk,
                // pro Runde ein Angriff möglich für Wirkungsdauer
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fehlschlag : 0,
                AnzahlRundenAngriffAlsAktion : Rang,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          },
          // Erweiterte Matrix ab Kreis 6
          {
            Karma : GrundKarma,
            KomboKreis : 6,
            Kombo : "Geschoss des Grauens",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            Fäden : 2,
            Webschwierigkeit : 0,
            RundenVorbereitung : Fäden,
            Überanstrengung : 0,
            KarmaVerbrauch : 3,
            Angriffe : [
              {
                Art : mWsk,
                Stufe : add(WAH, Rang, Karma),
                Schaden : add(WIL, Rang, 5),
                Treffer : MinZauberWsk,
                // Macht automatisch Schaden pro Runde
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fehlschlag : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : Rang,
              }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 6,
            Kombo : "Zerschmettern",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            Fäden : 1,
            Webschwierigkeit : 11,
            RundenVorbereitung : Fäden,
            Überanstrengung : 0,
            KarmaVerbrauch : 2,
            Angriffe : [
              {
                Art : mWsk,
                Stufe : add(WAH, Rang, Karma),
                Schaden : add(WIL, Rang, 15),
                Treffer : MinZauberWsk,
                // Bonus von 10%, da schon bei "gut" durch
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1.1,
                Fehlschlag : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 7,
            Kombo : "Siedendes Blut",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            Fäden : 2,
            Webschwierigkeit : 12,
            RundenVorbereitung : 2,
            Überanstrengung : 0,
            KarmaVerbrauch : 3,
            Angriffe : [
              {
                Art : mWsk,
                Stufe : add(WAH, Rang, Karma),
                Schaden : add(WIL, Rang, 9),
                Treffer : MinZauberWsk,
                // Der Angriff erfolgt mehrere Runden lang (Rang?)
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fehlschlag : 0,
                AnzahlRundenAngriffAlsAktion : Rang,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 8,
            Kombo : "Zerquetschen",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            Fäden : 2,
            Webschwierigkeit : 15,
            RundenVorbereitung : Fäden,
            Überanstrengung : 0,
            KarmaVerbrauch : 3,
            Angriffe : [
              {
                Art : mWsk,
                Stufe : add(WAH, Rang, Karma),
                Schaden : add(WIL, Rang, 10),
                Treffer : MinZauberWsk,
                // Macht automatisch Schaden pro Runde
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 2,
                Fehlschlag : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : Rang,
              }
            ]
          },
      ]
    },

    ///////////////////////////////////////////////////////////////////////
    
    {
      Name : "Alchemist",
      Attribute : [
          "GES", "STÄ", "WAH"
      ],
      Kombos : [
          {
            Karma : GrundKarma,
            KomboKreis : 1,
            MixturKreis : 1,
            Kombo : "Brandkiesel",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            Überanstrengung : 0,
            KarmaVerbrauch : 1,
            Fehlschlag : AlchmFehlschlag,
            AlchmTreffer : AlchmTreffer,
            Angriffe : [
              {
                Art : kWsk,
                Stufe : mul(AlchmTreffer, add(GES, Rang, Karma)),
                Schaden : 10,
                Treffer : MinWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fäden : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 2,
            MixturKreis : 1,
            Kombo : "Brandkiesel,Mixturmagie",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            Überanstrengung : 0,
            KarmaVerbrauch : 1,
            Fehlschlag : AlchmFehlschlag,
            AlchmTreffer : AlchmTreffer,
            Angriffe : [
              {
                Art : kWsk,
                Stufe : mul(AlchmTreffer, add(GES, Rang, Karma)),
                Schaden : add(10, Rang),
                Treffer : MinWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fäden : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 4,
            MixturKreis : 4,
            Kombo : "Splitterbombe,Mixturmagie",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            Überanstrengung : 0,
            KarmaVerbrauch : 1,
            Fehlschlag : AlchmFehlschlag,
            AlchmTreffer : AlchmTreffer,
            Angriffe : [
              {
                Art : kWsk,
                Stufe : mul(AlchmTreffer, add(GES, Rang, Karma)),
                Schaden : add(11, Rang),
                Treffer : MinWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fäden : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 5,
            MixturKreis : 5,
            Kombo : "Königswasser,Mixturmagie",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            Überanstrengung : 0,
            KarmaVerbrauch : 2,
            Fehlschlag : AlchmFehlschlag,
            AlchmTreffer : AlchmTreffer,
            Angriffe : [
              {
                Art : kWsk,
                Stufe : mul(AlchmTreffer, add(GES, Rang, Karma)),
                Schaden : add(14, Rang, Karma),
                Treffer : MinWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fäden : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                // bei aussergewöhnlich Rang Runden Schaden? 
                FolgeRundenAngriffAutomatisch : 0.5,
              }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 5,
            MixturKreis : 5,
            Kombo : "Königswasser,Kampfsaft,Mixturmagie",
            Ini : add(GES, 3),
            SchadenProRundeSum : SchadenProRundeSum,
            Überanstrengung : 0,
            KarmaVerbrauch : 2,
            RundenVorbereitung : 1,
            RundenWirkung : Rang,
            Fehlschlag : AlchmFehlschlag,
            AlchmTreffer : AlchmTreffer,
            Angriffe : [
              {
                Art : kWsk,
                Stufe : mul(AlchmTreffer, AlchmTreffer, add(GES, Rang, Karma, 3)),
                Schaden : add(14, Rang, 3, Karma),
                Treffer : MinWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fäden : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                // bei aussergewöhnlich Rang Runden Schaden? 
                FolgeRundenAngriffAutomatisch : 0.5,
              }
            ]
          }, {
            Karma : add(GrundKarma, 2),
            KomboKreis : 7,
            MixturKreis : 5,
            Kombo : "Königswasser,Kampfsaft,Passionshonig,Mixturmagie",
            Ini : add(GES, 3),
            SchadenProRundeSum : SchadenProRundeSum,
            Überanstrengung : 0,
            KarmaVerbrauch : 2,
            RundenVorbereitung : 2,
            RundenWirkung : Rang,
            Fehlschlag : AlchmFehlschlag,
            AlchmTreffer : AlchmTreffer,
            Angriffe : [
              {
                Art : kWsk,
                Stufe : mul(AlchmTreffer, AlchmTreffer, add(GES, Rang, Karma, 3)),
                Schaden : add(14, Rang, 3, Karma),
                Treffer : MinWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fäden : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                // bei aussergewöhnlich Rang Runden Schaden? 
                FolgeRundenAngriffAutomatisch : 0.5,
              }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 8,
            MixturKreis : 8,
            Kombo : "Alkahest,Mixturmagie",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            Überanstrengung : 0,
            KarmaVerbrauch : 2,
            Fehlschlag : AlchmFehlschlag,
            AlchmTreffer : AlchmTreffer,
            Angriffe : [
              {
                Art : kWsk,
                Stufe : mul(AlchmTreffer, add(GES, Rang, Karma)),
                Schaden : add(20, Rang, Karma),
                Treffer : MinWsk,
                // wirkt bei einem Direkttreffer Rang Runden, daher ca. 1.3 mal
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1.3,
                Fäden : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                // bei aussergewöhnlich Rang Runden Schaden? 
                FolgeRundenAngriffAutomatisch : 0.5,
              }
            ]
          }, {
            Karma : add(GrundKarma, 2),
            KomboKreis : 8,
            MixturKreis : 8,
            Kombo : "Alkahest,Kampfsaft,Passionshonig,Mixturmagie",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            RundenVorbereitung : 2,
            RundenWirkung : Rang,
            Überanstrengung : 0,
            KarmaVerbrauch : 2,
            Fehlschlag : AlchmFehlschlag,
            AlchmTreffer : AlchmTreffer,
            Angriffe : [
              {
                Art : kWsk,
                Stufe : mul(AlchmTreffer, AlchmTreffer, add(GES, Rang, Karma, 3)),
                Schaden : add(20, Rang, 3, Karma),
                Treffer : MinWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1.3,
                Fäden : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                // bei aussergewöhnlich Rang Runden Schaden? 
                FolgeRundenAngriffAutomatisch : 0.5,
              }
            ]
          }
      
      ]
    },

    ///////////////////////////////////////////////////////////////////////
    
    {
      Name : "Krieger",
      Attribute : [
          "GES", "STÄ", "WAH"
      ],
      Waffe : 7,
      Kombos : [
          {
            Karma : GrundKarma,
            KomboKreis : 1,
            Kombo : "Lufttanz,Nahkampfwaffen",
            Ini : add(Rang, GES),
            SchadenProRundeSum : SchadenProRundeSum,
            Überanstrengung : 1,
            KarmaVerbrauch : 2,
            Angriffe : [
                {
                  Art : kWsk,
                  Stufe : add(GES, Rang, Karma),
                  Schaden : add(STÄ, Waffe),
                  Treffer : MinWsk,
                  SchadenProRunde : StandardSchadenProRunde,
                }, {
                  Art : kWsk,
                  Stufe : add(GES, Rang, Karma),
                  Schaden : add(STÄ, Waffe),
                  Treffer : mul(Min2xIni, MinWsk),
                  SchadenProRunde : StandardSchadenProRunde,
                  Wiederholungen : 1,
                  Fäden : 0,
                  Fehlschlag : AlchmFehlschlag,
                  AnzahlRundenAngriffAlsAktion : 1,
                  FolgeRundenAngriffAutomatisch : 0,
                }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 1,
            Kombo : "Kampfsinn,Nahkampfwaffen",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            Überanstrengung : 1,
            KarmaVerbrauch : 1,
            Angriffe : [
              {
                Art : kWsk,
                Stufe : add(GES, Rang, KampfsinnKarmaRang, Karma),
                Schaden : add(STÄ, Waffe),
                Treffer : MinWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fäden : 0,
                Fehlschlag : AlchmFehlschlag,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 3,
            Kombo : "Tigersprung,Kampfsinn,Nahkampfwaffen",
            Ini : add(Rang, GES),
            SchadenProRundeSum : SchadenProRundeSum,
            Überanstrengung : 2,
            KarmaVerbrauch : 1,
            Angriffe : [
              {
                Art : kWsk,
                Stufe : add(GES, Rang, KampfsinnKarmaRang, Karma),
                Schaden : add(STÄ, Waffe),
                Treffer : MinWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fäden : 0,
                Fehlschlag : AlchmFehlschlag,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 3,
            Kombo : "Tigersprung,Lufttanz,Nahkampfwaffen",
            Ini : add(Rang, Rang, GES),
            SchadenProRundeSum : SchadenProRundeSum,
            Überanstrengung : 2,
            KarmaVerbrauch : 2,
            Angriffe : [
                {
                  Art : kWsk,
                  Stufe : add(GES, Rang, Karma),
                  Schaden : add(STÄ, Waffe),
                  Treffer : MinWsk,
                  SchadenProRunde : StandardSchadenProRunde,
                  Wiederholungen : 1,
                  Fäden : 0,
                  Fehlschlag : AlchmFehlschlag,
                  AnzahlRundenAngriffAlsAktion : 1,
                  FolgeRundenAngriffAutomatisch : 0,
                }, {
                  Art : kWsk,
                  Stufe : add(GES, Rang, Karma),
                  Schaden : add(STÄ, Waffe),
                  Treffer : mul(Min2xIni, MinWsk),
                  SchadenProRunde : StandardSchadenProRunde,
                  Wiederholungen : 1,
                  Fäden : 0,
                  Fehlschlag : AlchmFehlschlag,
                  AnzahlRundenAngriffAlsAktion : 1,
                  FolgeRundenAngriffAutomatisch : 0,
                }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 4,
            Kombo : "Tigersprung,Kampfsinn,Nahkampfwaffen,Schmetterschlag",
            Ini : add(Rang, GES),
            SchadenProRundeSum : SchadenProRundeSum,
            Überanstrengung : 3,
            KarmaVerbrauch : 3,
            Angriffe : [
              {
                Art : kWsk,
                Stufe : add(GES, Rang, KampfsinnKarmaRang, Karma),
                Schaden : add(STÄ, div(add(Rang, 3, Karma), 4), Waffe),
                Treffer : MinWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fäden : 0,
                Fehlschlag : AlchmFehlschlag,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 4,
            Kombo : "Tigersprung,Lufttanz,Nahkampfwaffen,Schmetterschlag",
            Ini : add(Rang, Rang, GES),
            SchadenProRundeSum : SchadenProRundeSum,
            Überanstrengung : 4,
            KarmaVerbrauch : 4,
            Angriffe : [
                {
                  Art : kWsk,
                  Stufe : add(GES, Rang, Karma),
                  Schaden : add(STÄ, div(add(Rang, 3, Karma), 4), Waffe),
                  Treffer : MinWsk,
                  SchadenProRunde : StandardSchadenProRunde,
                  Wiederholungen : 1,
                  Fäden : 0,
                  Fehlschlag : AlchmFehlschlag,
                  AnzahlRundenAngriffAlsAktion : 1,
                  FolgeRundenAngriffAutomatisch : 0,
                }, {
                  Art : kWsk,
                  Stufe : add(GES, Rang, Karma),
                  Schaden : add(STÄ, div(add(Rang, 3, Karma), 4), Waffe),
                  Treffer : mul(Min2xIni, MinWsk),
                  SchadenProRunde : StandardSchadenProRunde,
                  Wiederholungen : 1,
                  Fäden : 0,
                  Fehlschlag : AlchmFehlschlag,
                  AnzahlRundenAngriffAlsAktion : 1,
                  FolgeRundenAngriffAutomatisch : 0,
                }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 5,
            Kombo : "Tigersprung,Kampfsinn,Nahkampfwaffen,Schmetterschlag,Luftgleiten,Nachtreten",
            Ini : add(Rang, GES),
            SchadenProRundeSum : SchadenProRundeSum,
            Überanstrengung : 5,
            KarmaVerbrauch : 5,
            Angriffe : [
                {
                  Art : kWsk,
                  Stufe : add(GES, Rang, KampfsinnKarmaRang, Karma),
                  Schaden : add(STÄ, div(add(Rang, 3, Karma), 2), Waffe),
                  Treffer : MinWsk,
                  SchadenProRunde : StandardSchadenProRunde,
                  Wiederholungen : 1,
                  Fäden : 0,
                  Fehlschlag : AlchmFehlschlag,
                  AnzahlRundenAngriffAlsAktion : 1,
                  FolgeRundenAngriffAutomatisch : 0,
                }, {
                  Art : kWsk,
                  Stufe : add(GES, Rang, Karma),
                  Schaden : STÄ,
                  Treffer : MinWsk,
                  SchadenProRunde : StandardSchadenProRunde,
                  Wiederholungen : 1,
                  Fäden : 0,
                  Fehlschlag : AlchmFehlschlag,
                  AnzahlRundenAngriffAlsAktion : 1,
                  FolgeRundenAngriffAutomatisch : 0,
                }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 5,
            Kombo : "Tigersprung,Lufttanz,Nahkampfwaffen,Schmetterschlag,Luftgleiten,Nachtreten",
            Ini : add(Rang, Rang, GES),
            SchadenProRundeSum : SchadenProRundeSum,
            Überanstrengung : 5,
            KarmaVerbrauch : 5,
            Angriffe : [
                {
                  Art : kWsk,
                  Stufe : add(GES, Rang, Karma),
                  Schaden : add(STÄ, div(add(Rang, 3, Karma), 2), Waffe),
                  Treffer : MinWsk,
                  SchadenProRunde : StandardSchadenProRunde,
                  Wiederholungen : 1,
                  Fäden : 0,
                  Fehlschlag : AlchmFehlschlag,
                  AnzahlRundenAngriffAlsAktion : 1,
                  FolgeRundenAngriffAutomatisch : 0,
                }, {
                  Art : kWsk,
                  Stufe : add(GES, Rang, Karma),
                  Schaden : add(STÄ, div(add(Rang, 3, Karma), 2), Waffe),
                  Treffer : mul(Min2xIni, MinWsk),
                  SchadenProRunde : StandardSchadenProRunde,
                  Wiederholungen : 1,
                  Fäden : 0,
                  Fehlschlag : AlchmFehlschlag,
                  AnzahlRundenAngriffAlsAktion : 1,
                  FolgeRundenAngriffAutomatisch : 0,
                }, {
                  Art : kWsk,
                  Stufe : add(GES, Rang, Karma),
                  Schaden : STÄ,
                  Treffer : MinWsk,
                  SchadenProRunde : StandardSchadenProRunde,
                  Wiederholungen : 1,
                  Fäden : 0,
                  Fehlschlag : AlchmFehlschlag,
                  AnzahlRundenAngriffAlsAktion : 1,
                  FolgeRundenAngriffAutomatisch : 0,
                }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 7,
            Kombo : "Tigersprung,Kampfsinn,Nahkampfwaffen,Schmetterschlag,Luftgleiten,Zweiter Angriff,Nachtreten",
            Ini : add(Rang, GES),
            SchadenProRundeSum : SchadenProRundeSum,
            Überanstrengung : 5,
            KarmaVerbrauch : 5,
            Angriffe : [
                {
                  Art : kWsk,
                  Stufe : add(GES, Rang, Karma, KampfsinnKarmaRang),
                  Schaden : add(STÄ, div(add(Rang, 3, Karma), 2), Waffe),
                  Treffer : MinWsk,
                  SchadenProRunde : StandardSchadenProRunde,
                  Wiederholungen : 1,
                  Fäden : 0,
                  Fehlschlag : AlchmFehlschlag,
                  AnzahlRundenAngriffAlsAktion : 1,
                  FolgeRundenAngriffAutomatisch : 0,
                }, {
                  Art : kWsk,
                  Stufe : add(GES, Rang, KampfsinnKarmaRang),
                  Schaden : add(STÄ, div(add(Rang, 3, Karma), 2), Waffe),
                  Treffer : MinWsk,
                  SchadenProRunde : StandardSchadenProRunde,
                  Wiederholungen : 1,
                  Fäden : 0,
                  Fehlschlag : AlchmFehlschlag,
                  AnzahlRundenAngriffAlsAktion : 1,
                  FolgeRundenAngriffAutomatisch : 0,
                }, {
                  Art : kWsk,
                  Stufe : add(GES, Rang, Karma, KampfsinnKarmaRang),
                  Schaden : STÄ,
                  Treffer : MinWsk,
                  SchadenProRunde : StandardSchadenProRunde,
                  Wiederholungen : 1,
                  Fäden : 0,
                  Fehlschlag : AlchmFehlschlag,
                  AnzahlRundenAngriffAlsAktion : 1,
                  FolgeRundenAngriffAutomatisch : 0,
                }
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 8,
            Kombo : "Kobrastoss,Kampfsinn,Nahkampfwaffen,Schmetterschlag,Luftgleiten,Zweiter Angriff,Nachtreten",
            Ini : add(Rang, GES, Karma),
            SchadenProRundeSum : SchadenProRundeSum,
            Überanstrengung : 5,
            KarmaVerbrauch : 5,
            AngriffNurErsteRunde : true,
            Angriffe : [
                {
                  Art : kWsk,
                  Stufe : add(GES, Rang, Rang, Karma, KampfsinnKarmaRang),
                  Schaden : add(STÄ, div(add(Rang, 3, Karma), 2), Waffe),
                  Treffer : MinWsk,
                  SchadenProRunde : StandardSchadenProRunde,
                  Wiederholungen : 1,
                  Fäden : 0,
                  Fehlschlag : AlchmFehlschlag,
                  AnzahlRundenAngriffAlsAktion : 1,
                  FolgeRundenAngriffAutomatisch : 0,
                }, {
                  Art : kWsk,
                  Stufe : add(GES, Rang, Rang, KampfsinnKarmaRang),
                  Schaden : add(STÄ, div(add(Rang, 3, Karma), 2), Waffe),
                  Treffer : MinWsk,
                  SchadenProRunde : StandardSchadenProRunde,
                  Wiederholungen : 1,
                  Fäden : 0,
                  Fehlschlag : AlchmFehlschlag,
                  AnzahlRundenAngriffAlsAktion : 1,
                  FolgeRundenAngriffAutomatisch : 0,
                }, {
                  Art : kWsk,
                  Stufe : add(GES, Rang, Rang, Karma, KampfsinnKarmaRang),
                  Schaden : STÄ,
                  Treffer : MinWsk,
                  SchadenProRunde : StandardSchadenProRunde,
                  Wiederholungen : 1,
                  Fäden : 0,
                  Fehlschlag : AlchmFehlschlag,
                  AnzahlRundenAngriffAlsAktion : 1,
                  FolgeRundenAngriffAutomatisch : 0,
                }
            ]
          }
      ]
    },

    ///////////////////////////////////////////////////////////////////////
    
    {
      Name : "Luftpirat",
      Attribute : [
          "GES", "STÄ"
      ],
      Waffe : 7,
      Kombos : [
          {
            // Frage - wie Kampfgebrüll (-Rang auf alle Proben des Gegners?)
            Karma : GrundKarma,
            KomboKreis : 1,
            Kombo : "Nahkampfwaffen",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            RundenVorbereitung : 0,
            Überanstrengung : 0,
            KarmaVerbrauch : 1,
            Angriffe : [
              {
                Art : kWsk,
                Stufe : add(GES, Rang, Karma),
                Schaden : add(STÄ, Waffe),
                Treffer : MinWsk,
                SchadenProRunde : StandardSchadenProRunde,
                Wiederholungen : 1,
                Fehlschlag : 0,
                Fäden : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }
            ]
          // wie Schildangriff? Niederschlagsprobe Gegner -7...
          }, {
            Karma : GrundKarma,
            KomboKreis : 5,
            Kombo : "Nahkampfwaffen+Nachtreten",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            RundenVorbereitung : 0,
            Überanstrengung : 0,
            KarmaVerbrauch : 1,
            Angriffe : [
              {
                Art : kWsk,
                Stufe : add(GES, Rang, Karma),
                Schaden : add(STÄ, Waffe),
                Treffer : MinWsk,
                Wiederholungen : 1,
                SchadenProRunde : StandardSchadenProRunde,
                Fehlschlag : 0,
                Fäden : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              },
              {
                Art : kWsk,
                Stufe : add(GES, Rang),
                Schaden : add(STÄ),
                Treffer : MinWsk,
                Wiederholungen : 1,
                SchadenProRunde : StandardSchadenProRunde,
                Fehlschlag : 0,
                Fäden : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }              
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 6,
            Kombo : "Nahkampfwaffen+Schwungvoller Angriff+Nachtreten",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            RundenVorbereitung : 0,
            Überanstrengung : 1,
            KarmaVerbrauch : 1,
            Angriffe : [
              {
                Art : kWsk,
                Stufe : add(GES, Rang, Karma),
                Schaden : add(STÄ, Waffe),
                Treffer : MinWsk,
                // bei aussergewöhnlich noch mal angreifen
                Wiederholungen : 1.1,
                SchadenProRunde : StandardSchadenProRunde,
                Fehlschlag : 0,
                Fäden : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              },
              {
                Art : kWsk,
                Stufe : add(GES, Rang),
                Schaden : add(STÄ),
                Treffer : MinWsk,
                Wiederholungen : 1,
                SchadenProRunde : StandardSchadenProRunde,
                Fehlschlag : 0,
                Fäden : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }              
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 7,
            Kombo : "Nahkampfwaffen+Schwungvoller Angriff+Nachtreten",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            RundenVorbereitung : 0,
            Überanstrengung : 1,
            KarmaVerbrauch : 2,
            Angriffe : [
              {
                Art : kWsk,
                Stufe : add(GES, Rang, Karma),
                Schaden : add(STÄ, Waffe, Karma),
                Treffer : MinWsk,
                // bei aussergewöhnlich noch mal angreifen
                Wiederholungen : 1.1,
                SchadenProRunde : StandardSchadenProRunde,
                Fehlschlag : 0,
                Fäden : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              },
              {
                Art : kWsk,
                Stufe : add(GES, Rang),
                Schaden : add(STÄ),
                Treffer : MinWsk,
                Wiederholungen : 1,
                SchadenProRunde : StandardSchadenProRunde,
                Fehlschlag : 0,
                Fäden : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }              
            ]
          }, {
            Karma : GrundKarma,
            KomboKreis : 8,
            Kombo : "Nahkampfwaffen+Schwungvoller Angriff+Hammerschlag+Nachtreten mit Hammerschlag",
            Ini : GES,
            SchadenProRundeSum : SchadenProRundeSum,
            RundenVorbereitung : 0,
            Überanstrengung : 1,
            KarmaVerbrauch : 3,
            Angriffe : [
              {
                Art : kWsk,
                Stufe : add(GES, Rang, Karma),
                // bei Kampfgebrüll / Schlachtruf Erfolg +3, sonst +0. Da sozial meist schwach => +2.3
                Schaden : add(STÄ, Rang, Waffe, Karma, 2.3),
                Treffer : MinWsk,
                // bei aussergewöhnlich noch mal angreifen
                Wiederholungen : 1.1,
                SchadenProRunde : StandardSchadenProRunde,
                Fehlschlag : 0,
                Fäden : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              },
              {
                Art : kWsk,
                Stufe : add(GES, Rang),
                // kann man Hammerschlag auf Nachtreten nehmen?
                Schaden : add(STÄ, Rang, Karma, 2.3),
                Treffer : MinWsk,
                Wiederholungen : 1,
                SchadenProRunde : StandardSchadenProRunde,
                Fehlschlag : 0,
                Fäden : 0,
                AnzahlRundenAngriffAlsAktion : 1,
                FolgeRundenAngriffAutomatisch : 0,
              }              
            ]
          },
      
      ]
    },
];
