
window.Gegner_Grundwert = 1;
window.Gegner_Steigerungsbasis = 1;
window.Gegner_Steigung = 0;
window.Gegner_Delta_Ini = 7;
window.Gegner_Delta_kWsk = 10;
window.Gegner_Delta_mWsk = 8;
window.Gegner_Delta_sWsk = 9;
window.Gegner_Delta_kRüstung = 5;
window.Gegner_Delta_mRüstung = 2;
window.Gegner_Angriff = 12;
window.Gegner_Anzahl = 1;
window.Gegner_verteilt_auf_Radius = 1;

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
            mWsk: Math.max(0,grundwert+Gegner_Delta_mRüstung),
        },
        Angriff: Math.max(0,grundwert+Gegner_Angriff),
        Anzahl: Gegner_Anzahl,
        verteilt_auf_Radius: Gegner_verteilt_auf_Radius,
    };
};

// https://docs.google.com/spreadsheets/d/19YvwpAJhEkT6dgZzj-8gs-_VTs02k6Lq04NhKHEXHfo/edit?usp=sharing
var StandardGegner = [
    {
        "Name": "Affe",
        "Herausforderung": 1,
        "ini": 7,
        "kver": 11,
        "mver": 7,
        "sver": 8,
        "kr": 1,
        "mr": 1,
        "Angriff": 10
    },
    {
        "Name": "Blutbiene",
        "Herausforderung": 1,
        "ini": 7,
        "kver": 10,
        "mver": 9,
        "sver": 7,
        "kr": 3,
        "mr": 1,
        "Angriff": 9
    },
    {
        "Name": "Croje",
        "Herausforderung": 5,
        "ini": 14,
        "kver": 16,
        "mver": 11,
        "sver": 9,
        "kr": 6,
        "mr": 3,
        "Angriff": 20
    },
    {
        "Name": "Espagra",
        "Herausforderung": 6,
        "ini": 15,
        "kver": 16,
        "mver": 15,
        "sver": 11,
        "kr": 5,
        "mr": 6,
        "Angriff": 10
    },
    {
        "Name": "Bär",
        "Herausforderung": 4,
        "ini": 5,
        "kver": 7,
        "mver": 9,
        "sver": 11,
        "kr": 7,
        "mr": 3,
        "Angriff": 11
    },
    {
        "Name": "Chaktavogel",
        "Herausforderung": 3,
        "ini": 12,
        "kver": 12,
        "mver": 12,
        "sver": 11,
        "kr": 1,
        "mr": 4,
        "Angriff": 18
    },
    {
        "Name": "Donnervogel",
        "Herausforderung": 7,
        "ini": 14,
        "kver": 14,
        "mver": 16,
        "sver": 12,
        "kr": 7,
        "mr": 8,
        "Angriff": 18
    },
    {
        "Name": "Genhis",
        "Herausforderung": 1,
        "ini": 4,
        "kver": 6,
        "mver": 8,
        "sver": 7,
        "kr": 1,
        "mr": 2,
        "Angriff": 8
    },
    {
        "Name": "Gepard",
        "Herausforderung": 2,
        "ini": 12,
        "kver": 12,
        "mver": 9,
        "sver": 7,
        "kr": 3,
        "mr": 1,
        "Angriff": 13
    },
    {
        "Name": "Globberog",
        "Herausforderung": 5,
        "ini": 3,
        "kver": 8,
        "mver": 14,
        "sver": 12,
        "kr": 10,
        "mr": 10,
        "Angriff": 12
    },
    {
        "Name": "Halbgeist",
        "Herausforderung": 5,
        "ini": 9,
        "kver": 13,
        "mver": 15,
        "sver": 12,
        "kr": 3,
        "mr": 6,
        "Angriff": 14
    },
    {
        "Name": "Harpyie",
        "Herausforderung": 8,
        "ini": 8,
        "kver": 10,
        "mver": 11,
        "sver": 13,
        "kr": 3,
        "mr": 3,
        "Angriff": 16
    },
    {
        "Name": "Höhlenkrabbe",
        "Herausforderung": 8,
        "ini": 10,
        "kver": 10,
        "mver": 15,
        "sver": 10,
        "kr": 18,
        "mr": 11,
        "Angriff": 20
    },
    {
        "Name": "Höllenhund",
        "Herausforderung": 6,
        "ini": 8,
        "kver": 13,
        "mver": 14,
        "sver": 11,
        "kr": 6,
        "mr": 6,
        "Angriff": 15
    },
    {
        "Name": "Irrlicht",
        "Herausforderung": 4,
        "ini": 12,
        "kver": 14,
        "mver": 14,
        "sver": 12,
        "kr": 1,
        "mr": 5,
        "Angriff": 16
    },
    {
        "Name": "Katze",
        "Herausforderung": 1,
        "ini": 9,
        "kver": 10,
        "mver": 9,
        "sver": 8,
        "kr": 0,
        "mr": 1,
        "Angriff": 9
    },
    {
        "Name": "Jubjub",
        "Herausforderung": 3,
        "ini": 10,
        "kver": 10,
        "mver": 8,
        "sver": 8,
        "kr": 4,
        "mr": 1,
        "Angriff": 15
    },
    {
        "Name": "Oger",
        "Herausforderung": 4,
        "ini": 5,
        "kver": 10,
        "mver": 7,
        "sver": 7,
        "kr": 8,
        "mr": 3,
        "Angriff": 12
    },
    {
        "Name": "Skeorx",
        "Herausforderung": 7,
        "ini": 20,
        "kver": 16,
        "mver": 13,
        "sver": 12,
        "kr": 7,
        "mr": 4,
        "Angriff": 21
    },
    {
        "Name": "Sumpfgob",
        "Herausforderung": 2,
        "ini": 5,
        "kver": 7,
        "mver": 8,
        "sver": 12,
        "kr": 5,
        "mr": 2,
        "Angriff": 9
    },
    {
        "Name": "Tundrabestie",
        "Herausforderung": 5,
        "ini": 8,
        "kver": 12,
        "mver": 11,
        "sver": 10,
        "kr": 9,
        "mr": 6,
        "Angriff": 14
    },
    {
        "Name": "Gewöhnlicher Drache",
        "Herausforderung": 13,
        "ini": 20,
        "kver": 21,
        "mver": 22,
        "sver": 22,
        "kr": 30,
        "mr": 10,
        "Angriff": 26
    },
    {
        "Name": "Kohlengrien",
        "Herausforderung": 13,
        "ini": 20,
        "kver": 20,
        "mver": 23,
        "sver": 17,
        "kr": 30,
        "mr": 17,
        "Angriff": 23
    },
    {
        "Name": "Jehutra",
        "Herausforderung": 5,
        "ini": 7,
        "kver": 12,
        "mver": 14,
        "sver": 8,
        "kr": 7,
        "mr": 4,
        "Angriff": 14
    },
    {
        "Name": "Kadavermensch",
        "Herausforderung": 3,
        "ini": 5,
        "kver": 9,
        "mver": 9,
        "sver": 8,
        "kr": 0,
        "mr": 3,
        "Angriff": 10
    },
    {
        "Name": "Blähform",
        "Herausforderung": 8,
        "ini": 8,
        "kver": 14,
        "mver": 18,
        "sver": 16,
        "kr": 10,
        "mr": 10,
        "Angriff": 22
    },
    {
        "Name": "Kristallwesen",
        "Herausforderung": 6,
        "ini": 7,
        "kver": 9,
        "mver": 15,
        "sver": 12,
        "kr": 10,
        "mr": 10,
        "Angriff": 16
    },
    {
        "Name": "Wurmschädel",
        "Herausforderung": 8,
        "ini": 10,
        "kver": 16,
        "mver": 18,
        "sver": 14,
        "kr": 12,
        "mr": 10,
        "Angriff": 20
    }
];



window.StandardgegnerAuswahl = "Oger";
function refreshStandardGegner() {
    var g = StandardGegner.find(g=>g.Name==window.StandardgegnerAuswahl);
    if (g==null) {
        return;
    }
    window.Gegner_Grundwert = 0;
    window.Gegner_Steigerungsbasis = 0;
    window.Gegner_Steigung = 0;
    window.Gegner_Delta_Ini = g.ini;
    window.Gegner_Delta_kWsk = g.kver;
    window.Gegner_Delta_mWsk = g.mver;
    window.Gegner_Delta_sWsk = g.sver;
    window.Gegner_Delta_kRüstung = g.kr;
    window.Gegner_Delta_mRüstung = g.mr;
    window.Gegner_Angriff = g.Angriff;
}
refreshStandardGegner();

