"use strict";

var probeFunction = function (f) {
    return function(stufe,mindestwurf) {
        assertNumbers([stufe,mindestwurf]);
        return function (x) {
            return f(funValue(stufe, x), funValue(mindestwurf, x));
        };
    };
};

var probe = probeFunction(probability);
var erfolge = probeFunction(successes);

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
window.CHA = val("CHA");
window.Rang = val("Rang");
window.Waffe = val("Waffe");
window.GrundKarma = ß('GrundKarma',mul(4,later('Karma_Einsatz')));
window.Karma = val("Karma");
window.KarmaVerbrauch = ß('KarmaVerbrauch',mul(val("KarmaVerbrauch"),later('Karma_Einsatz')));
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
window.GegnerWsk = ß('GegnerWsk',property(val("GegnerWsk"), Art));
window.GegnerKwsk = ß('GegnerKwsk',property(val("GegnerWsk"), kWsk));
window.GegnerMwsk = ß('GegnerMwsk',property(val("GegnerWsk"), mWsk));
window.GegnerSwsk = ß('GegnerSwsk',property(val("GegnerWsk"), sWsk));
window.GegnerRüstung = ß('GegnerRüstung',property(val("GegnerRüstung"), Art));
window.MixturKreis = val("MixturKreis");
window.Fäden = val("Fäden");
window.Erfolge = val("Erfolge");
window.MinFäden = val("MinFäden");
window.ExtraFäden = val("ExtraFäden");
window.Webschwierigkeit = val("Webschwierigkeit");

window.RundenWirkung = val("RundenWirkung");
window.maximaleAngriffe = val("maximaleAngriffe");
window.MinIni = ß('MinIni',probe(Ini, GegnerIni));
window.MinWsk = ß('MinWsk',probe(Stufe, GegnerWsk));
window.MinFadenweben = ß('MinFadenweben',min(1, probe(add(WAH, Rang, Karma), Webschwierigkeit)));
window.MinZauberWsk = ß('MinZauberWsk',mul(MinFadenweben, probe(Stufe, GegnerWsk)));
window.KampfsinnRang = ß('KampfsinnRang',mul(probe(add(Rang, WAH), GegnerMwsk), MinIni, Rang));
window.KampfsinnKarmaRang = ß('KampfsinnKarmaRang',mul(probe(add(Rang, WAH, Karma), GegnerMwsk), MinIni, Rang));
window.Fehlschlag = val("Fehlschlag");
window.AlchmFehlschlag = ß('AlchmFehlschlag',mul(0.05, sub(3, min(3, sub(Kreis, MixturKreis)))));
window.AlchmTreffer = ß('AlchmTreffer',sub(1, AlchmFehlschlag));
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
window.BenötigteRundenImKampf = ß('BenötigteRundenImKampf',add(RundenVorlauf,max(RundenWirkung,AnzahlRundenAngriffAlsAktion)));


// kann maximaleAngriffe Angriffe ausführen, bricht allerdings ab, sobald ein Angriff fehlschlägt
// Summenformel für n Treffer q als Wahrscheinlichkeit [0,1[ (ist für 1 nicht definiert, daher max 1-e) :
// q^1+q^2+...+q^n = q-q^(n+1) / (1-q)
var q = min(0.999999999, MinWsk);
window.WiederholungenBisAngriffFehlschlägt = ß('WiederholungenBisAngriffFehlschlägt',div(div(sub(q, pow(q, add(maximaleAngriffe, 1))), sub(1, q)), Treffer));

window.TrefferErfolge = ß('TrefferErfolge',erfolge(Stufe,GegnerWsk));

window.SchadenMitErfolgen = val('SchadenMitErfolgen');

window.StandardSchadenEinzelrunde = ß('StandardSchadenEinzelrunde',
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
    ));

window.StandardSchadenProRunde = ß('StandardSchadenProRunde',div( StandardSchadenEinzelrunde, BenötigteRundenImKampf ));

window.SchadenProRundeSum = ß('SchadenProRundeSum',sub(sumOver("Angriffe.SchadenProRunde"), add(Überanstrengung)));
window.SchadenEinzelrundeSum = ß('SchadenEinzelrundeSum',sub(sumOver("Angriffe.SchadenEinzelrunde"), add(Überanstrengung)));

window.WillensstärkeKreis = val('WillensstärkeKreis');
window.Willensstärke = ß('Willensstärke',add(WIL,Rang,Karma));
window.FixKarmaVerbrauch = val('FixKarmaVerbrauch');

var ifKreis = (kreis,thenPart,elsePart) => (x) => ß('ifKreis',funValue(kreis,x)<=x.Kreis ? thenPart : elsePart);

window.WILS = val('WILS');

// TODO die Fäden müssen ja auch geschafft werden.... also Webschwierigkeit einbeziehen!
window.ErweiterteFäden = val('ErweiterteFäden');
window.StandardFäden = ß('StandardFäden',add(RundenVorlauf,ErweiterteFäden));
window.ExtraFäden = ß('ExtraFäden',max(0,sub(Fäden,MinFäden)));
window.StandardFädenVorlaufMin = ß('StandardFädenVorlaufMin',max(0,sub(MinFäden,ErweiterteFäden)));
window.StandardFädenVorlaufMax = 20;
window.IniErfolge3 = ß('IniErfolge3',max(0,add(erfolge(Ini, GegnerIni),-2)));
window.LufttzanzTreffer = ß('LufttzanzTreffer',mul(IniErfolge3,MinWsk));
window.Nahkampfwaffen = ß('Nahkampfwaffen',add(GES, Rang, Karma));
window.ManövrierenErsterAngriffBonus = ß('ManövrierenErsterAngriffBonus',mul(erfolge(add(Rang,GES,Karma),GegnerKwsk),2));
window.KampfsinnErsterAngriffBonus = ß('KampfsinnErsterAngriffBonus',mul(probe(Ini,GegnerIni),erfolge(add(Rang,WAH,Karma),GegnerMwsk),2));
window.Tigersprung = ß('Tigersprung',add(Rang, Karma));
window.Lufttanz = ß('Lufttanz',add(Rang, Karma));
window.Schildschlag = ß('Schildschlag',add(STÄ, Rang, Karma));
window.Waffenschaden = ß('Waffenschaden',add(STÄ, Waffe));
window.Hammerschlag = ß('Hammerschlag',add(Rang, Karma));
window.MagischeMarkierung = ß('MagischeMarkierung',mul(2,erfolge(add(WAH, Rang, Karma),sub(GegnerMwsk,5))));
window.Blattschuss = ß('Blattschuss',mul(Rang, Karma));
window.Projektilwaffen = ß('Projektilwaffen',add(GES, Rang, Karma));
window.Brandpfeil = ß('Waffenschaden',add(Rang, Karma, WIL, Waffe));
window.ZweiterSchuss = ß('ZweiterSchuss',add(Rang, Karma, GES));
window.SchwachstelleErkennen = ß('SchwachstelleErkennen',mul(2,erfolge(add(WAH, Rang, Karma),sub(GegnerMwsk,5))));
window.Verspotten = ß('Verspotten',max(mul(Rang,0.5),probe(add(Rang, Karma, CHA),GegnerSwsk)));
window.Überraschungsschlag = ß('Überraschungsschlag',add(Rang,Karma));
window.Zweitwaffe = ß('Zweitwaffe',add(Rang, Karma, GES));
window.Nachtreten = ß('Nachtreten',add(Rang, Karma, GES));
window.SchwungvollerAngriff = (ersterAngriffStufe) => ß('SchwungvollerAngriff',mul(add(Rang, Karma, GES),erfolge(ersterAngriffStufe,GegnerKwsk)));

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
    //
    // {
    //     Name: "Schwertmeister",
    //     Color: "rgb(170, 200, 90)",
    //     Attribute: [
    //         "GES", "CHA", "STÄ"
    //     ],
    //     Waffe: 6,
    //     inherits: DefaultCharacter,
    //
    //     //                         Kreis ÜA Karma Wirkung
    //     // Nahkampfwaffen          1     0  1     Rang+GES>kWsk
    //     // Kampfsinn               1     1  1     Rang+WAH>mWsk und Ini größer, pro Erfolg +2 erste Angriff
    //     // Tigersprung             1     1  1     +Ini
    //     // Manövrieren             1     1  1     Rang+GES>kWsk pro Erfolg +2 erste Angriff
    //     // Verspotten              1     1  1     Rang+CHA>sWsk pro Rang -1 auf Gegner Proben
    //
    //     // Riposte                 3
    //     // Kobrastoß               5
    //     // Kobrastoß               5
    //
    //     // Überraschungsschlag     1     1  1     Rang+STÄ nur bei Überraschung
    //
    //     // Schwachstelle Erkennen  5     1  1     Rang+WAH>mWsk, Erfolge*2 auf Schaden
    //     // Zweitwaffe              5     1  1     Rang+GES>kWSK
    //     // Karma erster Angriff    5     0  1
    //     // Ini+1                   7     0  0
    //
    //     Kombos: [
    //         {
    //             KomboKreis: 1,
    //             inherits: DefaultKombo,
    //             Kombo: "Nahkampfwaffen + Manövrieren + Kampfsinn + Tigersprung",
    //             Ini: add(GES, Tigersprung),
    //             Überanstrengung: 3,
    //             KarmaVerbrauch: 4,
    //             Angriffe: [
    //                 {
    //                     Art: kWsk,
    //                     Stufe: add(Nahkampfwaffen, ManövrierenErsterAngriffBonus, KampfsinnErsterAngriffBonus),
    //                     Schaden: Waffenschaden,
    //                     Treffer: MinWsk,
    //                 }
    //             ]
    //         },
    //     ]
    // },

    // ///////////////////////////////////////////////////////////////////////
    //
    {
        Name: "Dieb",
        Color: "rgb(150, 90, 150)",
        Attribute: [
            "GES", "WAH", "CHA"
        ],
        Waffe: 5,
        inherits: DefaultCharacter,

        //                           Kreis ÜA Karma Wirkung
        // Nahkampfwaffen            1     0  1     Rang+GES>kWsk
        // Überraschungsschlag       1     1  1     Rang+STÄ nur bei Überraschung
        // Verspotten                1     1  1     Rang+CHA>sWsk pro Rang -1 auf Gegner Proben

        // Schwachstelle Erkennen    5     1  1     Rang+WAH>mWsk, Erfolge*2 auf Schaden
        // Zweitwaffe                5     1  1     Rang+GES>kWSK
        // Karma erster Angriff      5     0  1
        // Ini+1                     7     0  0

        Kombos: [
            {
                KomboKreis: 1,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Verspotten",
                Ini: add(GES),
                Überanstrengung: 1,
                KarmaVerbrauch: 2,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen, Verspotten),
                        Schaden: add(Waffenschaden),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 1,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Verspotten + Überraschungsschlag",
                Ini: add(GES),
                Überanstrengung: 2,
                KarmaVerbrauch: 3,
                AngriffNurErsteRunde: true,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen, Verspotten),
                        Schaden: add(Waffenschaden, Überraschungsschlag),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 5,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Verspotten + Schwachstelle Erkennen + Zweitwaffe",
                Ini: add(GES),
                Überanstrengung: 3,
                KarmaVerbrauch: 4,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen, Verspotten),
                        Schaden: add(Waffenschaden, SchwachstelleErkennen),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Zweitwaffe, Verspotten),
                        Schaden: add(Waffenschaden, SchwachstelleErkennen),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 5,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Verspotten + Schwachstelle Erkennen + Zweitwaffe + Überraschungsschlag + Karma erster Angriff",
                Ini: add(GES),
                Überanstrengung: 4,
                KarmaVerbrauch: 5,
                AngriffNurErsteRunde: true,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen, Verspotten, Karma),
                        Schaden: add(Waffenschaden, SchwachstelleErkennen, Überraschungsschlag),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Zweitwaffe, Verspotten),
                        Schaden: add(Waffenschaden, SchwachstelleErkennen),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 7,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Verspotten + Schwachstelle Erkennen + Zweitwaffe + Ini+1",
                Ini: add(GES,1),
                Überanstrengung: 3,
                KarmaVerbrauch: 4,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen, Verspotten),
                        Schaden: add(Waffenschaden, SchwachstelleErkennen),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Zweitwaffe, Verspotten),
                        Schaden: add(Waffenschaden, SchwachstelleErkennen),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 7,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Verspotten + Schwachstelle Erkennen + Zweitwaffe + Überraschungsschlag + Karma erster Angriff + Ini+1",
                Ini: add(GES,1),
                Überanstrengung: 4,
                KarmaVerbrauch: 5,
                AngriffNurErsteRunde: true,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen, Verspotten, Karma),
                        Schaden: add(Waffenschaden, SchwachstelleErkennen, Überraschungsschlag),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Zweitwaffe, Verspotten),
                        Schaden: add(Waffenschaden, SchwachstelleErkennen),
                        Treffer: MinWsk,
                    }
                ]
            },
        ]
    },

    // ///////////////////////////////////////////////////////////////////////
    //

    {
        Name: "Krieger",
        Color: "rgb(0, 0, 0)",
        Attribute: [
            "GES", "STÄ", "WAH"
        ],
        Waffe: 8,
        inherits: DefaultCharacter,

        //                         Kreis ÜA Karma Wirkung
        // Nahkampfwaffen          1     0  1     Rang+GES>kWsk
        // Manövrieren             1     1  1     Rang+GES>kWsk pro Erfolg +2 erste Angriff
        // Kampfsinn               1     1  1     Rang+WAH>mWsk und Ini größer, pro Erfolg +2 erste Angriff
        // Tigersprung             1     1  1     +Ini
        // Lufttanz                3     2  1     +Ini, +2 Angriff bei >3 Ini-Erfolgen
        // Kampfriten              5     0  0     -1 ÜA
        // Schadenskarma           5     0  1     Karma auf Schaden
        // Schwachstelle Erkennen  5     1  1     Rang+WAH>mWsk, Erfolge*2 auf Schaden

        // Nachtreten              5     1  1     Rang+GES>kWsk => STÄ
        // Schwungvoller Angriff   5     1  1     Rang+GES>kWsk und 1. Angriff mindestens 1 zus. Erfolg

        // Hammerschlag            7     1  1     Rang auf Schaden
        // Zweiter Angriff         8     2  1     Rang+GES>kWsk

        // Zweitwaffe & Schildschlag wird ignoriert, da 2-Händer-Waffe angenommen wird, welche als Kombi mehr schaden macht

        Kombos: [
            {
                KomboKreis: 1,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Manövrieren + Kampfsinn + Tigersprung",
                Ini: add(GES, Tigersprung),
                Überanstrengung: 3,
                KarmaVerbrauch: 4,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen, ManövrierenErsterAngriffBonus, KampfsinnErsterAngriffBonus),
                        Schaden: Waffenschaden,
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 3,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Manövrieren + Kampfsinn + Tigersprung + Lufttanz",
                Ini: add(GES, Tigersprung, Lufttanz),
                Überanstrengung: 5,
                KarmaVerbrauch: 5,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen, ManövrierenErsterAngriffBonus, KampfsinnErsterAngriffBonus),
                        Schaden: Waffenschaden,
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen),
                        Schaden: Waffenschaden,
                        Treffer: LufttzanzTreffer,
                    }
                ]
            },
            {
                KomboKreis: 5,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Manövrieren + Kampfsinn + Tigersprung + Lufttanz + Kampfriten + Schadenskarma + Schwachstelle Erkennen + Schwungvoller Angriff + Nachtreten",
                Ini: add(GES, Tigersprung, Lufttanz),
                Überanstrengung: 8,
                KarmaVerbrauch: 12,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen, ManövrierenErsterAngriffBonus, KampfsinnErsterAngriffBonus),
                        Schaden: add(Waffenschaden, Karma, SchwachstelleErkennen),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: SchwungvollerAngriff(add(Nahkampfwaffen, ManövrierenErsterAngriffBonus, KampfsinnErsterAngriffBonus)),
                        Schaden: add(Waffenschaden, Karma, SchwachstelleErkennen),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen),
                        Schaden: add(Waffenschaden, Karma, SchwachstelleErkennen),
                        Treffer: LufttzanzTreffer,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Nachtreten),
                        Schaden: add(STÄ, Karma, SchwachstelleErkennen),
                        Treffer: MinWsk,
                    },
                ]
            },
            {
                KomboKreis: 7,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Manövrieren + Kampfsinn + Tigersprung + Lufttanz + Kampfriten + Schadenskarma + Schwachstelle Erkennen + Schwungvoller Angriff + Nachtreten + Hammerschlag",
                Ini: add(GES, Tigersprung, Lufttanz),
                Überanstrengung: 11,
                KarmaVerbrauch: 15,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen, ManövrierenErsterAngriffBonus, KampfsinnErsterAngriffBonus),
                        Schaden: add(Waffenschaden, Karma, Hammerschlag, SchwachstelleErkennen),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: SchwungvollerAngriff(add(Nahkampfwaffen, ManövrierenErsterAngriffBonus, KampfsinnErsterAngriffBonus)),
                        Schaden: add(Waffenschaden, Karma, Hammerschlag, SchwachstelleErkennen),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen),
                        Schaden: add(Waffenschaden, Karma, Hammerschlag, SchwachstelleErkennen),
                        Treffer: LufttzanzTreffer,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Nachtreten),
                        Schaden: add(STÄ, Karma, SchwachstelleErkennen),
                        Treffer: MinWsk,
                    },
                ]
            },
            {
                KomboKreis: 8,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Manövrieren + Kampfsinn + Tigersprung + Lufttanz + Kampfriten + Schadenskarma + Schwachstelle Erkennen + Schwungvoller Angriff + Nachtreten + Hammerschlag + Zweiter Angriff",
                Ini: add(GES, Tigersprung, Lufttanz),
                Überanstrengung: 15,
                KarmaVerbrauch: 18,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen, ManövrierenErsterAngriffBonus, KampfsinnErsterAngriffBonus),
                        Schaden: add(Waffenschaden, Karma, Hammerschlag, SchwachstelleErkennen),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: SchwungvollerAngriff(add(Nahkampfwaffen, ManövrierenErsterAngriffBonus, KampfsinnErsterAngriffBonus)),
                        Schaden: add(Waffenschaden, Karma, Hammerschlag, SchwachstelleErkennen),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen),
                        Schaden: add(Waffenschaden, Karma, Hammerschlag, SchwachstelleErkennen),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen),
                        Schaden: add(Waffenschaden, Karma, Hammerschlag, SchwachstelleErkennen),
                        Treffer: LufttzanzTreffer,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Nachtreten),
                        Schaden: add(STÄ, Karma, SchwachstelleErkennen),
                        Treffer: MinWsk,
                    },
                ]
            },
        ]
    },

    // ///////////////////////////////////////////////////////////////////////
    //

    {
        Name: "Magier",
        Color: "rgb(90, 243, 243)",
        Attribute: [
            "WAH", "WIL"
        ],
        inherits: DefaultZauberer,
        // Talente:

        // Spruchzauberei (1) 0Ü
        // Erweiterte Matrix (5) -1 Faden
        // Willenstärke (6) 1Ü

        Kombos: [
            {
                KomboKreis: 1,
                Kombo: "Eiserne Hand + Waffe",
                inherits: ZauberKombo,
                Webschwierigkeit: 5,
                MinFäden: 0,
                FixKarmaVerbrauch: 1,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: GES,
                        Schaden: add(STÄ, Waffe, 3, mul(ExtraFäden,2)),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 1,
                Kombo: "Flammenblitz",
                inherits: ZauberKombo,
                Webschwierigkeit: 5,
                MinFäden: 0,
                FixKarmaVerbrauch: 1,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(WAH, Rang, Karma),
                        Schaden: add(WILS, 5, mul(ExtraFäden,2)),
                        Treffer: MinZauberWsk,
                        FolgeRundenAngriffAutomatisch: 1,
                    }
                ]
            },
            {
                KomboKreis: 1,
                Kombo: "Mentaler Dolch",
                inherits: ZauberKombo,
                Webschwierigkeit: 5,
                MinFäden: 0,
                FixKarmaVerbrauch: 1,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(WAH, Rang, Karma),
                        // 1 Runden -2 auf Rüstung => als 0.5 zus. Schaden verrechnet
                        Schaden: add(WILS, 2, mul(ExtraFäden,2), mul(Erfolge,2), 0.5),
                        Treffer: MinZauberWsk,
                    }
                ]
            },
            {
                KomboKreis: 2,
                Kombo: "Vernichtender Wille",
                inherits: ZauberKombo,
                Webschwierigkeit: 6,
                MinFäden: 1,
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
                Kombo: "Astralvisier + Mentaler Dolch",
                inherits: ZauberKombo,
                Webschwierigkeit: 7,
                MinFäden: 0,
                FixKarmaVerbrauch: 1,
                RundenVorlaufMin: 1,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(WAH, Rang, 2, Karma),
                        // 1 Runden -2 auf Rüstung => als 0.5 zus. Schaden verrechnet
                        Schaden: add(WILS, 2, mul(ExtraFäden,2), mul(Erfolge,2), 0.5, 2),
                        Treffer: MinZauberWsk,
                    }
                ]
            },
            {
                KomboKreis: 3,
                Kombo: "Berührung des Gauklers",
                inherits: ZauberKombo,
                Webschwierigkeit: 8,
                MinFäden: 2,
                FixKarmaVerbrauch: 1,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(WAH, Rang, Karma),
                        Schaden: add(WILS, 6, mul(ExtraFäden,2)),
                        Treffer: MinZauberWsk,
                        AnzahlRundenAngriffAlsAktion: add(Rang,1),
                    }
                ]
            },
            {
                KomboKreis: 5,
                Kombo: "Mystischer Schock",
                inherits: ZauberKombo,
                Webschwierigkeit: 9,
                MinFäden: 2,
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
            {
                KomboKreis: 6,
                Kombo: "Zerschmettern",
                inherits: ZauberKombo,
                Webschwierigkeit: 10,
                MinFäden: 3,
                FixKarmaVerbrauch: 1,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(WAH, Rang, Karma),
                        // -4 auf Rüstung => als 2 zus. Schaden verrechnet
                        Schaden: add(WILS, 7, mul(ExtraFäden,2), mul(Erfolge,0.5), 2),
                        Treffer: MinZauberWsk,
                    }
                ]
            },
            {
                KomboKreis: 8,
                Kombo: "Astrale Katastrophe",
                inherits: ZauberKombo,
                Webschwierigkeit: 12,
                MinFäden: 2,
                FixKarmaVerbrauch: 1,
                Angriffe: [
                    {
                        Art: mWsk,
                        Stufe: add(WAH, Rang, Karma),
                        // -2 auf Aktionsproben => als 1 zus. Schaden verrechnet
                        Schaden: add(WILS, 5, mul(ExtraFäden,2), mul(Erfolge,2), 1),
                        Treffer: MinZauberWsk,
                    }
                ]
            },
            {
                KomboKreis: 8,
                Kombo: "Astralvisier + Astrale Katastrophe",
                inherits: ZauberKombo,
                Webschwierigkeit: 12,
                MinFäden: 3,
                FixKarmaVerbrauch: 1,
                Angriffe: [
                    {
                        Art: mWsk,
                        Stufe: add(WAH, Rang, 2, Karma),
                        // -2 auf Aktionsproben => als 1 zus. Schaden verrechnet
                        Schaden: add(WILS, 5, mul(ExtraFäden,2), mul(Erfolge,2), 1, 2),
                        Treffer: MinZauberWsk,
                    }
                ]
            },
            {
                KomboKreis: 8,
                Kombo: "Astralvisier + Zerquetschen",
                inherits: ZauberKombo,
                Webschwierigkeit: 12,
                MinFäden: 3,
                FixKarmaVerbrauch: 1,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(WAH, Rang, 2, Karma),
                        Schaden: add(WILS, 3, mul(ExtraFäden,2), 2),
                        Treffer: MinZauberWsk,
                        FolgeRundenAngriffAutomatisch: Rang,
                    }
                ]
            },
        ]
    },


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
                        Erfolge: add(TrefferErfolge,1),
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
                        Erfolge: add(TrefferErfolge,1),
                    }
                ]
            },
            {
                KomboKreis: 6,
                Kombo: "Erdstab + Feuergewebe + Steinregen",
                inherits: ZauberKombo,
                Webschwierigkeit: 10,
                MinFäden: 4,
                FixKarmaVerbrauch: 3,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(WAH, Rang, Karma),
                        Schaden: add(WILS, 5, WILS, 2, mul(ExtraFäden,2)),
                        Treffer: MinZauberWsk,
                        Erfolge: add(TrefferErfolge,1),
                        FolgeRundenAngriffAutomatisch: Rang,
                    }
                ]
            },
            {
                KomboKreis: 6,
                Kombo: "Erdstab + Umhang des Feuerplünderers + Steinregen",
                inherits: ZauberKombo,
                Webschwierigkeit: 10,
                MinFäden: 4,
                FixKarmaVerbrauch: 3,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(WAH, Rang, Karma),
                        Schaden: add(WILS, 5, mul(2, add(Kreis, 2)), mul(ExtraFäden,2)),
                        Treffer: MinZauberWsk,
                        Erfolge: add(TrefferErfolge,1),
                        FolgeRundenAngriffAutomatisch: Rang,
                    }
                ]
            },
            {
                KomboKreis: 7,
                Kombo: "Erdstab + Todesregen",
                inherits: ZauberKombo,
                Webschwierigkeit: 11,
                MinFäden: 4,
                FixKarmaVerbrauch: 3,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(WAH, Rang, Karma),
                        Schaden: add(WILS, 8, mul(ExtraFäden,2)),
                        Treffer: MinZauberWsk,
                        Erfolge: add(TrefferErfolge,1),
                        FolgeRundenAngriffAutomatisch: Rang,
                    }
                ]
            },
        ]
    },


    ///////////////////////////////////////////////////////////////////////

    {
        Name: "Schütze",
        Color: "rgb(255, 0, 255)",
        Attribute: [
            "GES", "STÄ", "WAH", "WIL"
        ],
        Waffe: 5,
        inherits: DefaultCharacter,

        //                           Kreis ÜA Karma Wirkung
        // Projektilwaffen           1     0  1     Rang+GES>kWsk Angriff
        // Blattschuss               1     2  Rang  Angriff+Rang*Karma
        // Magische Markierung       1     1  1     Rang+WAH>mWsk entsprechend Erfolge +2 auf Angriffe
        // Kampfsinn                 3     1  1     Rang+WAH>mWsk und Ini größer, pro Erfolg +2 erste Angriff
        // Ini + Karma               3     0  1     Ini+Karma
        // Weitschuss                4
        // Schwachstelle Erkennen    5     1  1     Rang+WAH>mWsk, Erfolge*2 auf Schaden
        // Tigersprung               5     1  1     +Ini
        // Schadenskarma             5     0  1     Karma auf Schaden
        // Gezielter Querschläger    6     1  1     Boni gegen Deckung...
        // Ini +1                    7     0  0     Ini+1
        // Brandpfeil                7     1  1     Rang+WIL erstetzt STÄ
        // Zweiter Schuss            8     2  1     Rang+GES>kWsk Angriff


        Kombos: [
            {
                KomboKreis: 1,
                Kombo: "Projektilwaffen + Blattschuss + Magische Markierung",
                Überanstrengung: 3,
                KarmaVerbrauch: add(2,Rang),
                inherits: DefaultKombo,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Projektilwaffen, Blattschuss, MagischeMarkierung),
                        Schaden: Waffenschaden,
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 3,
                Kombo: "Projektilwaffen + Blattschuss + Magische Markierung + Kampfsinn + Karma auf Ini",
                Überanstrengung: 4,
                KarmaVerbrauch: add(4,Rang),
                Ini: add(GES,Karma),
                inherits: DefaultKombo,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Projektilwaffen, Blattschuss, MagischeMarkierung, KampfsinnErsterAngriffBonus),
                        Schaden: Waffenschaden,
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 5,
                Kombo: "Projektilwaffen + Blattschuss + Magische Markierung + Kampfsinn + Karma auf Ini + Tigersprung + Schadenskarma + Schwachstelle Erkennen",
                Überanstrengung: 5,
                KarmaVerbrauch: add(6,Rang),
                Ini: add(GES,Rang,Karma,Karma),
                inherits: DefaultKombo,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Projektilwaffen, Blattschuss, MagischeMarkierung, KampfsinnErsterAngriffBonus),
                        Schaden: add(Waffenschaden,Karma,SchwachstelleErkennen),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 7,
                Kombo: "Projektilwaffen + Blattschuss + Magische Markierung + Kampfsinn + Karma auf Ini + Tigersprung + Schadenskarma + Schwachstelle Erkennen + Brandpfeil + Ini+1",
                Überanstrengung: 6,
                KarmaVerbrauch: add(7,Rang),
                Ini: add(GES,Rang,Karma,Karma,1),
                inherits: DefaultKombo,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Projektilwaffen, Blattschuss, MagischeMarkierung, KampfsinnErsterAngriffBonus),
                        Schaden: add(Brandpfeil,Karma,SchwachstelleErkennen),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 8,
                Kombo: "Projektilwaffen + Blattschuss + Magische Markierung + Kampfsinn + Karma auf Ini + Tigersprung + Schadenskarma + Schwachstelle Erkennen + Brandpfeil + Ini+1 + Zweiter Schuss",
                Überanstrengung: 12,
                KarmaVerbrauch: add(9,mul(2,Rang),1),
                Ini: add(GES,Rang,Karma,Karma,1),
                inherits: DefaultKombo,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Projektilwaffen, Blattschuss, MagischeMarkierung, KampfsinnErsterAngriffBonus),
                        Schaden: add(Brandpfeil,Karma,SchwachstelleErkennen),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(ZweiterSchuss, Blattschuss, MagischeMarkierung),
                        Schaden: add(Brandpfeil,Karma,SchwachstelleErkennen),
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
                        Stufe: add(GES, Rang, Karma, mul(2,erfolge(Ini,GegnerIni))),
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
                        Stufe: add(GES, Rang, Karma, mul(div(2,maximaleAngriffe),erfolge(Ini,GegnerIni))),
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
];
