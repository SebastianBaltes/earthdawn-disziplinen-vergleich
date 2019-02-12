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
window.GegnerAngriff = val('GegnerAngriff');
window.Art = val("Art");
window.Stufe = val("Stufe");
window.Schaden = val("Schaden");
window.Treffer = val("Treffer");
window.Wiederholungen = val("Wiederholungen");
window.Überanstrengung = val("Überanstrengung");
window.GegnerWsk = ß('GegnerWsk',property(val("GegnerWsk"), val('Art')));
window.GegnerKwsk = ß('GegnerKwsk',property(val("GegnerWsk"), kWsk));
window.GegnerMwsk = ß('GegnerMwsk',property(val("GegnerWsk"), mWsk));
window.GegnerSwsk = ß('GegnerSwsk',property(val("GegnerWsk"), sWsk));
window.GegnerRüstung = ß('GegnerRüstung',property(val("GegnerRüstung"), val('Art')));
window.MixturKreis = val("MixturKreis");
window.Fäden = val("Fäden");
window.Erfolge = val("Erfolge");
window.MinFäden = val("MinFäden");
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
window.AlchmTreffer = ß('AlchmTreffer',sub(1, Fehlschlag));
window.AnzahlRundenAngriffAlsAktion = val("AnzahlRundenAngriffAlsAktion");
window.FolgeRundenAngriffAutomatisch = val("FolgeRundenAngriffAutomatisch");
window.AngriffNurErsteRunde = val("AngriffNurErsteRunde");

window.AngriffGegnerAnzahl = val('AngriffGegnerAnzahl');
window.AngriffRadius = val('AngriffRadius');
window.GegnerAnzahl = val('GegnerAnzahl');
window.GegnerVerteiltRadius = val('GegnerVerteiltRadius');
window.kreisfläche = (r)=>ß('kreisfläche',mul(r,r,Math.PI));
window.GegnerAnzahlProQM = (r)=>ß('GegnerAnzahlProQM',div(GegnerAnzahl,kreisfläche(GegnerVerteiltRadius)));
window.Flächenschaden = ß('Flächenschaden',mul(kreisfläche(AngriffRadius),GegnerAnzahlProQM));
window.AngriffGegnerAnzahlSafe = ß('AngriffGegnerAnzahlSafe',_floor(max(0,min(GegnerAnzahl,AngriffGegnerAnzahl))));


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
            AngriffGegnerAnzahlSafe,
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
window.ExtraFäden = ß('ExtraFäden',max(0,min(_floor(add(1,div(sub(Kreis,1),4))),sub(Fäden,MinFäden))));
window.StandardFädenVorlaufMin = ß('StandardFädenVorlaufMin',max(0,sub(MinFäden,ErweiterteFäden)));
window.StandardFädenVorlaufMax = 20;
window.IniErfolge3 = ß('IniErfolge3',max(0,min(1,add(erfolge(Ini, GegnerIni),-2))));
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
window.SchwungvollerAngriff = (ersterAngriffStufe) => ß('SchwungvollerAngriff',mul(add(Rang, Karma, GES),probe(ersterAngriffStufe,add(GegnerKwsk,5))));
window.Riposte = ß('Riposte',add(Rang, Karma, GES));
window.RiposteTreffer = ß('RiposteTreffer',max(MinWsk,probe(Stufe, GegnerAngriff)));
window.Kobrastoss = ß('Kobrastoss',mul(2,erfolge(Ini,sub(GegnerIni,5))));
window.Kampfgebrüll = ß('Kampfgebrüll',mul(2,erfolge(add(Rang,Karma,CHA),sub(GegnerSwsk,5))));
window.Schlachtruf = ß('Schlachtruf',mul(1,erfolge(add(Rang,Karma,CHA),sub(GegnerSwsk,5))));
window.Schildschlagschaden = ß('Schildschlagschaden',add(Rang,Karma,STÄ));
window.AggressiverAngriff = 3;
window.Schmetterschlag = ß('Schmetterschlag',add(Rang,Karma));
window.ReittierSchadensstufe = val("ReittierSchadensstufe");
window.ReittierSWsk = val("ReittierSWsk");
window.SturmangriffSchaden = ß('SturmangriffSchaden',add(Rang,Karma,ReittierSchadensstufe));
window.TiergefährteVerbessernSchaden = ß('TiergefährteVerbessernSchaden',mul(1,erfolge(add(Rang,Karma,WIL),sub(ReittierSWsk,5))));
window.FurchterregenderSturmangriff = ß('FurchterregenderSturmangriff',mul(1,erfolge(add(Rang,Karma,CHA),sub(GegnerSwsk,5))));
window.Wurfwaffen = ß('Wurfwaffen',add(Rang, Karma, GES));
window.Mixturmagie = ß('Mixturmagie',add(Rang, Karma));

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
    Fehlschlag: 0,
    AngriffGegnerAnzahl: 1,
    AngriffRadius: 0,
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
    AnzahlRundenAngriffAlsAktion: 1,
    FolgeRundenAngriffAutomatisch: 0,
};

var AlchemistenKombo = {
    inherits: DefaultKombo,
    Fehlschlag: AlchmFehlschlag,
}

var Passionshonig = 2;
var Brandkiesel = 12;
var Splitterbombe = 12;
var Königswasser = 20;
var Kampfsaft = 3;
var Alkahest = 24;

var Disziplinen = [

    // Es werden die besten Talentoptionen für Angriff + Schaden gewählt, jeweils mit maximalem Karma und
    // nur gegen einen Einzelgegner. Immobilität oder reine Wunden werden nicht berücksichtigt, weil man das nicht
    // so einfach auf "Schaden", den hier relevanten Vergleichswert, runterrechnen kann (für einen echten Kampf
    // ist gerade Immobilität natürlich extrem mächtig). Auch Mali auf den Gegner wie durch Verspotten werden
    // nicht voll angerechnet.

    // ///////////////////////////////////////////////////////////////////////
    //

    {
        Name: "Illusionist",
        Color: "rgb(210, 143, 80)",
        Attribute: [
            "WAH", "WIL", "CHA"
        ],
        inherits: DefaultZauberer,
        // Talente:

        // Spruchzauberei (1) 0Ü
        // Erweiterte Matrix (5) -1 Faden
        // Willenstärke (6) 1Ü
        // Verspotten (1)
        // Wirkung (5) + Karma => +2 Stufen

        Kombos: [
            {
                KomboKreis: 1,
                Kombo: "Illusionärer Blitz",
                inherits: ZauberKombo,
                Webschwierigkeit: 5,
                MinFäden: 0,
                FixKarmaVerbrauch: 1,
                Angriffe: [
                    {
                        Art: mWsk,
                        Stufe: add(Rang,Karma,WAH,Verspotten),
                        Schaden: add(WILS, 4, mul(ExtraFäden,2)),
                        Treffer: MinZauberWsk,
                    }
                ]
            },
            {
                KomboKreis: 2,
                Kombo: "Phantomflamme",
                inherits: ZauberKombo,
                Webschwierigkeit: 6,
                MinFäden: 1,
                FixKarmaVerbrauch: 1,
                Angriffe: [
                    {

                        Art: kWsk,
                        Stufe: add(Rang,Karma,WAH,Verspotten),
                        Schaden: add(WILS, 6, mul(ExtraFäden,2), mul(Erfolge,2)),
                        Treffer: MinZauberWsk,
                    }
                ]
            },
            {
                KomboKreis: 4,
                Kombo: "Blitzschlag",
                inherits: ZauberKombo,
                Webschwierigkeit: 8,
                MinFäden: 1,
                FixKarmaVerbrauch: 1,
                Angriffe: [
                    {

                        Art: kWsk,
                        Stufe: add(Rang,Karma,WAH,Verspotten),
                        Schaden: add(WILS, 7, mul(ExtraFäden,2)),
                        Treffer: MinZauberWsk,
                    }
                ]
            },
            {
                KomboKreis: 5,
                Kombo: "Phantomfeuerball",
                inherits: ZauberKombo,
                Webschwierigkeit: 9,
                MinFäden: 1,
                FixKarmaVerbrauch: 1,
                Angriffe: [
                    {

                        Art: kWsk,
                        Stufe: add(Rang,Karma,WAH,Verspotten),
                        Schaden: add(WILS, 5, mul(ExtraFäden,2), mul(Erfolge,2), 1, 2),
                        Treffer: MinZauberWsk,
                    }
                ]
            },
            {
                KomboKreis: 7,
                Kombo: "Phantomfeuerball",
                inherits: ZauberKombo,
                Webschwierigkeit: 12,
                MinFäden: 4,
                FixKarmaVerbrauch: 1,
                Angriffe: [
                    {

                        Art: mWsk,
                        Stufe: add(Rang,Karma,WAH,Verspotten),
                        Schaden: add(Kreis, 8, mul(ExtraFäden,2), mul(Erfolge,2), 2),
                        Treffer: MinZauberWsk,
                    }
                ]
            },
        ],
    },

    // ///////////////////////////////////////////////////////////////////////
    //
    {
        Name: "Alchemist",
        Color: "rgb(250, 0, 0)",
        Attribute: [
            "GES", "WAH", "WIL"
        ],
        inherits: DefaultCharacter,
        Kombos: [
            {
                KomboKreis: 1,
                inherits: DefaultKombo,
                Kombo: "Wurfwaffen + Falkenklaue",
                Ini: add(GES),
                Überanstrengung: 1,
                KarmaVerbrauch: 2,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Wurfwaffen),
                        Schaden: add(4,STÄ),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 1,
                MixturKreis: 1,
                inherits: AlchemistenKombo,
                Kombo: "Wurfwaffen + Brandkiesel",
                Ini: GES,
                Überanstrengung: 1,
                KarmaVerbrauch: 2,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: mul(AlchmTreffer, Wurfwaffen),
                        Schaden: add(Mixturmagie,Brandkiesel),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 3,
                MixturKreis: 3,
                inherits: AlchemistenKombo,
                Kombo: "Wurfwaffen + Splitterbombe",
                Ini: GES,
                Überanstrengung: 1,
                KarmaVerbrauch: 2,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: mul(AlchmTreffer, Wurfwaffen),
                        Schaden: add(Mixturmagie,Splitterbombe),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 4,
                MixturKreis: 4,
                inherits: AlchemistenKombo,
                Kombo: "Wurfwaffen + Königswasser",
                Ini: GES,
                Überanstrengung: 1,
                KarmaVerbrauch: 2,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: mul(AlchmTreffer, Wurfwaffen),
                        Schaden: add(Mixturmagie, Königswasser),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 5,
                MixturKreis: 5,
                inherits: AlchemistenKombo,
                Kombo: "Wurfwaffen + Königswasser + Passionshonig",
                Ini: GES,
                Überanstrengung: 1,
                KarmaVerbrauch: 2,
                Karma: add(GrundKarma,Passionshonig),
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: mul(AlchmTreffer, Wurfwaffen),
                        Schaden: add(Mixturmagie,Königswasser),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 6,
                MixturKreis: 6,
                inherits: AlchemistenKombo,
                Kombo: "Wurfwaffen + Königswasser + Passionshonig + Kampfsaft",
                Ini: add(GES,3),
                Überanstrengung: 1,
                KarmaVerbrauch: 2,
                Karma: add(GrundKarma,Passionshonig),
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: mul(AlchmTreffer, Wurfwaffen,Kampfsaft),
                        Schaden: add(Mixturmagie,Königswasser,Kampfsaft),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 7,
                MixturKreis: 6,
                inherits: AlchemistenKombo,
                Kombo: "Wurfwaffen + Passionshonig + Kampfsaft + Alkahest",
                Ini: add(GES,3),
                Überanstrengung: 1,
                KarmaVerbrauch: 2,
                Karma: add(GrundKarma,Passionshonig),
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: mul(AlchmTreffer, Wurfwaffen,Kampfsaft),
                        Schaden: add(Mixturmagie,Alkahest,Kampfsaft),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: nth(later("Sprengfass"),[1000,5]),
                MixturKreis: 5,
                inherits: AlchemistenKombo,
                Kombo: "Sprengfass",
                Ini: GES,
                Überanstrengung: 0,
                KarmaVerbrauch: 0,
                AngriffNurErsteRunde: true,
                Fehlschlag: nth(sub(Kreis,MixturKreis),[0.95,0.75,0.45,0.05,0]),
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: 0,
                        Schaden: 256,
                        Treffer: AlchmTreffer,
                    }
                ]
            },
        ]
    },

    // {
    //     Name: "Alchemist_ohne_Fehlschlag",
    //     Color: "rgb(250, 250, 0)",
    //     Attribute: [
    //         "GES", "WAH", "WIL"
    //     ],
    //     inherits: DefaultCharacter,
    //     Kombos: [
    //         {
    //             KomboKreis: 1,
    //             MixturKreis: 1,
    //             inherits: DefaultKombo,
    //             Kombo: "Wurfwaffen + Brandkiesel",
    //             Ini: GES,
    //             Überanstrengung: 0,
    //             KarmaVerbrauch: 1,
    //             Angriffe: [
    //                 {
    //                     Art: kWsk,
    //                     Stufe: mul(Wurfwaffen),
    //                     Schaden: add(Mixturmagie,10),
    //                     Treffer: MinWsk,
    //                 }
    //             ]
    //         },
    //     ]
    // },


    // ///////////////////////////////////////////////////////////////////////
    //
    {
        Name: "Waffenschmied",
        Color: "rgb(64,137,135)",
        Attribute: [
            "GES", "STÄ", "WAH", "WIL"
        ],
        Waffe: 8,
        inherits: DefaultCharacter,

        //                         Kreis ÜA Karma Wirkung
        // Nahkampfwaffen          1     0  1     Rang+GES>kWsk
        // Waffe schmieden         1     0  1     Rang+WAH, max. +Rang auf Waffenschaden
        // Schildschlag*           2     1  1     Rang+STÄ+Schild als Schadensprobe

        // Kampfgebrüll*           5     1  1     Rang+CHA>sWsk pro Erfolg -2 auf Gegner-Proben
        // Schadenskarma           5     0  1
        // Schwachstelle Erkennen  7     1  1     Rang+WAH>mWsk, Erfolge*2 auf Schaden

        // Schildschlag macht aufgrund des Aufschmiedens der Waffe keinen Sinn...

        Kombos: [
            {
                KomboKreis: 1,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Waffe schmieden",
                Ini: add(GES),
                Überanstrengung: 0,
                KarmaVerbrauch: 1,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen),
                        Schaden: add(Waffenschaden,Rang),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 1,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Schildschlag",
                Ini: add(GES),
                Überanstrengung: 1,
                KarmaVerbrauch: 2,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen),
                        Schaden: add(Schildschlag),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 1,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Waffe schmieden + Kampfgebrüll + Schadenskarma",
                Ini: add(GES),
                Überanstrengung: 1,
                KarmaVerbrauch: 3,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen,Kampfgebrüll),
                        Schaden: add(Waffenschaden,Rang,Karma),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 1,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Waffe schmieden + Kampfgebrüll + Schadenskarma",
                Ini: add(GES),
                Überanstrengung: 2,
                KarmaVerbrauch: 4,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen,Kampfgebrüll),
                        Schaden: add(Waffenschaden,Rang,Karma, SchwachstelleErkennen),
                        Treffer: MinWsk,
                    }
                ]
            },
        ]
    },


    // ///////////////////////////////////////////////////////////////////////
    //
    {
        Name: "Troubadour",
        Color: "rgb(180,9,70)",
        Attribute: [
            "CHA", "WAH", "GES"
        ],
        Waffe: 5,
        inherits: DefaultCharacter,

        //                           Kreis ÜA Karma Wirkung
        // Nahkampfwaffen*           1     0  1     Rang+GES>kWsk
        // Verspotten*               2     1  1     Rang+CHA>sWsk pro Rang -1 auf Gegner Proben

        Kombos: [
            {
                KomboKreis: 1,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen",
                Ini: add(GES),
                Überanstrengung: 0,
                KarmaVerbrauch: 1,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen),
                        Schaden: add(Waffenschaden),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 2,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Verspotten",
                Ini: add(GES),
                Überanstrengung: 0,
                KarmaVerbrauch: 2,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen,Verspotten),
                        Schaden: add(Waffenschaden),
                        Treffer: MinWsk,
                    }
                ]
            },
        ]
    },


    // ///////////////////////////////////////////////////////////////////////
    //
    {
        Name: "Steppenreiter",
        Color: "rgb(148, 105, 60)",
        Attribute: [
            "GES", "STÄ", "CHA"
        ],
        Waffe: 8, // Helebarde kann beritten einhändig geführt werden
        ReittierSchadensstufe: 10, // eine Düre hat beim Sturmangriff Stärkestufe 10
        ReittierSWsk: 12, // Düre
        inherits: DefaultCharacter,

        //                                Kreis ÜA Karma Wirkung
        // Nahkampfwaffen                 1     0  1     Rang+GES>kWsk
        // Sturmangriff                   1     0  1     Rang+Karma auf Schadensprobe bei Sturmangriff, + Reittier-Stärkestufe
        // Kampfgebrüll*                  1     1  1     Rang+CHA>sWsk pro Erfolg -2 auf Gegner-Proben
        // Sturmangriff+Karma             3
        // Tiergefährte verbessern        3              Rang+WIL>mWsk Tiergefährte, pro Erfolg +1 auf Reittier (Schaden)
        // Schadenskarma                  5     0  1
        // Furchterregender Sturmangriff* 5     2  1     Rang+CHA>sWsk pro Erfolg Gegner -1 auf Probe

        // Reittierangriff*               6     1  1     Reittierangriff + Rang
        // Schwenkangriff                 6     1  1     Rang+GES statt Nahkampfwaffenprobe, dafür weniger Anlauf

        // Doppelter Sturmangriff         8     1  1     Rang+GES>kWsk als zweiter Angriff


        Kombos: [
            {
                KomboKreis: 1,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Sturmangriff + Kampfgebrüll",
                Ini: add(GES),
                Überanstrengung: 1,
                KarmaVerbrauch: 3,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen,Kampfgebrüll),
                        Schaden: add(Waffenschaden,SturmangriffSchaden),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 3,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Sturmangriff (+Karma) + Kampfgebrüll + Tiergefährte verbessern (Schaden)",
                Ini: add(GES),
                Überanstrengung: 1,
                KarmaVerbrauch: 4,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen,Kampfgebrüll),
                        Schaden: add(Waffenschaden,SturmangriffSchaden,Karma,TiergefährteVerbessernSchaden),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 5,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Sturmangriff (+Karma) + Kampfgebrüll + Tiergefährte verbessern (Schaden) + Schadenskarma + Furchterregender Sturmangriff",
                Ini: add(GES),
                Überanstrengung: 3,
                KarmaVerbrauch: 6,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen,Kampfgebrüll,FurchterregenderSturmangriff),
                        Schaden: add(Waffenschaden,SturmangriffSchaden,Karma,TiergefährteVerbessernSchaden,Karma),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 8,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Sturmangriff (+Karma) + Kampfgebrüll + Tiergefährte verbessern (Schaden) + Schadenskarma + Furchterregender Sturmangriff + Doppelter Sturmangriff",
                Ini: add(GES),
                Überanstrengung: 6,
                KarmaVerbrauch: 12,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen,Kampfgebrüll,FurchterregenderSturmangriff),
                        Schaden: add(Waffenschaden,SturmangriffSchaden,Karma,TiergefährteVerbessernSchaden,Karma),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Rang,Karma,GES,Kampfgebrüll,FurchterregenderSturmangriff),
                        Schaden: add(Waffenschaden,SturmangriffSchaden,Karma,TiergefährteVerbessernSchaden,Karma),
                        Treffer: MinWsk,
                    }
                ]
            },
        ],
    },

    // ///////////////////////////////////////////////////////////////////////
    //
    {
        Name: "Luftsegler",
        Color: "rgb(200, 255, 210)",
        Attribute: [
            "GES", "STÄ", "WIL", "CHA"
        ],
        Waffe: 7,
        inherits: DefaultCharacter,

        //                         Kreis ÜA Karma Wirkung
        // Nahkampfwaffen          1     0  1     Rang+GES>kWsk
        // Manövrieren*            1     1  1     Rang+GES>kWsk pro Erfolg +2 erste Angriff
        // Verspotten*             1     1  1     Rang+CHA>sWsk pro Rang -1 auf Gegner Proben

        // Zweitwaffe*             5     1  1     Rang+GES>kWSK
        // Überraschungsschlag*    6     1  1     Rang+STÄ nur bei Überraschung
        // Schlachtruf*            7     1  1     Rang+CHA>sWsk pro Erfolg -1 auf Gegner-Proben

        Kombos: [
            {
                KomboKreis: 1,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Manövrieren + Verspotten",
                Ini: add(GES),
                Überanstrengung: 2,
                KarmaVerbrauch: 3,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen,ManövrierenErsterAngriffBonus,Verspotten),
                        Schaden: add(Waffenschaden),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 5,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Manövrieren + Verspotten + Zweitwaffe",
                Ini: add(GES),
                Überanstrengung: 3,
                KarmaVerbrauch: 4,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen,ManövrierenErsterAngriffBonus,Verspotten),
                        Schaden: add(Waffenschaden),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Zweitwaffe, Verspotten),
                        Schaden: add(Waffenschaden),
                        Treffer: MinWsk,
                    },
                ]
            },
            {
                KomboKreis: 6,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Manövrieren + Verspotten + Zweitwaffe + Überraschungsschlag",
                Ini: add(GES),
                Überanstrengung: 5,
                KarmaVerbrauch: 6,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen,ManövrierenErsterAngriffBonus,Verspotten),
                        Schaden: add(Waffenschaden, Überraschungsschlag),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Zweitwaffe, Verspotten),
                        Schaden: add(Waffenschaden),
                        Treffer: MinWsk,
                    },
                ]
            },
            {
                KomboKreis: 7,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Manövrieren + Verspotten + Zweitwaffe + Überraschungsschlag + Schlachtruf",
                Ini: add(GES),
                Überanstrengung: 6,
                KarmaVerbrauch: 7,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen,ManövrierenErsterAngriffBonus,Verspotten,Schlachtruf),
                        Schaden: add(Waffenschaden, Überraschungsschlag),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Zweitwaffe, Verspotten,Schlachtruf),
                        Schaden: add(Waffenschaden),
                        Treffer: MinWsk,
                    },
                ]
            },
        ],
    },

    // ///////////////////////////////////////////////////////////////////////
    //
    {
        Name: "Luftpirat",
        Color: "rgb(170, 200, 255)",
        Attribute: [
            "GES", "STÄ", "CHA"
        ],
        Waffe: 7,
        inherits: DefaultCharacter,

        //                         Kreis ÜA Karma Wirkung
        // Nahkampfwaffen          1     0  1     Rang+GES>kWsk
        // Kampfgebrüll            1     1  1     Rang+CHA>sWsk pro Erfolg -2 auf Gegner-Proben
        // Schildschlag*           2     1  1     Rang+STÄ+Schild als Schadensprobe

        // Schlachtruf             5     1  1     Rang+CHA>sWsk pro Erfolg -1 auf Gegner-Proben
        // Schadenskarma           5     0  1
        // Aggressiver Angriff     5     0  0     +3 auf Angriff/Schaden, -3 auf k/m Wsk
        // Zweitwaffe*             5     1  1     Rang+GES, zus. Angriff

        // Nachtreten*             6     1  1     Rang+GES>kWsk => STÄ
        // Tigersprung*            7     1  1     +Ini
        // Schmetterschlag         7     1  1     Rang+STÄ falls höhere Position für 1. Angriff
        // Weitsprung              2     1  1     Rang+GES

        // Schwungvoller Angriff   8     1  1     Rang+GES>kWsk und 1. Angriff mindestens 1 zus. Erfolg

        // Schildschlag lohnt sich theoretisch erst ab Kreis 7, aber durch andere Schadensboni ist Waffeneinsatz stets besser

        Kombos: [
            {
                KomboKreis: 1,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Kampfgebrüll",
                Ini: add(GES),
                Überanstrengung: 1,
                KarmaVerbrauch: 2,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen,Kampfgebrüll),
                        Schaden: add(Waffenschaden),
                        Treffer: MinWsk,
                    },
                ]
            },
            {
                KomboKreis: 2,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Kampfgebrüll + Schildschlag",
                Ini: add(GES),
                Überanstrengung: 2,
                KarmaVerbrauch: 3,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen,Kampfgebrüll),
                        Schaden: add(Schildschlagschaden),
                        Treffer: MinWsk,
                    },
                ]
            },
            {
                KomboKreis: 5,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Kampfgebrüll + Schlachtruf + Schadenskarma + Aggressiver Angriff + Zweitwaffe",
                Ini: add(GES),
                Überanstrengung: 3,
                KarmaVerbrauch: 5,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen,Kampfgebrüll,Schlachtruf,AggressiverAngriff),
                        Schaden: add(Waffenschaden,AggressiverAngriff),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Zweitwaffe,Kampfgebrüll,Schlachtruf,AggressiverAngriff),
                        Schaden: add(Waffenschaden,AggressiverAngriff),
                        Treffer: MinWsk,
                    },
                ]
            },
            {
                KomboKreis: 6,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Kampfgebrüll + Schlachtruf + Schadenskarma + Aggressiver Angriff + Zweitwaffe + Nachtreten",
                Ini: add(GES),
                Überanstrengung: 4,
                KarmaVerbrauch: 6,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen,Kampfgebrüll,Schlachtruf,AggressiverAngriff),
                        Schaden: add(Waffenschaden,AggressiverAngriff),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Zweitwaffe,Kampfgebrüll,Schlachtruf,AggressiverAngriff),
                        Schaden: add(Waffenschaden,AggressiverAngriff),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(GES, Rang, Karma,Kampfgebrüll,Schlachtruf,AggressiverAngriff),
                        Schaden: add(STÄ, Karma),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 7,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Kampfgebrüll + Schlachtruf + Schadenskarma + Aggressiver Angriff + Zweitwaffe + Nachtreten + Tigersprung + Schmetterschlag + Weitsprung",
                Ini: add(GES,Rang,Karma),
                Überanstrengung: 7,
                KarmaVerbrauch: 9,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen,Kampfgebrüll,Schlachtruf,AggressiverAngriff),
                        Schaden: add(Waffenschaden,AggressiverAngriff,Schmetterschlag),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Zweitwaffe,Kampfgebrüll,Schlachtruf,AggressiverAngriff),
                        Schaden: add(Waffenschaden,AggressiverAngriff),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(GES, Rang, Karma,Kampfgebrüll,Schlachtruf,AggressiverAngriff),
                        Schaden: add(STÄ, Karma),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 8,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Kampfgebrüll + Schlachtruf + Schadenskarma + Aggressiver Angriff + Zweitwaffe + Nachtreten + Tigersprung + Schmetterschlag + Weitsprung + Schwungvoller Angriff",
                Ini: add(GES,Rang,Karma),
                Überanstrengung: 8,
                KarmaVerbrauch: 10,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen,Kampfgebrüll,Schlachtruf,AggressiverAngriff),
                        Schaden: add(Waffenschaden,AggressiverAngriff,Schmetterschlag),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: SchwungvollerAngriff(add(Nahkampfwaffen,Kampfgebrüll,Schlachtruf,AggressiverAngriff)),
                        Schaden: add(Waffenschaden,AggressiverAngriff),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Zweitwaffe,Kampfgebrüll,Schlachtruf,AggressiverAngriff),
                        Schaden: add(Waffenschaden,AggressiverAngriff),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(GES, Rang, Karma,Kampfgebrüll,Schlachtruf,AggressiverAngriff),
                        Schaden: add(STÄ, Karma),
                        Treffer: MinWsk,
                    }
                ]
            },
        ],
    },

    // ///////////////////////////////////////////////////////////////////////
    //
    {
        Name: "Kundschafter",
            Color: "rgb(39, 85, 100)",
        Attribute: [
            "GES", "WAH"
        ],
        Waffe: 5,
        inherits: DefaultCharacter,

        //                         Kreis ÜA Karma Wirkung
        // Nahkampfwaffen*         1     0  1     Rang+GES>kWsk
        // Kampfsinn*              2     1  1     Rang+WAH>mWsk und Ini größer, pro Erfolg +2 erste Angriff
        // Ini+1                   3     0  0
        // Überraschungsschlag*    5     1  1     Rang+STÄ nur bei Überraschung
        // Schwachstelle Erkennen* 6     1  1     Rang+WAH>mWsk, Erfolge*2 auf Schaden
        // Tigersprung*            7     1  1     +Ini
        // Ini+2                   8     0  0

        Kombos: [
            {
                KomboKreis: 1,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen",
                Ini: add(GES),
                Überanstrengung: 0,
                KarmaVerbrauch: 1,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen),
                        Schaden: add(Waffenschaden),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 2,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Kampfsinn",
                Ini: add(GES),
                Überanstrengung: 1,
                KarmaVerbrauch: 2,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen, KampfsinnErsterAngriffBonus),
                        Schaden: Waffenschaden,
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 3,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Kampfsinn + Ini+1",
                Ini: add(GES, 1),
                Überanstrengung: 1,
                KarmaVerbrauch: 2,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen, KampfsinnErsterAngriffBonus),
                        Schaden: Waffenschaden,
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 5,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Kampfsinn + Ini+1 + Überraschungsschlag",
                Ini: add(GES, 1),
                Überanstrengung: 2,
                KarmaVerbrauch: 3,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen, KampfsinnErsterAngriffBonus),
                        Schaden: add(Waffenschaden, Überraschungsschlag),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 6,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Kampfsinn + Ini+1 + Überraschungsschlag + SchwachstelleErkennen",
                Ini: add(GES, 1),
                Überanstrengung: 3,
                KarmaVerbrauch: 4,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen, KampfsinnErsterAngriffBonus),
                        Schaden: add(Waffenschaden, Überraschungsschlag, SchwachstelleErkennen),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 7,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Kampfsinn + Ini+1 + Überraschungsschlag + SchwachstelleErkennen",
                Ini: add(GES, 1, Rang, Karma),
                Überanstrengung: 4,
                KarmaVerbrauch: 5,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen, KampfsinnErsterAngriffBonus),
                        Schaden: add(Waffenschaden, Überraschungsschlag, SchwachstelleErkennen),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 8,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Kampfsinn + Ini+2 + Überraschungsschlag + SchwachstelleErkennen",
                Ini: add(GES, 2, Rang, Karma),
                Überanstrengung: 4,
                KarmaVerbrauch: 5,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen, KampfsinnErsterAngriffBonus),
                        Schaden: add(Waffenschaden, Überraschungsschlag, SchwachstelleErkennen),
                        Treffer: MinWsk,
                    }
                ]
            },
        ],
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
        // Tigersprung             1     1  1     +Ini
        // Manövrieren*            1     1  1     Rang+GES>kWsk pro Erfolg +2 erste Angriff
        // Kampfsinn*              2     1  1     Rang+WAH>mWsk und Ini größer, pro Erfolg +2 erste Angriff
        // Lufttanz                3     2  1     +Ini, +2 Angriff bei >3 Ini-Erfolgen
        // Kampfriten              5     0  0     -1 ÜA
        // Schadenskarma           5     0  1     Karma auf Schaden
        // Schwachstelle Erkennen  5     1  1     Rang+WAH>mWsk, Erfolge*2 auf Schaden
        // Schwungvoller Angriff*  5     1  1     Rang+GES>kWsk und 1. Angriff mindestens 1 zus. Erfolg
        // Nachtreten*             6     1  1     Rang+GES>kWsk => STÄ
        // Hammerschlag            7     1  1     Rang auf Schaden
        // Zweiter Angriff         8     2  1     Rang+GES>kWsk

        // Zweitwaffe & Schildschlag wird ignoriert, da 2-Händer-Waffe angenommen wird, welche als Kombi mehr schaden macht

        Kombos: [
            {
                KomboKreis: 1,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Manövrieren + Tigersprung",
                Ini: add(GES, Tigersprung),
                Überanstrengung: 2,
                KarmaVerbrauch: 3,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen, ManövrierenErsterAngriffBonus),
                        Schaden: Waffenschaden,
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 2,
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
                Kombo: "Nahkampfwaffen + Manövrieren + Kampfsinn + Tigersprung + Lufttanz + Kampfriten + Schadenskarma + Schwachstelle Erkennen + Schwungvoller Angriff",
                Ini: add(GES, Tigersprung, Lufttanz),
                Überanstrengung: 7,
                KarmaVerbrauch: 11,
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
                    }
                ]
            },
            {
                KomboKreis: 6,
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
                        // FIXME hier ist ein Fehler, die Wahrscheinlichkeit sollte unter 1 sein
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
                        //FolgeRundenAngriffAutomatisch: 1,
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
                        //FolgeRundenAngriffAutomatisch: Rang,
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
                        AngriffGegnerAnzahl: Flächenschaden,
                        AngriffRadius: 4,
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
                        //FolgeRundenAngriffAutomatisch: Rang,
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
                        //FolgeRundenAngriffAutomatisch: Rang,
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
                        //FolgeRundenAngriffAutomatisch: Rang,
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

    // ///////////////////////////////////////////////////////////////////////
    //

    {
        Name: "Schwertmeister",
        Color: "rgb(170, 200, 90)",
        Attribute: [
            "GES", "CHA", "STÄ"
        ],
        Waffe: 6,
        inherits: DefaultCharacter,

        //                         Kreis ÜA Karma Wirkung
        // Nahkampfwaffen          1     0  1     Rang+GES>kWsk
        // Manövrieren             1     1  1     Rang+GES>kWsk pro Erfolg +2 erste Angriff
        // Verspotten              1     1  1     Rang+CHA>sWsk pro Rang -1 auf Gegner Proben
        // Kampfsinn *             1     1  1     Rang+WAH>mWsk und Ini größer, pro Erfolg +2 erste Angriff

        // Tigersprung *           2     1  1     +Ini

        // Riposte                 3     2  1     Rang+GES>Gegner Angriff: gilt bei zus. Erfolg als zusätzlicher Angriff, entsprechend Schaden

        // Schadenskarma           5     0  1
        // Zweitwaffe              5     1  1     Rang+GES, zus. Angriff
        // Nachtreten*             5     1  1     Rang+GES>kWsk => STÄ

        // Schwachstelle Erkennen* 6     1  1     Rang+WAH>mWsk, Erfolge*2 auf Schaden

        // Ini+1                   7     0  0
        // Kobrastoss*             7     2  1     Rang+GES>GegnerIni: pro Erfolg +2 auf ersten Angriff

        // Zweiter Angriff         8     2  1     Rang+GES>kWsk

        Kombos: [
            {
                KomboKreis: 1,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Manövrieren + Verspotten + Kampfsinn",
                Ini: add(GES),
                Überanstrengung: 3,
                KarmaVerbrauch: 4,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen, ManövrierenErsterAngriffBonus, KampfsinnErsterAngriffBonus, Verspotten),
                        Schaden: Waffenschaden,
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 2,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Manövrieren + Verspotten + Kampfsinn + Tigersprung",
                Ini: add(GES,Rang,Karma),
                Überanstrengung: 4,
                KarmaVerbrauch: 5,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen, ManövrierenErsterAngriffBonus, KampfsinnErsterAngriffBonus, Verspotten),
                        Schaden: Waffenschaden,
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 3,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Manövrieren + Verspotten + Kampfsinn + Tigersprung + Riposte",
                Ini: add(GES,Rang,Karma),
                Überanstrengung: 6,
                KarmaVerbrauch: 7,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen, ManövrierenErsterAngriffBonus, KampfsinnErsterAngriffBonus, Verspotten),
                        Schaden: Waffenschaden,
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Riposte, Verspotten),
                        Schaden: Waffenschaden,
                        Treffer: RiposteTreffer,
                    }
                ]
            },
            {
                KomboKreis: 5,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Manövrieren + Verspotten + Kampfsinn + Tigersprung + Riposte + Zweitwaffe + Nachtreten",
                Ini: add(GES,Rang,Karma),
                Überanstrengung: 7,
                KarmaVerbrauch: 8,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen, ManövrierenErsterAngriffBonus, KampfsinnErsterAngriffBonus, Verspotten),
                        Schaden: add(Waffenschaden,Karma),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Riposte, Verspotten),
                        Schaden: add(Waffenschaden,Karma),
                        Treffer: RiposteTreffer,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Zweitwaffe, Verspotten),
                        Schaden: add(Waffenschaden,Karma),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(GES, Rang, Karma, Verspotten),
                        Schaden: add(STÄ, Karma),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 6,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Manövrieren + Verspotten + Kampfsinn + Tigersprung + Riposte + Zweitwaffe + Nachtreten + SchwachstelleErkennen",
                Ini: add(GES,Rang,Karma),
                Überanstrengung: 8,
                KarmaVerbrauch: 9,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen, ManövrierenErsterAngriffBonus, KampfsinnErsterAngriffBonus, Verspotten),
                        Schaden: add(Waffenschaden,Karma, SchwachstelleErkennen),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Riposte, Verspotten),
                        Schaden: add(Waffenschaden,Karma, SchwachstelleErkennen),
                        Treffer: RiposteTreffer,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Zweitwaffe, Verspotten),
                        Schaden: add(Waffenschaden,Karma, SchwachstelleErkennen),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(GES, Rang, Karma, Verspotten),
                        Schaden: add(STÄ, Karma, SchwachstelleErkennen),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 7,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Manövrieren + Verspotten + Kampfsinn + Tigersprung + Riposte + Zweitwaffe + Nachtreten + SchwachstelleErkennen + Ini+1 + Kobrastoss",
                Ini: add(GES, Rang,Karma, Rang, Karma),
                Überanstrengung: 10,
                KarmaVerbrauch: 10,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen, ManövrierenErsterAngriffBonus, KampfsinnErsterAngriffBonus, Verspotten, Kobrastoss),
                        Schaden: add(Waffenschaden,Karma, SchwachstelleErkennen),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Riposte, Verspotten),
                        Schaden: add(Waffenschaden,Karma, SchwachstelleErkennen),
                        Treffer: RiposteTreffer,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Zweitwaffe, Verspotten),
                        Schaden: add(Waffenschaden,Karma, SchwachstelleErkennen),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(GES, Rang, Karma, Verspotten),
                        Schaden: add(STÄ, Karma, SchwachstelleErkennen),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 8,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Manövrieren + Verspotten + Kampfsinn + Tigersprung + Riposte + Zweitwaffe + Nachtreten + SchwachstelleErkennen + Ini+1 + Kobrastoss + Zweiter Angriff",
                Ini: add(GES, Rang, Karma, Rang, Karma),
                Überanstrengung: 12,
                KarmaVerbrauch: 12,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen, ManövrierenErsterAngriffBonus, KampfsinnErsterAngriffBonus, Verspotten, Kobrastoss),
                        Schaden: add(Waffenschaden, Karma, SchwachstelleErkennen),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Riposte, Verspotten),
                        Schaden: add(Waffenschaden, Karma, SchwachstelleErkennen),
                        Treffer: RiposteTreffer,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Zweitwaffe, Verspotten),
                        Schaden: add(Waffenschaden, Karma, SchwachstelleErkennen),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(GES, Rang, Karma, Verspotten),
                        Schaden: add(STÄ, Karma, SchwachstelleErkennen),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(GES, Rang, Karma, Verspotten),
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
        Name: "Dieb",
        Color: "rgb(150, 90, 150)",
        Attribute: [
            "GES", "WAH", "CHA"
        ],
        Waffe: 5,
        inherits: DefaultCharacter,

        //                           Kreis ÜA Karma Wirkung
        // Nahkampfwaffen            1     0  1     Rang+GES>kWsk
        // Überraschungsschlag       2     1  1     Rang+STÄ nur bei Überraschung
        // Verspotten                3     1  1     Rang+CHA>sWsk pro Rang -1 auf Gegner Proben
        // Zweitwaffe                5     1  1     Rang+GES>kWSK
        // Karma erster Angriff      5     0  1
        // Schwachstelle Erkennen    6     1  1     Rang+WAH>mWsk, Erfolge*2 auf Schaden
        // Ini+1                     7     0  0

        Kombos: [
            {
                KomboKreis: 1,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen",
                Ini: add(GES),
                Überanstrengung: 0,
                KarmaVerbrauch: 1,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen),
                        Schaden: add(Waffenschaden),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 2,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Überraschungsschlag",
                Ini: add(GES),
                Überanstrengung: 1,
                KarmaVerbrauch: 2,
                AngriffNurErsteRunde: true,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen),
                        Schaden: add(Waffenschaden, Überraschungsschlag),
                        Treffer: MinWsk,
                    }
                ]
            },

            {
                KomboKreis: 3,
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
                KomboKreis: 3,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Überraschungsschlag + Verspotten",
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
                Kombo: "Nahkampfwaffen + Verspotten + Zweitwaffe + Karma erster Angriff",
                Ini: add(GES),
                Überanstrengung: 2,
                KarmaVerbrauch: 3,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen, Verspotten, Karma),
                        Schaden: add(Waffenschaden),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Zweitwaffe, Verspotten),
                        Schaden: add(Waffenschaden),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 5,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Verspotten + Zweitwaffe + Überraschungsschlag + Karma erster Angriff",
                Ini: add(GES),
                Überanstrengung: 3,
                KarmaVerbrauch: 4,
                AngriffNurErsteRunde: true,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen, Verspotten, Karma),
                        Schaden: add(Waffenschaden, Überraschungsschlag),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(Zweitwaffe, Verspotten),
                        Schaden: add(Waffenschaden),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 6,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Verspotten + Schwachstelle Erkennen + Zweitwaffe + Karma erster Angriff",
                Ini: GES,
                Überanstrengung: 3,
                KarmaVerbrauch: 4,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen, Verspotten, Karma),
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
                KomboKreis: 6,
                inherits: DefaultKombo,
                Kombo: "Nahkampfwaffen + Verspotten + Schwachstelle Erkennen + Zweitwaffe + Überraschungsschlag + Karma erster Angriff",
                Ini: GES,
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
                Kombo: "Nahkampfwaffen + Verspotten + Schwachstelle Erkennen + Zweitwaffe + Karma erster Angriff + Ini+1",
                Ini: add(GES,1),
                Überanstrengung: 3,
                KarmaVerbrauch: 4,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(Nahkampfwaffen, Verspotten, Karma),
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
        Name: "Tiermeister",
        Color: "rgb(50, 170, 50)",
        Attribute: [
            "GES", "STÄ"
        ],
        inherits: DefaultCharacter,

        //                         Kreis ÜA Karma Wirkung
        // Krallenhand             1     0  1     Rang+STÄ+3 als Schaden
        // Waffenloser Kampf       1     0  1     Rang+GES>kWsk
        // Weitsprung              4     1  1     Rang+GES
        // Schadenskarma           5     0  1     Karma auf Schaden
        // Nachtreten*             5     1  1     Rang+GES>kWsk => STÄ
        // Kobrastoss*             6     2  1     Rang+GES>GegnerIni: pro Erfolg +2 auf ersten Angriff
        // Tigersprung*            7     1  1     +Ini
        // Schmetterschlag         7     1  1     Rang+STÄ falls höhere Position für 1. Angriff
        // Blutige Krallen         8     max Rang Angriffe*(K+Ü)+Ü. Man muss die Anzahl der Angriffe vorher ansagen, soviele Angriffe bis Fehlschlag, hat Weitsprung

        Kombos: [
            {
                KomboKreis: 1,
                Kombo: "Waffenloser Kampf + Krallenhand",
                Ini: add(GES),
                Überanstrengung: 0,
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
                Kombo: "Waffenloser Kampf + Krallenhand + Schadenskarma + Nachtreten",
                Ini: add(GES),
                Überanstrengung: 1,
                KarmaVerbrauch: 5,
                inherits: DefaultKombo,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(GES, Rang, Karma),
                        Schaden: add(Rang, STÄ, 3, Karma, Karma),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(GES, Rang, Karma),
                        Schaden: add(STÄ, Karma),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 6,
                Kombo: "Waffenloser Kampf + Krallenhand + Schadenskarma + Nachtreten + Kobrastoss",
                Ini: add(GES, Rang, Karma),
                Überanstrengung: 3,
                KarmaVerbrauch: 6,
                inherits: DefaultKombo,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(GES, Rang, Karma, Kobrastoss),
                        Schaden: add(Rang, STÄ, 3, Karma, Karma),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(GES, Rang, Karma),
                        Schaden: add(STÄ, Karma),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 7,
                Kombo: "Waffenloser Kampf + Krallenhand + Schadenskarma + Nachtreten + Kobrastoss + Tigersprung + Schmetterschlag + Weitsprung",
                Ini: add(GES, Rang, Karma, Rang, Karma),
                Überanstrengung: 5,
                KarmaVerbrauch: 8,
                inherits: DefaultKombo,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(GES, Rang, Karma, Kobrastoss),
                        Schaden: add(Rang, STÄ, 3, Karma, Karma, Schmetterschlag),
                        Treffer: MinWsk,
                    },
                    {
                        Art: kWsk,
                        Stufe: add(GES, Rang, Karma),
                        Schaden: add(STÄ, Karma),
                        Treffer: MinWsk,
                    }
                ]
            },
            {
                KomboKreis: 8,
                Kombo: "Waffenloser Kampf + Krallenhand + Schadenskarma + Kobrastoss + Tigersprung + Schmetterschlag + Weitsprung + Blutige Krallen",
                Ini: add(GES, Rang, Karma, Rang, Karma),
                // maximale Angriffe, kann Rang nehmen, aber will maximal 8 Angriffe = unter Verwundungsschwelle
                maximaleAngriffe: max(Rang, 8),
                Überanstrengung: add(6,maximaleAngriffe),
                KarmaVerbrauch: add(3,mul(3,WiederholungenBisAngriffFehlschlägt)),
                inherits: DefaultKombo,
                Angriffe: [
                    {
                        Art: kWsk,
                        Stufe: add(GES, Rang, Karma, Kobrastoss),
                        Schaden: add(Rang, STÄ, 3, Karma, Karma, div(add(Rang, Karma),WiederholungenBisAngriffFehlschlägt)),
                        Treffer: MinWsk,
                        Wiederholungen: WiederholungenBisAngriffFehlschlägt,
                    },
                ]
            },
        ]
    },

];
