"use strict";

var Kampfrunden = 3;

$(function () {
    var Gegner_Delta_Ini = 0;
    var Gegner_Delta_kWsk = 0;
    var Gegner_Delta_mWsk = 0;
    var Gegner_Delta_sWsk = 0;
    var Gegner_Delta_kRüstung = 0;
    var Gegner_Delta_mRüstung = 0;

    $('.options').append(Slider("Kampfrunden", 1, 10, 1, refreshResult));
    $('.options').append(Slider("MaximaleVorbereitungsRunden", 0, 10, 1, refreshResult));
    $('.options').append(Slider("Gegner_Grundwert", 1, 80, 1, refreshResult));
    $('.options').append(Slider("Gegner_Steigung", 0, 3, 0.1, refreshResult));
    $('.options').append(Slider("Gegner_Steigerungsbasis", 1, 1.66, 0.01, refreshResult));
    $('.options').append(Slider("Gegner_Delta_Ini", -15, +15, 1, refreshResult));
    $('.options').append(Slider("Gegner_Delta_kWsk", -15, +15, 1, refreshResult));
    $('.options').append(Slider("Gegner_Delta_mWsk", -15, +15, 1, refreshResult));
    $('.options').append(Slider("Gegner_Delta_sWsk", -15, +15, 1, refreshResult));
    $('.options').append(Slider("Gegner_Delta_kRüstung", -15, +15, 1, refreshResult));
    $('.options').append(Slider("Gegner_Delta_mRüstung", -15, +15, 1, refreshResult));
    refreshResult();

    function refreshResult() {
        $('.result').empty();
        var disziplin2Schaden = [];

        var MAX_KREIS = 8;

        (function () {
            var d2s = {
                Name: "Gegner",
                vorbereitung: []
            };
            disziplin2Schaden.push(d2s);
            var d2s2v = {
                rundenVorbereitung: 0,
                schaden: []
            };
            d2s.vorbereitung.push(d2s2v);
            for (var kreis = 1; kreis <= MAX_KREIS; kreis++) {
                var g = Gegner(kreis);
                var s = (g.Wsk.kWsk * 5 + g.Wsk.mWsk * 3 + g.Wsk.sWsk * 1 + g.Ini * 2) / 11;
                d2s2v.schaden.push(s * Kampfrunden);
            }
        })();

        (function () {
            var d2s = {
                Name: "Geom. Mittel",
                vorbereitung: []
            };
            disziplin2Schaden.push(d2s);
            var d2s2v = {
                rundenVorbereitung: 0,
                schaden: []
            };
            d2s.vorbereitung.push(d2s2v);
            for (var kreis = 1; kreis <= MAX_KREIS; kreis++) {
                d2s2v.schaden.push(0);
            }
        })();


        _(Disziplinen).each(function (disziplin) {
            var d2s = {
                Name: disziplin.Name,
                vorbereitung: []
            };
            disziplin2Schaden.push(d2s);
            for (var rundenVorbereitung = MaximaleVorbereitungsRunden; rundenVorbereitung <= MaximaleVorbereitungsRunden; rundenVorbereitung++) {
                var d2s2v = {
                    rundenVorbereitung: rundenVorbereitung,
                    schaden: [],
                    ersteRunde: {
                        schaden: [],
                        kombos: [],
                    },
                    folgeRunden: {
                        schaden: [],
                        kombos: []
                    }
                };
                d2s.vorbereitung.push(d2s2v);
                for (var Kreis = 1; Kreis <= MAX_KREIS; Kreis++) {
                    var kombosInKreis = _.filter(disziplin.Kombos, function (kombo) {
                        var char = createChar(disziplin, Kreis, kombo, rundenVorbereitung);
                        return funValue(KomboKreis, char) <= Kreis && funValue(RundenVorbereitung, char) <= rundenVorbereitung;
                    });
                    _.each(kombosInKreis, function (kombo) {
                        _.each(kombo.Angriffe, function (angriff) {
                            angriff.SchadenEinzelrunde = StandardSchadenEinzelrunde;
                            angriff.Erfolge = TrefferErfolge;
                        });
                        kombo.SchadenEinzelrundeSum = SchadenEinzelrundeSum;
                    });
                    _.chain(kombosInKreis).filter(function (kombo) {
                        return !kombo.AngriffNurErsteRunde;
                    }).sortBy(function (kombo) {
                        var char = createChar(disziplin, Kreis, kombo, rundenVorbereitung);
                        return -char.get("SchadenProRundeSum");
                    }).take(1).each(function (kombo) {
                        var char = createChar(disziplin, Kreis, kombo, rundenVorbereitung);
                        char.Strategie = "Folgerunden";
                        d2s2v.folgeRunden.schaden.push(char.get("SchadenProRundeSum"));
                        d2s2v.folgeRunden.kombos.push(char);
                    });
                    _.chain(kombosInKreis).sortBy(function (kombo) {
                        var char = createChar(disziplin, Kreis, kombo, rundenVorbereitung);
                        return -char.get("SchadenEinzelrundeSum");
                    }).take(1).each(function (kombo) {
                        var char = createChar(disziplin, Kreis, kombo, rundenVorbereitung);
                        char.Strategie = "1. Runde";
                        d2s2v.ersteRunde.schaden.push(char.get("SchadenEinzelrundeSum"));
                        d2s2v.ersteRunde.kombos.push(char);
                    });
                }
            }
        });

        (function () {
            for (var j = 2; j < disziplin2Schaden.length; j++) {
                var d2s = disziplin2Schaden[j];
                for (var i = 0; i < d2s.vorbereitung.length; i++) {
                    for (var kreis = 0; kreis < MAX_KREIS; kreis++) {
                        var v = d2s.vorbereitung[i];
                        v.schaden[kreis] = v.ersteRunde.schaden[kreis] + v.folgeRunden.schaden[kreis] * (Kampfrunden - 1);
                    }
                }
            }
        })();

        _.each(disziplin2Schaden, function (d2s) {
            var schadenEquals = function (x, y) {
                var a = x.schaden;
                var b = y.schaden;
                return a.length == b.length && a.every(function (this_i, i) {
                    return Math.abs(this_i - b[i]) < 2;
                });
            };
            var i = 1;
            while (i < d2s.vorbereitung.length) {
                var v0 = d2s.vorbereitung[i - 1];
                var v1 = d2s.vorbereitung[i];
                if (schadenEquals(v0, v1)) {
                    d2s.vorbereitung.splice(i, 1);
                } else {
                    i++;
                }
            }
        });

        (function () {
            for (var kreis = 0; kreis < MAX_KREIS; kreis++) {
                var line = [];
                for (var j = 2; j < disziplin2Schaden.length; j++) {
                    var d2s = disziplin2Schaden[j];
                    for (var i = 0; i < d2s.vorbereitung.length; i++) {
                        var v = d2s.vorbereitung[i];
                        line.push(v.schaden[kreis]);
                    }
                }
                line.sort(function (a, b) {
                    return a - b;
                });

//      line.splice(0, 1);
//      line.splice(line.length-1, 1);
//      var gestutztesMittel = _.foldl(line, function(a,b){return a+b;}, 0) / line.length;

//      var median = line[Math.round(line.length/2)];

                var geometrischesMittel = Math.pow(_.foldl(line, function (a, b) {
                    return a * b;
                }, 1), 1 / line.length);
                if (_.isNaN(geometrischesMittel) || geometrischesMittel == 0) {
                    // Fallback Median
                    geometrischesMittel = line[Math.round(line.length / 2)];
                }
//      var arithmetischesMittel = _.foldl(line, function(a,b){return a+b;}, 0) / line.length;

                disziplin2Schaden[1].vorbereitung[0].schaden[kreis] = geometrischesMittel;
            }
        })();


        var defaultColors = ["rgba(0, 0, 0, 0.1)",
            "rgba(100, 100, 100, 0.5)",
            "rgb(50, 170, 50)",
            "rgb(200, 200, 100)",
            "rgb(255, 0, 255)",
            "rgb(0, 0, 255)",
            "rgb(90, 243, 243)",
            "rgb(250, 0, 0)",
            "rgb(0, 0, 0)",
            "#8A0829",
            "rgb(210, 255, 255)",
            "rgb(61, 133, 61)",
            "rgb(255, 232, 76)",
            "rgb(92, 200, 92)"];
        var colors = [];
        var series = [];
        var disIdx = 0;
        var maxSchaden = 0;
        _.each(disziplin2Schaden, function (d2s) {
            var d2s2v = _.last(d2s.vorbereitung);
//      for (var i = 0; i < d2s.vorbereitung.length; i++) {
            colors.push(defaultColors[disIdx]);
            var data = [];
            series.push({
                label: d2s.Name,//+"_"+d2s2v.rundenVorbereitung,
                data: data
            });
            for (var kreis = 0; kreis < MAX_KREIS; kreis++) {
                var schaden = d2s2v.schaden[kreis] / Kampfrunden;
                data.push([kreis + 1, schaden]);
                maxSchaden = Math.max(maxSchaden, schaden);
//        }
            }
            disIdx++;
        });

        series[0].lines = {show: true, fill: true, fillColor: "rgba(0, 0, 0, 0.1)", lineWidth: 0};
        series[1].lines = {lineWidth: 15};

        $('.result').append('<div id="placeholder" style="width:500px;height:500px;"></div>');
        $.plot("#placeholder", series, {
            colors: colors,
            series: {
                lines: {show: true, lineWidth: 3}
            },
            xaxis: {},
            yaxis: {
                max: 400,//maxSchaden>60?maxSchaden:50,
                min: 0,
                ticks: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 70, 100, 150, 200, 300],
//        tickSize: 5,
                position: "right",
//        transform:  function(v) { return Math.pow(v,0.5); } 
                transform: function (v) {
                    return v < 60.1 ? v : 60 + Math.pow(v - 60, 0.5);
                }
            },
            legend: {
                show: true,
                position: "nw"
            },
            grid: {
                borderWidth: {
                    top: 1,
                    right: 1,
                    bottom: 2,
                    left: 2
                }
            }
        });

        (function () {
            var sumTable = Table([], 1);
            sumTable.fixed("Kreis", 0);
            for (var kreis = 0; kreis < MAX_KREIS; kreis++) {
                sumTable.newRow();
                sumTable.col("Kreis", kreis + 1);
                _.each(disziplin2Schaden, function (d2s) {
                    for (var i = 0; i < d2s.vorbereitung.length; i++) {
                        var d2s2v = d2s.vorbereitung[i];
                        var name = d2s.Name;//+"_"+d2s2v.rundenVorbereitung;
                        var schaden = d2s2v.schaden[kreis] / Kampfrunden;
                        sumTable.col(name, schaden);
                    }
                });
            }
            $('.result').append("<br/>");
            $('.result').append("<h3>Schaden / Runde</h3>");
            $('.result').append(sumTable.toHtml());
        })();

        (function () {
            var sumTable = Table([], 1);
            sumTable.fixed("Kreis", 0);
            for (var kreis = 0; kreis < MAX_KREIS; kreis++) {
                sumTable.newRow();
                sumTable.col("Kreis", kreis + 1);
                _.each(disziplin2Schaden, function (d2s) {
                    for (var i = 0; i < d2s.vorbereitung.length; i++) {
                        var d2s2v = d2s.vorbereitung[i];
                        var name = d2s.Name;//+"_"+d2s2v.rundenVorbereitung;
                        var schaden = d2s2v.schaden[kreis];
                        sumTable.col(name, schaden);
                    }
                });
            }
            $('.result').append("<br/>");
            $('.result').append("<h3>Schadenssumme am Ende</h3>");
            $('.result').append(sumTable.toHtml());
        })();


        $('.result').append("<br/>");
        var detailTableButton = $('<button>Details anzeigen</button>');
        $('.result').append(detailTableButton);
        detailTableButton.click(function () {
            detailTableButton.hide();
            var detailTable = Table([], 1);
            detailTable.fixed("Kreis", 0);
            (function () {
                for (var j = 2; j < disziplin2Schaden.length; j++) {
                    var d2s = disziplin2Schaden[j];
                    _.each(d2s.vorbereitung, function (d2s2v) {
                        _.each([d2s2v.ersteRunde, d2s2v.folgeRunden], function (runden) {
                            _.each(runden.kombos, function (kombo) {
//                if (d2s2v.rundenVorbereitung!=kombo.get("RundenVorbereitung")) {
//                  return;
//                }
//                if (kombo.Kreis<8) {
//                  return;
//                }
                                detailTable.newRow();
                                detailTable.col("Disziplin", kombo.Disziplin.Name);//+"_"+d2s2v.rundenVorbereitung);
                                detailTable.col("Kreis", kombo.Kreis);
                                detailTable.col("Strategie", kombo.Strategie);
                                detailTable.col("Kombo", kombo.get("Kombo"));
                                Attribute.forEach(function (key, i) {
                                    detailTable.col(key, kombo[key] + " (" + kombo[key + "Wert"] + ")");
                                });
                                detailTable.col("Rang", kombo.get("Rang"));
                                detailTable.col("Karma", kombo.get("Karma"));
                                detailTable.col("Waffe", kombo.get("Waffe"));
                                detailTable.col("Kombo-Kreis", kombo.get("KomboKreis"));
                                detailTable.col("Alchm Fehlschlag", kombo.get("AlchmFehlschlag"));
                                detailTable.col("Runden Vorbereitung", kombo.get("RundenVorbereitung"));
                                detailTable.col("Summe Schaden", kombo.get("SchadenEinzelrundeSum"));
                                detailTable.col("Summe Schaden / Runde", kombo.get("SchadenProRundeSum"));
                                detailTable.col("Kombo-Ini", kombo.get("kombo"));
                                detailTable.col("ÜA", kombo.get("Überanstrengung"));
                                detailTable.col("Karma", kombo.get("KarmaVerbrauch"));
                                detailTable.col("Fäden", kombo.get("Fäden"));
                                detailTable.col("Gegner-Ini", kombo.get("GegnerIni"));
                                detailTable.col("Gegner-kWsk", kombo.get("GegnerWsk")[kWsk]);
                                detailTable.col("Gegner-mWsk", kombo.get("GegnerWsk")[mWsk]);
                                detailTable.col("Gegner-sWsk", kombo.get("GegnerWsk")[sWsk]);
                                detailTable.col("Gegner-kRüstung", kombo.get("GegnerRüstung")[kWsk]);
                                detailTable.col("Gegner-mRüstung", kombo.get("GegnerRüstung")[mWsk]);
                                kombo.Angriffe.forEach(function (angriff, index) {
                                    var char = _.extend({}, kombo, angriff);
                                    var nr = index + 1;
                                    detailTable.col("Angriff-" + nr + "-Art", char.get("Art"));
                                    detailTable.col("Angriff-" + nr + "-Stufe", char.get("Stufe"));
                                    detailTable.col("Angriff-" + nr + "-Treffer", char.get("Treffer"));
                                    detailTable.col("Angriff-" + nr + "-Schadens-stufe", char.get("Schaden"));
                                    detailTable.col("Angriff-" + nr + "-Erfolge", char.get("Erfolge"));
                                    detailTable.col("Angriff-" + nr + "-Schaden", char.get("SchadenEinzelrundeSum"));
                                    detailTable.col("Angriff-" + nr + "-Schaden / Runde", char.get("SchadenProRunde"));
                                    detailTable.col("Angriff-" + nr + "-Wieder-holungen", char.get("Wiederholungen"));
                                    detailTable.col("Angriff-" + nr + "-Runden Angriff als Aktion", char.get("AnzahlRundenAngriffAlsAktion"));
                                    detailTable.col("Angriff-" + nr + "-Runden Angriff automatisch", char.get("FolgeRundenAngriffAutomatisch"));
                                });
                            });
                        });
                    });
                }
            })();

            var detailsDiv = $("<div class='details'/>");
            detailsDiv.append(detailTable.toHtml());
            $('.result').append(detailsDiv);
            $('.details table').addClass('fancyTable').fixedHeaderTable({
                fixedColumns: 4,
                autoShow: true,
                footer: false,
                height: 600,
                altClass: 'odd'
            });

        });


    }


});