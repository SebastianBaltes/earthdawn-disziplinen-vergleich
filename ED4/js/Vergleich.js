"use strict";

window.Kampfrunden = 3;
window.Karma_Einsatz = 1;
window.Sprengfass = 1;
window.Disziplinen = _.orderBy(Disziplinen, d=>d.Name);

window.DisziplinenSelected = Disziplinen.map(d=>d.Name);

$(function () {

    $('.options').append(MultiSelect('DisziplinenSelected',Array.from(window.DisziplinenSelected),refreshResult));

    $('.options').append(Slider("Kampfrunden", 1, 10, 1, refreshResult));
    $('.options').append(Slider("Max_Runden_Vorbereitung", 0, 10, 1, refreshResult));
    $('.options').append(Slider("Karma_Einsatz", 0, 1, 0.1, refreshResult));
    $('.options').append(Slider("Sprengfass", 0, 1, 1, refreshResult));

    $('.options').append(SingleSelect("StandardgegnerAuswahl", StandardGegner.map(x=>x.Name), function() {
        refreshStandardGegner();
        $('body').trigger('uirefresh');
        refreshResult();
    }));

    $('.options').append(Slider("Gegner_Grundwert", 1, 80, 1, refreshResult));
    $('.options').append(Slider("Gegner_Steigung", 0, 3, 0.1, refreshResult));
    $('.options').append(Slider("Gegner_Steigerungsbasis", 1, 1.66, 0.01, refreshResult));
    $('.options').append(Slider("Gegner_Delta_Ini", -40, +40, 1, refreshResult));
    $('.options').append(Slider("Gegner_Delta_kWsk", -15, +15, 1, refreshResult));
    $('.options').append(Slider("Gegner_Delta_mWsk", -15, +15, 1, refreshResult));
    $('.options').append(Slider("Gegner_Delta_sWsk", -15, +15, 1, refreshResult));
    $('.options').append(Slider("Gegner_Delta_kRüstung", -15, +15, 1, refreshResult));
    $('.options').append(Slider("Gegner_Delta_mRüstung", -15, +15, 1, refreshResult));
    $('.options').append(Slider("Gegner_Angriff", -20, +20, 1, refreshResult));

    refreshResult();

    function refreshResult() {
        $('.result').empty();
        var disziplin2Schaden = [];
        var disziplinenShown = Disziplinen.filter(d=>window.DisziplinenSelected.includes(d.Name));
        console.log(window.DisziplinenSelected,disziplinenShown);

        var MAX_KREIS = 8;

        (function () {
            var d2s = {
                Name: "Gegner",
                Color: "rgba(0, 0, 0, 0.1)",
                werteProKreis: [],
            };
            disziplin2Schaden.push(d2s);
            for (var kreis = 1; kreis <= MAX_KREIS; kreis++) {
                var g = Gegner(kreis);
                var s = (g.Wsk.kWsk * 5 + g.Wsk.mWsk * 3 + g.Wsk.sWsk * 1 + g.Ini * 2) / 11;
                d2s.werteProKreis[kreis] = {kreis, schaden: s * Kampfrunden, ersteRunde: null, folgeRunden: null};
            }
        })();

        (function () {
            var d2s = {
                Name: "Geom. Mittel",
                Color: "rgba(100, 100, 100, 0.5)",
                werteProKreis: [],
            };
            disziplin2Schaden.push(d2s);
        })();

        disziplinenShown.forEach(disziplin =>disziplin.Kombos.forEach(kombo=> {
            kombo.Angriffe.forEach(angriff => {
                _.defaults(kombo,DefaultAngriff);
            });
        }));

        disziplinenShown.forEach(function (disziplin) {
            var d2s = {
                Name: disziplin.Name,
                Color: disziplin.Color,
                werteProKreis: [],
            };
            disziplin2Schaden.push(d2s);
            for (var kreis = 1; kreis <= MAX_KREIS; kreis++) {

                var d2s2v = {
                    kreis,
                    schaden: 0,
                    ersteRunde: {
                        list: [],
                        schaden: 0,
                        kombo: null,
                    },
                    folgeRunden: {
                        list: [],
                        schaden: 0,
                        kombo: null,
                    }
                };
                d2s.werteProKreis[kreis] = d2s2v;

                for (var rundenVorlauf = 0; rundenVorlauf <= Max_Runden_Vorbereitung; rundenVorlauf++) {

                    var kombosInKreis = _.filter(disziplin.Kombos, function (kombo) {
                        var char = createChar(disziplin, kreis, kombo, rundenVorlauf);
                        return funValue(KomboKreis, char) <= kreis
                            && funValue(RundenVorlaufMin, char) <= rundenVorlauf
                            && funValue(RundenVorlaufMax, char) >= rundenVorlauf;
                    });

                    kombosInKreis.forEach(function (kombo) {
                        var char = createChar(disziplin, kreis, kombo, rundenVorlauf);
                        d2s2v.ersteRunde.list.push(char);
                        // console.log(disziplin.Name,kreis,rundenVorlauf,kombo.Kombo,char.get("SchadenEinzelrundeSum"),'Fäden',char.get('Fäden'),'ExtraFäden',ExtraFäden(char),'MinFäden',MinFäden(char));
                    });

                    kombosInKreis.forEach(function (kombo) {
                        if (!kombo.AngriffNurErsteRunde) {
                            var char = createChar(disziplin, kreis, kombo, rundenVorlauf);
                            d2s2v.folgeRunden.list.push(char);
                        }
                    });

                }

                // 1. Runde
                _.sortBy(d2s2v.ersteRunde.list,function (char) {
                    return -char.get("SchadenEinzelrundeSum");
                }).find(function (char) {
                    char.Strategie = "1. Runde";
                    d2s2v.ersteRunde.kombo = char;
                    d2s2v.ersteRunde.schaden = char.get("SchadenEinzelrundeSum");
                    return true;
                });

                // Folgerunden
                _.sortBy(d2s2v.folgeRunden.list,function (char) {
                    return -char.get("SchadenProRundeSum");
                }).find(function (char) {
                    char.Strategie = "Folgerunden";
                    d2s2v.folgeRunden.kombo = char;
                    d2s2v.folgeRunden.schaden = char.get("SchadenProRundeSum");
                    return true;
                });

                d2s2v.schaden = d2s2v.ersteRunde.schaden + d2s2v.folgeRunden.schaden * (Kampfrunden - 1);
            }
        });

        (function () {
            for (var kreis = 1; kreis <= MAX_KREIS; kreis++) {
                var line = [];
                for (var j = 2; j < disziplin2Schaden.length; j++) {
                    var schaden = disziplin2Schaden[j].werteProKreis[kreis].schaden;
                    line.push(schaden);
                }
                line.sort(function (a, b) {
                    return a - b;
                });

//      line.splice(0, 1);
//      line.splice(line.length-1, 1);
//      var gestutztesMittel = _.reduce(line, function(a,b){return a+b;}, 0) / line.length;

//      var median = line[Math.round(line.length/2)];

                var geometrischesMittel = Math.pow(_.reduce(line, function (a, b) {
                    return a * b;
                }, 1), 1 / line.length);
                if (_.isNaN(geometrischesMittel) || geometrischesMittel == 0) {
                    // Fallback Median
                    geometrischesMittel = line[Math.round(line.length / 2)];
                }
//      var arithmetischesMittel = _.reduce(line, function(a,b){return a+b;}, 0) / line.length;

                disziplin2Schaden[1].werteProKreis[kreis] = {kreis, schaden: geometrischesMittel, ersteRunde: null, folgeRunden: null};
            }
        })();


        var colors = [];
        var series = [];
        var disIdx = 0;

        let disForChart = _.clone(disziplin2Schaden);
        disForChart.forEach((s,i)=>s.order=disForChart.length-i);
        disForChart.slice(0,2).forEach((s,i)=>s.order=i);
        disForChart = _.orderBy(disForChart,s=>s.order);

        _.each(disForChart, function (d2s) {
            colors.push(d2s.Color);
            var data = [];
            series.push({
                label: d2s.Name,
                data: data
            });
            for (var kreis = 1; kreis <= MAX_KREIS; kreis++) {
                var schaden = d2s.werteProKreis[kreis].schaden / Kampfrunden;
                data.push([kreis, schaden]);
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
                max: 400,
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

        console.log('disziplin2Schaden',disziplin2Schaden);

        (function () {
            var sumTable = Table([], 1);
            sumTable.fixed("Kreis", 0);
            for (var kreis = 1; kreis <= MAX_KREIS; kreis++) {
                sumTable.newRow();
                sumTable.col("Kreis", kreis);
                _.each(disziplin2Schaden, function (d2s) {
                    var schaden = d2s.werteProKreis[kreis].schaden / Kampfrunden;
                    var name = d2s.Name;
                    sumTable.col(name, schaden);
                });
            }
            $('.result').append("<br/>");
            $('.result').append("<h3>Schaden / Runde</h3>");
            $('.result').append(sumTable.toHtml());
        })();

        (function () {
            var sumTable = Table([], 1);
            sumTable.fixed("Kreis", 0);
            for (var kreis = 1; kreis <= MAX_KREIS; kreis++) {
                sumTable.newRow();
                sumTable.col("Kreis", kreis);
                _.each(disziplin2Schaden, function (d2s) {
                    var schaden = d2s.werteProKreis[kreis].schaden;
                    var name = d2s.Name;
                    sumTable.col(name, schaden);
                });
            }
            $('.result').append("<br/>");
            $('.result').append("<h3>Schadenssumme am Ende</h3>");
            $('.result').append(sumTable.toHtml());
        })();


        $('.result').append("<br/>");
        $('.result').append("<h3>Details</h3>");

        var detailTable = Table([], 1);
        detailTable.fixed("Kreis", 0);
        detailTable.fixed("Runden Vorbereitung", 0);
        detailTable.fixed("Kombo-Kreis", 0);
        (function () {
            for (var j = 2; j < disziplin2Schaden.length; j++) {
                var d2s = disziplin2Schaden[j];
                for (var kreis = 1; kreis <= MAX_KREIS; kreis++) {
                    var d2s2v = d2s.werteProKreis[kreis];
                    _.each([d2s2v.ersteRunde, d2s2v.folgeRunden], function (rundeData) {
                        var kombo = rundeData.kombo;
                        detailTable.newRow();
                        detailTable.col("Disziplin", kombo.Disziplin.Name);//+"_"+d2s2v.rundenVorbereitung);
                        detailTable.col("Kreis", kombo.Kreis);
                        detailTable.col("Strategie", kombo.Strategie);
                        detailTable.col("Kombo", kombo.get("Kombo"));
                        detailTable.col("Kombo-Kreis", kombo.get("KomboKreis"));
                        detailTable.col("Runden Vorbereitung", kombo.RundenVorlauf);
                        Attribute.forEach(function (key, i) {
                            detailTable.col(key, kombo[key] + " (" + kombo[key + "Wert"] + ")");
                        });
                        detailTable.col("Rang", kombo.get("Rang"));
                        detailTable.col("Karma", kombo.get("Karma"));
                        detailTable.col("Waffe", kombo.get("Waffe"));
                        detailTable.col("Alchm Fehlschlag", kombo.get("Fehlschlag"));
                        detailTable.col("Summe Schaden", kombo.get("SchadenEinzelrundeSum"));
                        detailTable.col("Summe Schaden / Runde", kombo.get("SchadenProRundeSum"));
                        detailTable.col("Kombo-Ini", kombo.get("Ini"));
                        detailTable.col("ÜA", kombo.get("Überanstrengung"));
                        detailTable.col("Karma", KarmaVerbrauch(kombo));
                        detailTable.col("Fäden", kombo.get("Fäden"));
                        detailTable.col("Extra Fäden", ExtraFäden(kombo));
                        detailTable.col("Erw-Fäden", kombo.get("ErweiterteFäden"));
                        detailTable.col("WILS", kombo.get("WILS"));
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
                            detailTable.col("Angriff-" + nr + "-Erfolge", char.get("Erfolge"));
                            // detailTable.col("Angriff-" + nr + "-Lufttzanz ini3", max(0,min(1,add(erfolge(Ini, GegnerIni),-2)))(kombo));
                            // detailTable.col("Angriff-" + nr + "-Lufttanz Erfolge", erfolge(Ini, GegnerIni)(kombo));
                            // detailTable.col("Angriff-" + nr + "-Lufttzanz i1", IniErfolge3(kombo));
                            // detailTable.col("Angriff-" + nr + "-Lufttzanz i2", MinWsk(kombo));
                            // detailTable.col("Angriff-" + nr + "-Lufttzanz i3", add(Nahkampfwaffen)(kombo));
                            // detailTable.col("Angriff-" + nr + "-Lufttzanz i41", probe(Nahkampfwaffen, GegnerWsk)(kombo));
                            // detailTable.col("Angriff-" + nr + "-Lufttzanz i42", probe(Nahkampfwaffen, GegnerKwsk)(kombo));
                            // detailTable.col("Angriff-" + nr + "-Lufttzanz i412", GegnerWsk(kombo));
                            // detailTable.col("Angriff-" + nr + "-Lufttzanz i422", GegnerKwsk(kombo));
                            // detailTable.col("Angriff-" + nr + "-Lufttzanz i423", val('Art')(kombo));
                            // detailTable.col("Angriff-" + nr + "-Lufttzanz i423", kombo.Art);
                            // detailTable.col("Angriff-" + nr + "-Lufttzanz T2", mul(IniErfolge3,MinWsk)(kombo));
                            //
                            // detailTable.col("Angriff-" + nr + "-Lufttzanz Treffer", LufttzanzTreffer(kombo));

                            detailTable.col("Angriff-" + nr + "-Schadens-stufe", char.get("SchadenMitErfolgen"));
                            detailTable.col("Angriff-" + nr + "-Schaden", char.get("SchadenEinzelrunde"));
                            detailTable.col("Angriff-" + nr + "-Schaden / Runde", char.get("SchadenProRunde"));
                            detailTable.col("Angriff-" + nr + "-Runden Leerlauf", char.get("RundenVorlauf"));
                            detailTable.col("Angriff-" + nr + "-Wieder-holungen", char.get("Wiederholungen"));
                            detailTable.col("Angriff-" + nr + "-Runden Angriff als Aktion", char.get("AnzahlRundenAngriffAlsAktion"));
                            detailTable.col("Angriff-" + nr + "-Runden Angriff automatisch", char.get("FolgeRundenAngriffAutomatisch"));
                        });
                    });
                }
            }
        })();

        var detailsDiv = $("<div class='details'/>");
        detailsDiv.append(detailTable.toHtml());
        $('.result').append("<br/>").append(detailsDiv);

    }


});