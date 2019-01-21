"use strict";

var probe = function (stufe, mindestwurf) {
    //  return function(x) {
    //    var v = funValue(stufe,x);
    //    return (1+v-Math.floor(v)) * Dices(Stufen[Math.floor(v)]).probabilityToReach(funValue(mindestwurf,x));
    //  };
    return function (x) {
        return probability(funValue(stufe, x), funValue(mindestwurf, x));
    };
    //    return div(stufe, mul(2, mindestwurf));
};

window.Max_Runden_Vorbereitung = 3;
window.kWsk = "kWsk";
window.mWsk = "mWsk";
window.sWsk = "sWsk";

// hilfsvariablen
var p = val('p');
var r = val('r');
var k = val('k');

// Werte
window.GES = val("GES");
window.STÄ = val("STÄ");
window.WAH = val("WAH");
window.WIL = val("WIL");
window.Rang = val("Rang");
window.Waffe = val("Waffe");
window.GrundKarma = mul(4,later('Karma_Einsatz'));
window.Karma = val("Karma");
window.KarmaVerbrauch = mul(val("KarmaVerbrauch"),later('Karma_Einsatz'));
window.Ini = val("Ini");
window.Kreis = val("Kreis");
window.KomboKreis = val("KomboKreis");
window.GegnerIni = val("GegnerIni");
window.Art = val("Art");
window.Stufe = val("Stufe");
window.Schaden = val("Schaden");
window.Treffer = val("Treffer");
window.Wiederholungen = val("Wiederholungen");
window.Überanstrengung = val("Überanstrengung");
window.GegnerWsk = property(val("GegnerWsk"), Art);
window.GegnerMwsk = property(val("GegnerWsk"), mWsk);
window.GegnerRüstung = property(val("GegnerRüstung"), Art);
window.MixturKreis = val("MixturKreis");
window.Fäden = val("Fäden");
window.MinFäden = val("MinFäden");
window.ExtraFäden = val("ExtraFäden");
window.Webschwierigkeit = val("Webschwierigkeit");

window.RundenWirkung = val("RundenWirkung");
window.maximaleAngriffe = val("maximaleAngriffe");
window.Min2xIni = probe(Ini, mul(2, GegnerIni));
window.MinIni = probe(Ini, GegnerIni);
window.MinWsk = probe(Stufe, GegnerWsk);
window.MinFadenweben = min(1, probe(add(WAH, Rang, Karma), Webschwierigkeit));
window.MinZauberWsk = mul(MinFadenweben, probe(Stufe, GegnerWsk));
window.KampfsinnRang = mul(probe(add(Rang, WAH), GegnerMwsk), MinIni, Rang);
window.KampfsinnKarmaRang = mul(probe(add(Rang, WAH, Karma), GegnerMwsk), MinIni, Rang);
window.Fehlschlag = val("Fehlschlag");
window.AlchmFehlschlag = mul(0.05, sub(3, min(3, sub(Kreis, MixturKreis))));
window.AlchmTreffer = sub(1, AlchmFehlschlag);
window.AnzahlRundenAngriffAlsAktion = val("AnzahlRundenAngriffAlsAktion");
window.FolgeRundenAngriffAutomatisch = val("FolgeRundenAngriffAutomatisch");
window.AngriffNurErsteRunde = val("AngriffNurErsteRunde");


// RundenVorlaufMin: Minimale Anzahl Runden, die die Kombo an Vorlauf braucht
window.RundenVorlaufMin = val("RundenVorlaufMin");

// RundenVorlaufMax: Maximale Anzahl Runden, die die Kombo an Vorlauf braucht
window.RundenVorlaufMax = val("RundenVorlaufMax");

// RundenVorlauf: Anzahl Runden, die die Kombo an Vorlauf tatsächlich erhält
window.RundenVorlauf = val("RundenVorlauf");

// BenötigteRundenImKampf: Anzahl Runden, die die Kombo im Kampf insgesamt an Vorlauf braucht und wirkt
window.BenötigteRundenImKampf = add(RundenVorlauf,max(RundenWirkung,AnzahlRundenAngriffAlsAktion));


// kann maximaleAngriffe Angriffe ausführen, bricht allerdings ab, sobald ein Angriff fehlschlägt
// Summenformel für n Treffer q als Wahrscheinlichkeit [0,1[ (ist für 1 nicht definiert, daher max 1-e) :
// q^1+q^2+...+q^n = q-q^(n+1) / (1-q)
var q = min(0.999999999, MinWsk);
window.WiederholungenBisAngriffFehlschlägt = div(div(sub(q, pow(q, add(maximaleAngriffe, 1))), sub(1, q)), Treffer);

window.Erfolge = (stufe,mindestwurf) => integrate(1,20,i=>probe(stufe,add(mindestwurf,5*i)));

window.TrefferErfolge = Erfolge(Stufe,GegnerWsk);

window.SchadenMitErfolgen = val('SchadenMitErfolgen');

window.StandardSchadenEinzelrunde =
    sub(
        mul(Wiederholungen,
            min(1, Treffer),
            max(0,
                sub(
                    mul(
                        SchadenMitErfolgen,
                        max(1, min(3, FolgeRundenAngriffAutomatisch))
                    ),
                    GegnerRüstung
                )
            )
        ),
        mul(Fehlschlag, Schaden)
    );

window.StandardSchadenProRunde = div( StandardSchadenEinzelrunde, BenötigteRundenImKampf );

window.SchadenProRundeSum = sub(sumOver("Angriffe.SchadenProRunde"), add(Überanstrengung));
window.SchadenEinzelrundeSum = sub(sumOver("Angriffe.SchadenEinzelrunde"), add(Überanstrengung));

window.WillensstärkeKreis = val('WillensstärkeKreis');
window.Willensstärke = add(WIL,Rang,Karma);
window.FixKarmaVerbrauch = val('FixKarmaVerbrauch');

var ifKreis = (kreis,thenPart,elsePart) => (x) => funValue(kreis,x)<=x.Kreis ? thenPart : elsePart;

window.WILS = val('WILS');

// TODO die Fäden müssen ja auch geschafft werden.... also Webschwierigkeit einbeziehen!
window.ErweiterteFäden = val('ErweiterteFäden');
window.StandardFäden = add(RundenVorlauf,ErweiterteFäden);
window.ExtraFäden = max(0,sub(Fäden,MinFäden));
window.StandardFädenVorlaufMin = max(0,sub(MinFäden,ErweiterteFäden));
window.StandardFädenVorlaufMax = 20;

var DefaultCharacter = {
    ErweiterteFäden: 0,
    WillensstärkeKreis: 1000,
    WILS: ifKreis(WillensstärkeKreis,Willensstärke,WIL),
    Karma: GrundKarma,
    Ini: GES,
    Zauberer: false,
    Waffe: 4,
};

var DefaultZauberer = {
    inherits: DefaultCharacter,
    Zauberer: true,
    WillensstärkeKreis: 6,
    ErweiterteFäden: ()=>x=>x.Disziplin.Zauberer ? [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0].reduce((acc,v,index)=>acc+(index<x.Kreis?v:0),0) : 0,
}

var DefaultKombo = {
    Ini: GES,
    Überanstrengung: 0,
    Karma: GrundKarma,
    KarmaVerbrauch: 0,
    RundenVorlaufMin: 0,
    RundenVorlaufMax: 0,
    MinFäden: 0,
    Fäden: 0,
    Webschwierigkeit: 0,
    SchadenEinzelrundeSum: SchadenEinzelrundeSum,
    SchadenProRundeSum: SchadenProRundeSum,
}

var ZauberKombo = {
    inherits: DefaultKombo,
    KarmaVerbrauch: add(FixKarmaVerbrauch, Fäden),
    RundenVorlaufMin: StandardFädenVorlaufMin,
    RundenVorlaufMax: StandardFädenVorlaufMax,
    Fäden: StandardFäden,
    FixKarmaVerbrauch: 1,
}

var DefaultAngriff = {
    SchadenEinzelrunde: StandardSchadenEinzelrunde,
    SchadenProRunde: StandardSchadenProRunde,
    Erfolge: TrefferErfolge,
    SchadenMitErfolgen: add( Schaden, mul(Erfolge,2) ),
    Wiederholungen: 1,
    Fehlschlag: 0,
    AnzahlRundenAngriffAlsAktion: 1,
    FolgeRundenAngriffAutomatisch: 0,
};

var Disziplinen = [

    // Es werden die besten Talentoptionen für Angriff + Schaden gewählt, jeweils mit maximalem Karma und
    // nur gegen einen Einzelgegner. Immobilität oder reine Wunden werden nicht berücksichtigt, weil man das nicht
    // so einfach auf "Schaden", den hier relevanten Vergleichswert, runterrechnen kann (für einen echten Kampf
    // ist gerade Immobilität natürlich extrem mächtig). Auch Mali auf den Gegner wie durch Verspotten werden
    // nicht voll angerechnet.

    // ///////////////////////////////////////////////////////////////////////
    {
        Name: "Elementarist",
        Color: "rgb(0, 0, 255)",
        Attribute: [
            "WAH", "WIL", "GES"
        ],
        inherits: DefaultZauberer,
        // Talente:

        // Spruchzauberei (1) 0Ü
        // Erweiterte Matrix (5) -1 Faden
        // Willenstärke (6) 1Ü

        // Zauber:
        // Erdpfeile (1) 1F, phys, Wirkung: WIL+3 + 2/Erfolg + 2/Faden
        // Flammenwaffe (1) 0F, phys, Wirkung: Waffe+4+2/Faden


        Kombos: [
            {
                KomboKreis: 1,
                Kombo: "Kampfstab + Flammenwaffe",
                inherits: ZauberKombo,
                Webschwierigkeit: 5,
                MinFäden: 0,
                FixKarmaVerbrauch: 1,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: GES,
                        Schaden: add(STÄ, Waffe, 4, mul(ExtraFäden,2)),
                        Treffer: MinWsk,
                    }
                ]
            },

            {
                KomboKreis: 1,
                Kombo: "Erdpfeile",
                inherits: ZauberKombo,
                Webschwierigkeit: 5,
                MinFäden: 0,
                FixKarmaVerbrauch: 1,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(WAH, Rang, Karma),
                        // 1 Runden -2 auf Rüstung => als 0.5 zus. Schaden verrechnet
                        Schaden: add(WILS, 3, mul(ExtraFäden,2), 0.5),
                        Treffer: MinZauberWsk,
                    }
                ]
            },

            {
                KomboKreis: 3,
                Kombo: "Blitzschlag",
                inherits: ZauberKombo,
                Webschwierigkeit: 7,
                MinFäden: 1,
                FixKarmaVerbrauch: 1,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(WAH, Rang, Karma),
                        Schaden: add(WILS, 6, mul(ExtraFäden,2)),
                        Treffer: MinZauberWsk,
                    }
                ]
            },
            {
                KomboKreis: 3,
                Kombo: "Eisbola",
                inherits: ZauberKombo,
                Webschwierigkeit: 7,
                MinFäden: 0,
                FixKarmaVerbrauch: 1,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(WAH, Rang, Karma),
                        Schaden: add(WILS, 2, mul(ExtraFäden,2)),
                        Treffer: MinZauberWsk,
                    }
                ]
            },
            {
                KomboKreis: 4,
                Kombo: "Schneesturm",
                inherits: ZauberKombo,
                Webschwierigkeit: 8,
                MinFäden: 2,
                FixKarmaVerbrauch: 1,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(WAH, Rang, Karma),
                        Schaden: add(WILS, 2, mul(ExtraFäden,2)),
                        Treffer: MinZauberWsk,
                        FolgeRundenAngriffAutomatisch: Rang,
                    }
                ]
            },
            {
                KomboKreis: 4,
                Kombo: "Speer des Feuers",
                inherits: ZauberKombo,
                Webschwierigkeit: 8,
                MinFäden: 1,
                FixKarmaVerbrauch: 1,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(WAH, Rang, Karma),
                        Schaden: add(WILS, 4, mul(ExtraFäden,2), mul(Erfolge,2), 4),
                        Treffer: MinZauberWsk,
                    }
                ]
            },
            {
                KomboKreis: 5,
                Kombo: "Erdstab + Flammenwaffe",
                inherits: ZauberKombo,
                Webschwierigkeit: 9,
                MinFäden: 1,
                FixKarmaVerbrauch: 2,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: GES,
                        Schaden: add(STÄ, 4, 4, mul(ExtraFäden,4)),
                        Treffer: MinWsk,
                        Erfolge: add(Erfolge,1),
                    }
                ]
            },
            {
                KomboKreis: 5,
                Kombo: "Erdstab + Speer des Feuers",
                inherits: ZauberKombo,
                Webschwierigkeit: 9,
                MinFäden: 2,
                FixKarmaVerbrauch: 2,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(WAH, Rang, Karma),
                        Schaden: add(WILS, 4, mul(ExtraFäden,2), mul(Erfolge,2), 4),
                        Treffer: MinZauberWsk,
                        Erfolge: add(Erfolge,1),
                    }
                ]
            },
            {
                KomboKreis: 5,
                Kombo: "Feuerball",
                inherits: ZauberKombo,
                Webschwierigkeit: 9,
                MinFäden: 1,
                FixKarmaVerbrauch: 1,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(WAH, Rang, Karma),
                        Schaden: add(WILS, 4, mul(ExtraFäden,2), mul(Erfolge,2)),
                        Treffer: MinZauberWsk,
                    }
                ]
            },

            // {
            //     Karma: GrundKarma,
            //     KomboKreis: 1,
            //     Kombo: "Erdpfeile",
            //     Ini: GES,
            //     SchadenProRundeSum: SchadenProRundeSum,
            //     Fäden: 1,
            //     Webschwierigkeit: 5,
            //     RundenVorbereitung: Fäden,
            //     Überanstrengung: 0,
            //     KarmaVerbrauch: 2,
            //     Angriffe: [
            //         {
            //             Art: mWsk,
            //             Stufe: add(WAH, Rang, Karma),
            //             Schaden: add(WIL, 6),
            //             Treffer: MinZauberWsk,
            //             SchadenProRunde: StandardSchadenProRunde,
            //             Wiederholungen: 1,
            //             Fehlschlag: 0,
            //             AnzahlRundenAngriffAlsAktion: 1,
            //             FolgeRundenAngriffAutomatisch: 0,
            //         }
            //     ]
            // }, {
            //     Karma: GrundKarma,
            //     KomboKreis: 3,
            //     Kombo: "Eisbola",
            //     Ini: GES,
            //     SchadenProRundeSum: SchadenProRundeSum,
            //     Fäden: 0,
            //     Webschwierigkeit: 0,
            //     RundenVorbereitung: Fäden,
            //     Überanstrengung: 0,
            //     KarmaVerbrauch: 1,
            //     Angriffe: [
            //         {
            //             Art: mWsk,
            //             Stufe: add(WAH, Rang, Karma),
            //             Schaden: add(WIL, 5),
            //             Treffer: MinZauberWsk,
            //             SchadenProRunde: StandardSchadenProRunde,
            //             Wiederholungen: 1,
            //             Fehlschlag: 0,
            //             AnzahlRundenAngriffAlsAktion: 1,
            //             FolgeRundenAngriffAutomatisch: 0,
            //         }
            //     ]
            // },
            // // Willensstärke ab Kreis 5
            // {
            //     Karma: GrundKarma,
            //     KomboKreis: 5,
            //     Kombo: "Erdstab",
            //     Ini: GES,
            //     SchadenProRundeSum: SchadenProRundeSum,
            //     Fäden: 1,
            //     Webschwierigkeit: 11,
            //     RundenVorbereitung: Fäden,
            //     Überanstrengung: 0,
            //     KarmaVerbrauch: 1,
            //     Angriffe: [
            //         {
            //             // Angriff ist körperlich über den Stab mit Geschicklichkeit, für Rang Runden möglich
            //             Art: kWsk,
            //             Stufe: GES,
            //             Schaden: add(STÄ, 10),
            //             Treffer: MinZauberWsk,
            //             SchadenProRunde: StandardSchadenProRunde,
            //             Wiederholungen: 1,
            //             Fehlschlag: 0,
            //             AnzahlRundenAngriffAlsAktion: Rang,
            //             FolgeRundenAngriffAutomatisch: 0,
            //         }
            //     ]
            // }, {
            //     Karma: GrundKarma,
            //     KomboKreis: 5,
            //     Kombo: "Eisbola+Willensstärke",
            //     Ini: GES,
            //     SchadenProRundeSum: SchadenProRundeSum,
            //     Fäden: 0,
            //     Webschwierigkeit: 0,
            //     RundenVorbereitung: Fäden,
            //     Überanstrengung: 0,
            //     KarmaVerbrauch: 1,
            //     Angriffe: [
            //         {
            //             Art: mWsk,
            //             Stufe: add(WAH, Rang, Karma),
            //             Schaden: add(WIL, 5, Rang),
            //             Treffer: MinZauberWsk,
            //             SchadenProRunde: StandardSchadenProRunde,
            //             Wiederholungen: 1,
            //             Fehlschlag: 0,
            //             AnzahlRundenAngriffAlsAktion: 1,
            //             FolgeRundenAngriffAutomatisch: 0,
            //         }
            //     ]
            // }, {
            //     Karma: GrundKarma,
            //     KomboKreis: 5,
            //     Kombo: "Feuerball",
            //     Ini: GES,
            //     SchadenProRundeSum: SchadenProRundeSum,
            //     Fäden: 1,
            //     Webschwierigkeit: 12,
            //     RundenVorbereitung: Fäden,
            //     Überanstrengung: 0,
            //     KarmaVerbrauch: 1,
            //     Angriffe: [
            //         {
            //             Art: mWsk,
            //             Stufe: add(WAH, Rang, Karma),
            //             Schaden: add(WIL, 8, Rang),
            //             Treffer: MinZauberWsk,
            //             SchadenProRunde: StandardSchadenProRunde,
            //             Wiederholungen: 1,
            //             Fehlschlag: 0,
            //             AnzahlRundenAngriffAlsAktion: 1,
            //             FolgeRundenAngriffAutomatisch: 0,
            //         }
            //     ]
            // }, {
            //     Karma: GrundKarma,
            //     KomboKreis: 6,
            //     Kombo: "Querschläger",
            //     Ini: GES,
            //     SchadenProRundeSum: SchadenProRundeSum,
            //     Fäden: min(Rang, evaluate("Max_Runden_Vorbereitung")),
            //     Webschwierigkeit: 12,
            //     RundenVorbereitung: Fäden,
            //     Überanstrengung: 0,
            //     KarmaVerbrauch: Fäden,
            //     maximaleAngriffe: Fäden,
            //     Angriffe: [
            //         {
            //             Art: mWsk,
            //             Stufe: add(WAH, Rang, Karma),
            //             Schaden: add(WIL, 12, Rang),
            //             Treffer: MinWsk,
            //             SchadenProRunde: StandardSchadenProRunde,
            //             Wiederholungen: WiederholungenBisAngriffFehlschlägt,
            //             Fehlschlag: 0,
            //             AnzahlRundenAngriffAlsAktion: 1,
            //             FolgeRundenAngriffAutomatisch: 0,
            //         }
            //     ]
            // },
            // // Erweiterte Matrix ab kreis 7
            // {
            //     Karma: GrundKarma,
            //     KomboKreis: 7,
            //     Kombo: "Erdpfeile erw. Matrix",
            //     Ini: GES,
            //     SchadenProRundeSum: SchadenProRundeSum,
            //     Fäden: 0,
            //     Webschwierigkeit: 0,
            //     RundenVorbereitung: Fäden,
            //     Überanstrengung: 0,
            //     KarmaVerbrauch: 1,
            //     Angriffe: [
            //         {
            //             Art: mWsk,
            //             Stufe: add(WAH, Rang, Karma),
            //             Schaden: add(WIL, 6),
            //             Treffer: MinZauberWsk,
            //             SchadenProRunde: StandardSchadenProRunde,
            //             Wiederholungen: 1,
            //             Fehlschlag: 0,
            //             AnzahlRundenAngriffAlsAktion: 1,
            //             FolgeRundenAngriffAutomatisch: 0,
            //         }
            //     ]
            // }, {
            //     Karma: GrundKarma,
            //     KomboKreis: 7,
            //     Kombo: "Feuerball erw. Matrix",
            //     Ini: GES,
            //     SchadenProRundeSum: SchadenProRundeSum,
            //     Fäden: 0,
            //     Webschwierigkeit: 0,
            //     RundenVorbereitung: Fäden,
            //     Überanstrengung: 0,
            //     KarmaVerbrauch: 1,
            //     Angriffe: [
            //         {
            //             Art: mWsk,
            //             Stufe: add(WAH, Rang, Karma),
            //             Schaden: add(WIL, 8, Rang),
            //             Treffer: MinZauberWsk,
            //             SchadenProRunde: StandardSchadenProRunde,
            //             Wiederholungen: 1,
            //             Fehlschlag: 0,
            //             AnzahlRundenAngriffAlsAktion: 1,
            //             FolgeRundenAngriffAutomatisch: 0,
            //         }
            //     ]
            // }, {
            //     Karma: GrundKarma,
            //     KomboKreis: 7,
            //     Kombo: "Querschläger erw. Matrix",
            //     Ini: GES,
            //     SchadenProRundeSum: SchadenProRundeSum,
            //     Fäden: min(Rang, evaluate("Max_Runden_Vorbereitung")),
            //     Webschwierigkeit: 12,
            //     RundenVorbereitung: Fäden,
            //     Überanstrengung: 0,
            //     KarmaVerbrauch: add(1, Fäden),
            //     maximaleAngriffe: add(1, Fäden),
            //     Angriffe: [
            //         {
            //             Art: mWsk,
            //             Stufe: add(WAH, Rang, Karma),
            //             Schaden: add(WIL, 12, Rang),
            //             Treffer: MinWsk,
            //             SchadenProRunde: StandardSchadenProRunde,
            //             Wiederholungen: WiederholungenBisAngriffFehlschlägt,
            //             Fehlschlag: 0,
            //             AnzahlRundenAngriffAlsAktion: 1,
            //             FolgeRundenAngriffAutomatisch: 0,
            //         }
            //     ]
            // }, {
            //     Karma: GrundKarma,
            //     KomboKreis: 7,
            //     Kombo: "Todesregen",
            //     Ini: GES,
            //     SchadenProRundeSum: SchadenProRundeSum,
            //     Fäden: 0,
            //     Webschwierigkeit: 0,
            //     RundenVorbereitung: Fäden,
            //     Überanstrengung: 0,
            //     KarmaVerbrauch: 1,
            //     Angriffe: [
            //         {
            //             Art: mWsk,
            //             Stufe: add(WAH, Rang, Karma),
            //             // Todesregen dauert mehrere Runden, aber er muss sich konzentrieren
            //             Schaden: add(WIL, 5, Rang),
            //             Treffer: MinZauberWsk,
            //             SchadenProRunde: StandardSchadenProRunde,
            //             Wiederholungen: 1,
            //             Fehlschlag: 0,
            //             AnzahlRundenAngriffAlsAktion: Rang,
            //             FolgeRundenAngriffAutomatisch: 0,
            //         }
            //     ]
            // },
        ]
    },


    ///////////////////////////////////////////////////////////////////////

    {
        Name: "Schütze",
        Color: "rgb(255, 0, 255)",
        Attribute: [
            "WAH", "STÄ", "GES", "WIL"
        ],
        Waffe: 5,
        inherits: DefaultCharacter,

        // Talente:
        // Blattschuss (1) 2Ü Rang
        // Magische Markierung (1)
        // Projektilwaffen (1)
        // Ini + Karma (3)
        // Weitschuss (4)
        // Tigersprung (5)
        // Schaden + Karma (5)
        // Gezielter Querschläger (6)
        // Ini +1 (7)
        // Brandpfeil (7)
        // Zweiter Schuss (8)


        Kombos: [
            {
                KomboKreis: 1,
                Kombo: "Blattschuss + Magische Markierung",
                Überanstrengung: 3,
                KarmaVerbrauch: add(Rang,1),
                inherits: DefaultKombo,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(WAH, Rang, mul(Rang, Karma), mul(2,Erfolge(add(WAH, Rang, Karma),GegnerMwsk)) ),
                        Schaden: add(Waffe, STÄ),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 5,
                Kombo: "Blattschuss + Magische Markierung + Karma auf Schaden + Tigersprung",
                Überanstrengung: 3,
                KarmaVerbrauch: add(Rang,2),
                Ini: add(GES,Rang),
                inherits: DefaultKombo,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(WAH, Rang, mul(Rang, Karma), mul(2,Erfolge(add(WAH, Rang, Karma),GegnerMwsk)) ),
                        Schaden: add(Waffe, STÄ, Karma),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 7,
                Kombo: "Blattschuss + Magische Markierung + Karma auf Schaden + Brandpfeil",
                Überanstrengung: 4,
                KarmaVerbrauch: add(Rang,3),
                Ini: add(GES,Rang,1),
                inherits: DefaultKombo,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(WAH, Rang, mul(Rang, Karma), mul(2,Erfolge(add(WAH, Rang, Karma),GegnerMwsk)) ),
                        Schaden: add(Waffe, STÄ, Karma, Rang, Karma),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 7,
                Kombo: "(Blattschuss + Magische Markierung + Karma auf Schaden + Brandpfeil) * 2 (Zweiter Schuss)",
                Überanstrengung: mul(2,4),
                KarmaVerbrauch: mul(2,add(Rang,3)),
                Ini: add(GES,Rang,1),
                inherits: DefaultKombo,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(WAH, Rang, mul(Rang, Karma), mul(2,Erfolge(add(WAH, Rang, Karma),GegnerMwsk)) ),
                        Schaden: add(Waffe, STÄ, Karma, Rang, Karma),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(WAH, Rang, mul(Rang, Karma), mul(2,Erfolge(add(WAH, Rang, Karma),GegnerMwsk)) ),
                        Schaden: add(Waffe, STÄ, Karma, Rang, Karma),
                        Treffer: MinWsk,
                    }
                ]
            },
        ]
    },


    ///////////////////////////////////////////////////////////////////////

    {
        Name: "Geisterbeschwörer",
        Color: "rgb(200, 200, 100)",
        Attribute: [
            "WAH", "WIL"
        ],
        inherits: DefaultZauberer,
        // Talente:

        // Fadenweben (1) 0Ü
        // Spruchzauberei (1) 0Ü
        // Erweiterte Matrix (5) -1 Faden
        // Willenstärke (6) 1Ü

        // Zauber:
        // Astralspeer (1) 1F, myst, Wirkung: WIL+4 + 2/Erfolg + 2/Faden
        // Geisterhand (1) 0F, myst, Dauer: 2 + 2/Erfolg Runden, Wirkung: WIL+2 + 2/Faden & -2 auf kWsk und mWsk
        // Kreis der Kälte (2) 0F, myst, Dauer: Rang Minuten, Wirkung: Kreis+4 + 2/Erfolg, - aber nur statisch 2m!
        // Nebelgeist beschwören (2) 1F, myst, Dauer: Rang Runden, Wirkung: Geist mit Angriff/Schaden Kreis+10 + 2/Faden
        // Schmerzen (3) 0F, Dauer: Rang Runden, Wirkung: 3 Wunden
        // Knochenbrecher (6) 2F, myst, WIL+6 * (1+Erfolg) eigentlich max 2 pro Gegner..
        // Schwächende Düsternis (6) 2F, myst, 1 Wunde pro Runde
        // Herzbeklemmung (7) 4F, myst, Rang Runden, WIL Schaden + 2/Faden + Imobilität
        // Knochenpudding (7) 4F, myst, Rang+5 Runden, 3 Wunden + 1Wunde/Erfolg + Immobilität
        // Üble Dämpfe (7) 2F, myst, Rang Runden, WIL+5 + 2/Faden
        // Schattenfessel (8), 2F, myst, Rang Runden, Immobilität


        Kombos: [
            {
                Karma: GrundKarma,
                KomboKreis: 1,
                Kombo: "Kampfstab",
                inherits: DefaultKombo,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: GES,
                        Schaden: add(STÄ, Waffe),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 1,
                Kombo: "Astralspeer",
                MinFäden: 1,
                Webschwierigkeit: 5,
                FixKarmaVerbrauch: 1,
                inherits: ZauberKombo,
                Angriffe: [
                    {
                        Art: mWsk,
                        Stufe: add(WAH, Rang, Karma),
                        Schaden: add(WILS, 4, mul(Erfolge,2), mul(ExtraFäden,2)),
                        Treffer: MinZauberWsk,
                    }
                ]
            },
            {
                KomboKreis: 1,
                Kombo: "Geisterhand",
                MinFäden: 0,
                Webschwierigkeit: 5,
                FixKarmaVerbrauch: 1,
                inherits: ZauberKombo,
                Angriffe: [
                    {
                        Art: mWsk,
                        Stufe: add(WAH, Rang, Karma),
                        // 2 Runden -2 auf Wsk => als 2 zus. Schaden verrechnet
                        Schaden: add(WILS, 2, mul(ExtraFäden,2), 2),
                        Treffer: MinZauberWsk,
                    }
                ]
            },
            {
                KomboKreis: 2,
                Kombo: "Nebelgeist",
                MinFäden: 1,
                Webschwierigkeit: 6,
                FixKarmaVerbrauch: 1,
                inherits: ZauberKombo,
                Angriffe: [
                    {
                        Art: mWsk,
                        Stufe: add(Kreis, 10, mul(ExtraFäden,2)),
                        Schaden: add(Kreis, 10, mul(ExtraFäden,2)),
                        Treffer: MinZauberWsk,
                        AnzahlRundenAngriffAlsAktion: Rang,
                    }
                ]
            },
            {
                KomboKreis: 6,
                Kombo: "Knochenbrecher",
                MinFäden: 2,
                Webschwierigkeit: 10,
                FixKarmaVerbrauch: 1,
                inherits: ZauberKombo,
                Angriffe: [
                    {
                        Art: mWsk,
                        Stufe: add(WAH, Rang, Karma),
                        // bei Erfolg doppelten Schaden gegen einzelnes Ziel
                        Schaden: add(WILS, 6, mul(ExtraFäden,2), 2),
                        Treffer: MinZauberWsk,
                        SchadenProRunde: StandardSchadenProRunde,
                        Wiederholungen: min(2,add(1,Erfolge)),
                    }
                ]
            },

        ]
    },

    ///////////////////////////////////////////////////////////////////////
    {
        Name: "Tiermeister",
        Color: "rgb(50, 170, 50)",
        Attribute: [
            "GES", "STÄ"
        ],
        inherits: DefaultCharacter,

        // Krallenhand (1) :  Rang + STÄ + 3
        // Waffenloser Kampf (1): Rang + GES

        // Schaden + 1 Karma (5),
        // Kobrastoß (5) 2Ü, Ini = Rang+Ges, pro Erfolg gegen Ini +2 auf Angriffsprobe (nur 1.)
        // Nachtreten (5) Ü1, Rang+Ges
        // Tigersprung (5), Ü1, Ini += Rang
        // Schlachtruf (5), Ü1, Rang + CHA, pro Erfolg gegen CHA -1 auf Angriff

        // Blutige Krallen (8) 1Ü + 1Ü pro Angriff. Man muss die Anzahl der Angriffe vorher ansagen

        Kombos: [
            {
                KomboKreis: 1,
                Kombo: "Waffenloser Kampf + Krallenhand",
                KarmaVerbrauch: 2,
                inherits: DefaultKombo,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(GES, Rang, Karma),
                        Schaden: add(Rang, STÄ, 3, Karma),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 5,
                Kombo: "Waffenloser Kampf + Krallenhand + Karma + Kobrastoss + Nachtreten + Tigersprung",
                Ini: add(Rang,Karma,Rang,Karma,GES),
                Überanstrengung: 5,
                KarmaVerbrauch: 6,
                inherits: DefaultKombo,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(GES, Rang, Karma, mul(2,Erfolge(Ini,GegnerIni))),
                        Schaden: add(Rang, STÄ, 3, Karma, Karma),
                        Treffer: MinWsk,
                        AnzahlRundenAngriffAlsAktion: 1,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(GES, Rang, Karma),
                        Schaden: STÄ,
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 8,
                Kombo: "Waffenloser Kampf + Krallenhand + Karma + Kobrastoss + Nachtreten + Tigersprung + Blutige Krallen",
                Ini: add(Rang,Karma,Rang,Karma,GES),
                // maximale Angriffe, kann Rang nehmen, aber will maximal 8 Angriffe = unter Verwundungsschwelle
                maximaleAngriffe: max(Rang, 8),
                Überanstrengung: add(6,maximaleAngriffe),
                KarmaVerbrauch: add(3,mul(3,WiederholungenBisAngriffFehlschlägt)),
                inherits: DefaultKombo,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(GES, Rang, Karma, mul(div(2,maximaleAngriffe),Erfolge(Ini,GegnerIni))),
                        Schaden: add(Rang, STÄ, 3, Karma, Karma),
                        Treffer: MinWsk,
                        Wiederholungen: WiederholungenBisAngriffFehlschlägt,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(GES, Rang, Karma),
                        Schaden: add(STÄ),
                        Treffer: MinWsk,
                    }
                ]
            },
        ]
    },

    // ///////////////////////////////////////////////////////////////////////
    //
    // {
    //     Name: "Magier",
    //     Color: "rgb(90, 243, 243)",
    //     Attribute: [
    //         "WAH", "WIL"
    //     ],
    //     Kombos: [
    //         {
    //             Karma: GrundKarma,
    //             KomboKreis: 1,
    //             Kombo: "mentaler Dolch",
    //             Ini: GES,
    //             SchadenProRundeSum: SchadenProRundeSum,
    //             Fäden: 0,
    //             Webschwierigkeit: 0,
    //             RundenVorbereitung: Fäden,
    //             Überanstrengung: 0,
    //             KarmaVerbrauch: 1,
    //             Angriffe: [
    //                 {
    //                     Art: mWsk,
    //                     Stufe: add(WAH, Rang, Karma),
    //                     Schaden: add(WIL, 2),
    //                     Treffer: MinZauberWsk,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fehlschlag: 0,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }
    //             ]
    //         },
    //         // Willensstärke ab Kreis 5
    //         {
    //             Karma: GrundKarma,
    //             KomboKreis: 5,
    //             Kombo: "Improvisiertes Geschoss",
    //             Ini: GES,
    //             SchadenProRundeSum: SchadenProRundeSum,
    //             Fäden: 1,
    //             Webschwierigkeit: 9,
    //             RundenVorbereitung: Fäden,
    //             Überanstrengung: 0,
    //             KarmaVerbrauch: 2,
    //             Angriffe: [
    //                 {
    //                     Art: mWsk,
    //                     Stufe: add(WAH, Rang, Karma),
    //                     Schaden: add(WIL, Rang, 6),
    //                     Treffer: MinZauberWsk,
    //                     // pro Runde ein Angriff möglich für Wirkungsdauer
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fehlschlag: 0,
    //                     AnzahlRundenAngriffAlsAktion: Rang,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }
    //             ]
    //         },
    //         // Erweiterte Matrix ab Kreis 6
    //         {
    //             Karma: GrundKarma,
    //             KomboKreis: 6,
    //             Kombo: "Geschoss des Grauens",
    //             Ini: GES,
    //             SchadenProRundeSum: SchadenProRundeSum,
    //             Fäden: 2,
    //             Webschwierigkeit: 0,
    //             RundenVorbereitung: Fäden,
    //             Überanstrengung: 0,
    //             KarmaVerbrauch: 3,
    //             Angriffe: [
    //                 {
    //                     Art: mWsk,
    //                     Stufe: add(WAH, Rang, Karma),
    //                     Schaden: add(WIL, Rang, 5),
    //                     Treffer: MinZauberWsk,
    //                     // Macht automatisch Schaden pro Runde
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fehlschlag: 0,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: Rang,
    //                 }
    //             ]
    //         }, {
    //             Karma: GrundKarma,
    //             KomboKreis: 6,
    //             Kombo: "Zerschmettern",
    //             Ini: GES,
    //             SchadenProRundeSum: SchadenProRundeSum,
    //             Fäden: 1,
    //             Webschwierigkeit: 11,
    //             RundenVorbereitung: Fäden,
    //             Überanstrengung: 0,
    //             KarmaVerbrauch: 2,
    //             Angriffe: [
    //                 {
    //                     Art: mWsk,
    //                     Stufe: add(WAH, Rang, Karma),
    //                     Schaden: add(WIL, Rang, 15),
    //                     Treffer: MinZauberWsk,
    //                     // Bonus von 10%, da schon bei "gut" durch
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1.1,
    //                     Fehlschlag: 0,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }
    //             ]
    //         }, {
    //             Karma: GrundKarma,
    //             KomboKreis: 7,
    //             Kombo: "Siedendes Blut",
    //             Ini: GES,
    //             SchadenProRundeSum: SchadenProRundeSum,
    //             Fäden: 2,
    //             Webschwierigkeit: 12,
    //             RundenVorbereitung: 2,
    //             Überanstrengung: 0,
    //             KarmaVerbrauch: 3,
    //             Angriffe: [
    //                 {
    //                     Art: mWsk,
    //                     Stufe: add(WAH, Rang, Karma),
    //                     Schaden: add(WIL, Rang, 9),
    //                     Treffer: MinZauberWsk,
    //                     // Der Angriff erfolgt mehrere Runden lang (Rang?)
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fehlschlag: 0,
    //                     AnzahlRundenAngriffAlsAktion: Rang,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }
    //             ]
    //         }, {
    //             Karma: GrundKarma,
    //             KomboKreis: 8,
    //             Kombo: "Zerquetschen",
    //             Ini: GES,
    //             SchadenProRundeSum: SchadenProRundeSum,
    //             Fäden: 2,
    //             Webschwierigkeit: 15,
    //             RundenVorbereitung: Fäden,
    //             Überanstrengung: 0,
    //             KarmaVerbrauch: 3,
    //             Angriffe: [
    //                 {
    //                     Art: mWsk,
    //                     Stufe: add(WAH, Rang, Karma),
    //                     Schaden: add(WIL, Rang, 10),
    //                     Treffer: MinZauberWsk,
    //                     // Macht automatisch Schaden pro Runde
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 2,
    //                     Fehlschlag: 0,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: Rang,
    //                 }
    //             ]
    //         },
    //     ]
    // },
    //
    // ///////////////////////////////////////////////////////////////////////
    //
    // {
    //     Name: "Alchemist",
    //     Color: "rgb(250, 0, 0)",
    //     Attribute: [
    //         "GES", "STÄ", "WAH"
    //     ],
    //     Kombos: [
    //         {
    //             Karma: GrundKarma,
    //             KomboKreis: 1,
    //             MixturKreis: 1,
    //             Kombo: "Brandkiesel",
    //             Ini: GES,
    //             SchadenProRundeSum: SchadenProRundeSum,
    //             Überanstrengung: 0,
    //             KarmaVerbrauch: 1,
    //             Fehlschlag: AlchmFehlschlag,
    //             AlchmTreffer: AlchmTreffer,
    //             Angriffe: [
    //                 {
    //                     Art: kWsk,
    //                     Stufe: mul(AlchmTreffer, add(GES, Rang, Karma)),
    //                     Schaden: 10,
    //                     Treffer: MinWsk,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fäden: 0,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }
    //             ]
    //         }, {
    //             Karma: GrundKarma,
    //             KomboKreis: 2,
    //             MixturKreis: 1,
    //             Kombo: "Brandkiesel,Mixturmagie",
    //             Ini: GES,
    //             SchadenProRundeSum: SchadenProRundeSum,
    //             Überanstrengung: 0,
    //             KarmaVerbrauch: 1,
    //             Fehlschlag: AlchmFehlschlag,
    //             AlchmTreffer: AlchmTreffer,
    //             Angriffe: [
    //                 {
    //                     Art: kWsk,
    //                     Stufe: mul(AlchmTreffer, add(GES, Rang, Karma)),
    //                     Schaden: add(10, Rang),
    //                     Treffer: MinWsk,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fäden: 0,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }
    //             ]
    //         }, {
    //             Karma: GrundKarma,
    //             KomboKreis: 4,
    //             MixturKreis: 4,
    //             Kombo: "Splitterbombe,Mixturmagie",
    //             Ini: GES,
    //             SchadenProRundeSum: SchadenProRundeSum,
    //             Überanstrengung: 0,
    //             KarmaVerbrauch: 1,
    //             Fehlschlag: AlchmFehlschlag,
    //             AlchmTreffer: AlchmTreffer,
    //             Angriffe: [
    //                 {
    //                     Art: kWsk,
    //                     Stufe: mul(AlchmTreffer, add(GES, Rang, Karma)),
    //                     Schaden: add(11, Rang),
    //                     Treffer: MinWsk,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fäden: 0,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }
    //             ]
    //         }, {
    //             Karma: GrundKarma,
    //             KomboKreis: 5,
    //             MixturKreis: 5,
    //             Kombo: "Königswasser,Mixturmagie",
    //             Ini: GES,
    //             SchadenProRundeSum: SchadenProRundeSum,
    //             Überanstrengung: 0,
    //             KarmaVerbrauch: 2,
    //             Fehlschlag: AlchmFehlschlag,
    //             AlchmTreffer: AlchmTreffer,
    //             Angriffe: [
    //                 {
    //                     Art: kWsk,
    //                     Stufe: mul(AlchmTreffer, add(GES, Rang, Karma)),
    //                     Schaden: add(14, Rang, Karma),
    //                     Treffer: MinWsk,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fäden: 0,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     // bei aussergewöhnlich Rang Runden Schaden?
    //                     FolgeRundenAngriffAutomatisch: 0.5,
    //                 }
    //             ]
    //         }, {
    //             Karma: GrundKarma,
    //             KomboKreis: 5,
    //             MixturKreis: 5,
    //             Kombo: "Königswasser,Kampfsaft,Mixturmagie",
    //             Ini: add(GES, 3),
    //             SchadenProRundeSum: SchadenProRundeSum,
    //             Überanstrengung: 0,
    //             KarmaVerbrauch: 2,
    //             RundenVorbereitung: 1,
    //             RundenWirkung: Rang,
    //             Fehlschlag: AlchmFehlschlag,
    //             AlchmTreffer: AlchmTreffer,
    //             Angriffe: [
    //                 {
    //                     Art: kWsk,
    //                     Stufe: mul(AlchmTreffer, AlchmTreffer, add(GES, Rang, Karma, 3)),
    //                     Schaden: add(14, Rang, 3, Karma),
    //                     Treffer: MinWsk,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fäden: 0,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     // bei aussergewöhnlich Rang Runden Schaden?
    //                     FolgeRundenAngriffAutomatisch: 0.5,
    //                 }
    //             ]
    //         }, {
    //             Karma: add(GrundKarma, 2),
    //             KomboKreis: 7,
    //             MixturKreis: 5,
    //             Kombo: "Königswasser,Kampfsaft,Passionshonig,Mixturmagie",
    //             Ini: add(GES, 3),
    //             SchadenProRundeSum: SchadenProRundeSum,
    //             Überanstrengung: 0,
    //             KarmaVerbrauch: 2,
    //             RundenVorbereitung: 2,
    //             RundenWirkung: Rang,
    //             Fehlschlag: AlchmFehlschlag,
    //             AlchmTreffer: AlchmTreffer,
    //             Angriffe: [
    //                 {
    //                     Art: kWsk,
    //                     Stufe: mul(AlchmTreffer, AlchmTreffer, add(GES, Rang, Karma, 3)),
    //                     Schaden: add(14, Rang, 3, Karma),
    //                     Treffer: MinWsk,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fäden: 0,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     // bei aussergewöhnlich Rang Runden Schaden?
    //                     FolgeRundenAngriffAutomatisch: 0.5,
    //                 }
    //             ]
    //         }, {
    //             Karma: GrundKarma,
    //             KomboKreis: 8,
    //             MixturKreis: 8,
    //             Kombo: "Alkahest,Mixturmagie",
    //             Ini: GES,
    //             SchadenProRundeSum: SchadenProRundeSum,
    //             Überanstrengung: 0,
    //             KarmaVerbrauch: 2,
    //             Fehlschlag: AlchmFehlschlag,
    //             AlchmTreffer: AlchmTreffer,
    //             Angriffe: [
    //                 {
    //                     Art: kWsk,
    //                     Stufe: mul(AlchmTreffer, add(GES, Rang, Karma)),
    //                     Schaden: add(20, Rang, Karma),
    //                     Treffer: MinWsk,
    //                     // wirkt bei einem Direkttreffer Rang Runden, daher ca. 1.3 mal
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1.3,
    //                     Fäden: 0,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     // bei aussergewöhnlich Rang Runden Schaden?
    //                     FolgeRundenAngriffAutomatisch: 0.5,
    //                 }
    //             ]
    //         }, {
    //             Karma: add(GrundKarma, 2),
    //             KomboKreis: 8,
    //             MixturKreis: 8,
    //             Kombo: "Alkahest,Kampfsaft,Passionshonig,Mixturmagie",
    //             Ini: GES,
    //             SchadenProRundeSum: SchadenProRundeSum,
    //             RundenVorbereitung: 2,
    //             RundenWirkung: Rang,
    //             Überanstrengung: 0,
    //             KarmaVerbrauch: 2,
    //             Fehlschlag: AlchmFehlschlag,
    //             AlchmTreffer: AlchmTreffer,
    //             Angriffe: [
    //                 {
    //                     Art: kWsk,
    //                     Stufe: mul(AlchmTreffer, AlchmTreffer, add(GES, Rang, Karma, 3)),
    //                     Schaden: add(20, Rang, 3, Karma),
    //                     Treffer: MinWsk,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1.3,
    //                     Fäden: 0,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     // bei aussergewöhnlich Rang Runden Schaden?
    //                     FolgeRundenAngriffAutomatisch: 0.5,
    //                 }
    //             ]
    //         }
    //
    //     ]
    // },
    //
    // ///////////////////////////////////////////////////////////////////////
    //
    // {
    //     Name: "Krieger",
    //     Color: "rgb(0, 0, 0)",
    //     Attribute: [
    //         "GES", "STÄ", "WAH"
    //     ],
    //     Waffe: 7,
    //     Kombos: [
    //         {
    //             Karma: GrundKarma,
    //             KomboKreis: 1,
    //             Kombo: "Lufttanz,Nahkampfwaffen",
    //             Ini: add(Rang, GES),
    //             SchadenProRundeSum: SchadenProRundeSum,
    //             Überanstrengung: 1,
    //             KarmaVerbrauch: 2,
    //             Angriffe: [
    //                 {
    //                     Art: kWsk,
    //                     Stufe: add(GES, Rang, Karma),
    //                     Schaden: add(STÄ, Waffe),
    //                     Treffer: MinWsk,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                 }, {
    //                     Art: kWsk,
    //                     Stufe: add(GES, Rang, Karma),
    //                     Schaden: add(STÄ, Waffe),
    //                     Treffer: mul(Min2xIni, MinWsk),
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fäden: 0,
    //                     Fehlschlag: AlchmFehlschlag,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }
    //             ]
    //         }, {
    //             Karma: GrundKarma,
    //             KomboKreis: 1,
    //             Kombo: "Kampfsinn,Nahkampfwaffen",
    //             Ini: GES,
    //             SchadenProRundeSum: SchadenProRundeSum,
    //             Überanstrengung: 1,
    //             KarmaVerbrauch: 1,
    //             Angriffe: [
    //                 {
    //                     Art: kWsk,
    //                     Stufe: add(GES, Rang, KampfsinnKarmaRang, Karma),
    //                     Schaden: add(STÄ, Waffe),
    //                     Treffer: MinWsk,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fäden: 0,
    //                     Fehlschlag: AlchmFehlschlag,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }
    //             ]
    //         }, {
    //             Karma: GrundKarma,
    //             KomboKreis: 3,
    //             Kombo: "Tigersprung,Kampfsinn,Nahkampfwaffen",
    //             Ini: add(Rang, GES),
    //             SchadenProRundeSum: SchadenProRundeSum,
    //             Überanstrengung: 2,
    //             KarmaVerbrauch: 1,
    //             Angriffe: [
    //                 {
    //                     Art: kWsk,
    //                     Stufe: add(GES, Rang, KampfsinnKarmaRang, Karma),
    //                     Schaden: add(STÄ, Waffe),
    //                     Treffer: MinWsk,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fäden: 0,
    //                     Fehlschlag: AlchmFehlschlag,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }
    //             ]
    //         }, {
    //             Karma: GrundKarma,
    //             KomboKreis: 3,
    //             Kombo: "Tigersprung,Lufttanz,Nahkampfwaffen",
    //             Ini: add(Rang, Rang, GES),
    //             SchadenProRundeSum: SchadenProRundeSum,
    //             Überanstrengung: 2,
    //             KarmaVerbrauch: 2,
    //             Angriffe: [
    //                 {
    //                     Art: kWsk,
    //                     Stufe: add(GES, Rang, Karma),
    //                     Schaden: add(STÄ, Waffe),
    //                     Treffer: MinWsk,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fäden: 0,
    //                     Fehlschlag: AlchmFehlschlag,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }, {
    //                     Art: kWsk,
    //                     Stufe: add(GES, Rang, Karma),
    //                     Schaden: add(STÄ, Waffe),
    //                     Treffer: mul(Min2xIni, MinWsk),
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fäden: 0,
    //                     Fehlschlag: AlchmFehlschlag,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }
    //             ]
    //         }, {
    //             Karma: GrundKarma,
    //             KomboKreis: 4,
    //             Kombo: "Tigersprung,Kampfsinn,Nahkampfwaffen,Schmetterschlag",
    //             Ini: add(Rang, GES),
    //             SchadenProRundeSum: SchadenProRundeSum,
    //             Überanstrengung: 3,
    //             KarmaVerbrauch: 3,
    //             Angriffe: [
    //                 {
    //                     Art: kWsk,
    //                     Stufe: add(GES, Rang, KampfsinnKarmaRang, Karma),
    //                     Schaden: add(STÄ, div(add(Rang, 3, Karma), 4), Waffe),
    //                     Treffer: MinWsk,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fäden: 0,
    //                     Fehlschlag: AlchmFehlschlag,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }
    //             ]
    //         }, {
    //             Karma: GrundKarma,
    //             KomboKreis: 4,
    //             Kombo: "Tigersprung,Lufttanz,Nahkampfwaffen,Schmetterschlag",
    //             Ini: add(Rang, Rang, GES),
    //             SchadenProRundeSum: SchadenProRundeSum,
    //             Überanstrengung: 4,
    //             KarmaVerbrauch: 4,
    //             Angriffe: [
    //                 {
    //                     Art: kWsk,
    //                     Stufe: add(GES, Rang, Karma),
    //                     Schaden: add(STÄ, div(add(Rang, 3, Karma), 4), Waffe),
    //                     Treffer: MinWsk,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fäden: 0,
    //                     Fehlschlag: AlchmFehlschlag,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }, {
    //                     Art: kWsk,
    //                     Stufe: add(GES, Rang, Karma),
    //                     Schaden: add(STÄ, div(add(Rang, 3, Karma), 4), Waffe),
    //                     Treffer: mul(Min2xIni, MinWsk),
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fäden: 0,
    //                     Fehlschlag: AlchmFehlschlag,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }
    //             ]
    //         }, {
    //             Karma: GrundKarma,
    //             KomboKreis: 5,
    //             Kombo: "Tigersprung,Kampfsinn,Nahkampfwaffen,Schmetterschlag,Luftgleiten,Nachtreten",
    //             Ini: add(Rang, GES),
    //             SchadenProRundeSum: SchadenProRundeSum,
    //             Überanstrengung: 5,
    //             KarmaVerbrauch: 5,
    //             Angriffe: [
    //                 {
    //                     Art: kWsk,
    //                     Stufe: add(GES, Rang, KampfsinnKarmaRang, Karma),
    //                     Schaden: add(STÄ, div(add(Rang, 3, Karma), 2), Waffe),
    //                     Treffer: MinWsk,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fäden: 0,
    //                     Fehlschlag: AlchmFehlschlag,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }, {
    //                     Art: kWsk,
    //                     Stufe: add(GES, Rang, Karma),
    //                     Schaden: STÄ,
    //                     Treffer: MinWsk,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fäden: 0,
    //                     Fehlschlag: AlchmFehlschlag,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }
    //             ]
    //         }, {
    //             Karma: GrundKarma,
    //             KomboKreis: 5,
    //             Kombo: "Tigersprung,Lufttanz,Nahkampfwaffen,Schmetterschlag,Luftgleiten,Nachtreten",
    //             Ini: add(Rang, Rang, GES),
    //             SchadenProRundeSum: SchadenProRundeSum,
    //             Überanstrengung: 5,
    //             KarmaVerbrauch: 5,
    //             Angriffe: [
    //                 {
    //                     Art: kWsk,
    //                     Stufe: add(GES, Rang, Karma),
    //                     Schaden: add(STÄ, div(add(Rang, 3, Karma), 2), Waffe),
    //                     Treffer: MinWsk,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fäden: 0,
    //                     Fehlschlag: AlchmFehlschlag,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }, {
    //                     Art: kWsk,
    //                     Stufe: add(GES, Rang, Karma),
    //                     Schaden: add(STÄ, div(add(Rang, 3, Karma), 2), Waffe),
    //                     Treffer: mul(Min2xIni, MinWsk),
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fäden: 0,
    //                     Fehlschlag: AlchmFehlschlag,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }, {
    //                     Art: kWsk,
    //                     Stufe: add(GES, Rang, Karma),
    //                     Schaden: STÄ,
    //                     Treffer: MinWsk,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fäden: 0,
    //                     Fehlschlag: AlchmFehlschlag,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }
    //             ]
    //         }, {
    //             Karma: GrundKarma,
    //             KomboKreis: 7,
    //             Kombo: "Tigersprung,Kampfsinn,Nahkampfwaffen,Schmetterschlag,Luftgleiten,Zweiter Angriff,Nachtreten",
    //             Ini: add(Rang, GES),
    //             SchadenProRundeSum: SchadenProRundeSum,
    //             Überanstrengung: 5,
    //             KarmaVerbrauch: 5,
    //             Angriffe: [
    //                 {
    //                     Art: kWsk,
    //                     Stufe: add(GES, Rang, Karma, KampfsinnKarmaRang),
    //                     Schaden: add(STÄ, div(add(Rang, 3, Karma), 2), Waffe),
    //                     Treffer: MinWsk,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fäden: 0,
    //                     Fehlschlag: AlchmFehlschlag,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }, {
    //                     Art: kWsk,
    //                     Stufe: add(GES, Rang, KampfsinnKarmaRang),
    //                     Schaden: add(STÄ, div(add(Rang, 3, Karma), 2), Waffe),
    //                     Treffer: MinWsk,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fäden: 0,
    //                     Fehlschlag: AlchmFehlschlag,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }, {
    //                     Art: kWsk,
    //                     Stufe: add(GES, Rang, Karma, KampfsinnKarmaRang),
    //                     Schaden: STÄ,
    //                     Treffer: MinWsk,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fäden: 0,
    //                     Fehlschlag: AlchmFehlschlag,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }
    //             ]
    //         }, {
    //             Karma: GrundKarma,
    //             KomboKreis: 8,
    //             Kombo: "Kobrastoss,Kampfsinn,Nahkampfwaffen,Schmetterschlag,Luftgleiten,Zweiter Angriff,Nachtreten",
    //             Ini: add(Rang, GES, Karma),
    //             SchadenProRundeSum: SchadenProRundeSum,
    //             Überanstrengung: 5,
    //             KarmaVerbrauch: 5,
    //             AngriffNurErsteRunde: true,
    //             Angriffe: [
    //                 {
    //                     Art: kWsk,
    //                     Stufe: add(GES, Rang, Rang, Karma, KampfsinnKarmaRang),
    //                     Schaden: add(STÄ, div(add(Rang, 3, Karma), 2), Waffe),
    //                     Treffer: MinWsk,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fäden: 0,
    //                     Fehlschlag: AlchmFehlschlag,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }, {
    //                     Art: kWsk,
    //                     Stufe: add(GES, Rang, Rang, KampfsinnKarmaRang),
    //                     Schaden: add(STÄ, div(add(Rang, 3, Karma), 2), Waffe),
    //                     Treffer: MinWsk,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fäden: 0,
    //                     Fehlschlag: AlchmFehlschlag,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }, {
    //                     Art: kWsk,
    //                     Stufe: add(GES, Rang, Rang, Karma, KampfsinnKarmaRang),
    //                     Schaden: STÄ,
    //                     Treffer: MinWsk,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fäden: 0,
    //                     Fehlschlag: AlchmFehlschlag,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }
    //             ]
    //         }
    //     ]
    // },
    //
    // ///////////////////////////////////////////////////////////////////////
    //
    // {
    //     Name: "Luftpirat",
    //     Color: "#8A0829",
    //     Attribute: [
    //         "GES", "STÄ"
    //     ],
    //     Waffe: 7,
    //     Kombos: [
    //         {
    //             // Frage - wie Kampfgebrüll (-Rang auf alle Proben des Gegners?)
    //             Karma: GrundKarma,
    //             KomboKreis: 1,
    //             Kombo: "Nahkampfwaffen",
    //             Ini: GES,
    //             SchadenProRundeSum: SchadenProRundeSum,
    //             RundenVorbereitung: 0,
    //             Überanstrengung: 0,
    //             KarmaVerbrauch: 1,
    //             Angriffe: [
    //                 {
    //                     Art: kWsk,
    //                     Stufe: add(GES, Rang, Karma),
    //                     Schaden: add(STÄ, Waffe),
    //                     Treffer: MinWsk,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Wiederholungen: 1,
    //                     Fehlschlag: 0,
    //                     Fäden: 0,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }
    //             ]
    //             // wie Schildangriff? Niederschlagsprobe Gegner -7...
    //         }, {
    //             Karma: GrundKarma,
    //             KomboKreis: 5,
    //             Kombo: "Nahkampfwaffen+Nachtreten",
    //             Ini: GES,
    //             SchadenProRundeSum: SchadenProRundeSum,
    //             RundenVorbereitung: 0,
    //             Überanstrengung: 0,
    //             KarmaVerbrauch: 1,
    //             Angriffe: [
    //                 {
    //                     Art: kWsk,
    //                     Stufe: add(GES, Rang, Karma),
    //                     Schaden: add(STÄ, Waffe),
    //                     Treffer: MinWsk,
    //                     Wiederholungen: 1,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Fehlschlag: 0,
    //                     Fäden: 0,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 },
    //                 {
    //                     Art: kWsk,
    //                     Stufe: add(GES, Rang),
    //                     Schaden: add(STÄ),
    //                     Treffer: MinWsk,
    //                     Wiederholungen: 1,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Fehlschlag: 0,
    //                     Fäden: 0,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }
    //             ]
    //         }, {
    //             Karma: GrundKarma,
    //             KomboKreis: 6,
    //             Kombo: "Nahkampfwaffen+Schwungvoller Angriff+Nachtreten",
    //             Ini: GES,
    //             SchadenProRundeSum: SchadenProRundeSum,
    //             RundenVorbereitung: 0,
    //             Überanstrengung: 1,
    //             KarmaVerbrauch: 1,
    //             Angriffe: [
    //                 {
    //                     Art: kWsk,
    //                     Stufe: add(GES, Rang, Karma),
    //                     Schaden: add(STÄ, Waffe),
    //                     Treffer: MinWsk,
    //                     // bei aussergewöhnlich noch mal angreifen
    //                     Wiederholungen: 1.1,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Fehlschlag: 0,
    //                     Fäden: 0,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 },
    //                 {
    //                     Art: kWsk,
    //                     Stufe: add(GES, Rang),
    //                     Schaden: add(STÄ),
    //                     Treffer: MinWsk,
    //                     Wiederholungen: 1,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Fehlschlag: 0,
    //                     Fäden: 0,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }
    //             ]
    //         }, {
    //             Karma: GrundKarma,
    //             KomboKreis: 7,
    //             Kombo: "Nahkampfwaffen+Schwungvoller Angriff+Nachtreten",
    //             Ini: GES,
    //             SchadenProRundeSum: SchadenProRundeSum,
    //             RundenVorbereitung: 0,
    //             Überanstrengung: 1,
    //             KarmaVerbrauch: 2,
    //             Angriffe: [
    //                 {
    //                     Art: kWsk,
    //                     Stufe: add(GES, Rang, Karma),
    //                     Schaden: add(STÄ, Waffe, Karma),
    //                     Treffer: MinWsk,
    //                     // bei aussergewöhnlich noch mal angreifen
    //                     Wiederholungen: 1.1,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Fehlschlag: 0,
    //                     Fäden: 0,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 },
    //                 {
    //                     Art: kWsk,
    //                     Stufe: add(GES, Rang),
    //                     Schaden: add(STÄ),
    //                     Treffer: MinWsk,
    //                     Wiederholungen: 1,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Fehlschlag: 0,
    //                     Fäden: 0,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }
    //             ]
    //         }, {
    //             Karma: GrundKarma,
    //             KomboKreis: 8,
    //             Kombo: "Nahkampfwaffen+Schwungvoller Angriff+Hammerschlag+Nachtreten mit Hammerschlag",
    //             Ini: GES,
    //             SchadenProRundeSum: SchadenProRundeSum,
    //             RundenVorbereitung: 0,
    //             Überanstrengung: 1,
    //             KarmaVerbrauch: 3,
    //             Angriffe: [
    //                 {
    //                     Art: kWsk,
    //                     Stufe: add(GES, Rang, Karma),
    //                     // bei Kampfgebrüll / Schlachtruf Erfolg +3, sonst +0. Da sozial meist schwach => +2.3
    //                     Schaden: add(STÄ, Rang, Waffe, Karma, 2.3),
    //                     Treffer: MinWsk,
    //                     // bei aussergewöhnlich noch mal angreifen
    //                     Wiederholungen: 1.1,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Fehlschlag: 0,
    //                     Fäden: 0,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 },
    //                 {
    //                     Art: kWsk,
    //                     Stufe: add(GES, Rang),
    //                     // kann man Hammerschlag auf Nachtreten nehmen?
    //                     Schaden: add(STÄ, Rang, Karma, 2.3),
    //                     Treffer: MinWsk,
    //                     Wiederholungen: 1,
    //                     SchadenProRunde: StandardSchadenProRunde,
    //                     Fehlschlag: 0,
    //                     Fäden: 0,
    //                     AnzahlRundenAngriffAlsAktion: 1,
    //                     FolgeRundenAngriffAutomatisch: 0,
    //                 }
    //             ]
    //         },
    //     ]
    // },
];
