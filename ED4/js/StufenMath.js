"use strict";

//1W4-2
//2W20,1W10,2W8,1W6
var Dices = function (str) {
    // number of dices
    var dices = [4, 6, 8, 10, 12, 20];
    var count = [0, 0, 0, 0, 0, 0];
    var dice2Index = {
        "4": 0,
        "6": 1,
        "8": 2,
        "10": 3,
        "12": 4,
        "20": 5
    };
    var mod = 0;
    parse(str);

    function singleRoll(dice) {
        var rnd = Math.random();
        var value = Math.round(rnd * (dice - 1)) + 1;
        if (value == dice) {
            value += singleRoll(dice);
        }
        return value;
    }

    function roll() {
        var sum = 0;
        for (var i = 0; i < dices.length; i++) {
            var dice = dices[i];
            for (var j = 0; j < count[i]; j++) {
                sum += singleRoll(dice);
            }
        }
        sum = Math.max(1, sum - mod);
        return sum;
    }

    function parse(str) {
        var modParts = str.toUpperCase().split("-");
        if (modParts.length > 1) {
            mod = parseInt(modParts[1]);
        }
        var diceParts = modParts[0].split(",");
        for (var i = 0; i < diceParts.length; i++) {
            var d = diceParts[i].split("W");
            var c = parseInt(d[0]);
            count[dice2Index[d[1]]] += _.isNaN(c) ? 1 : c;
        }
    }

    function probabilityToReach(value, rolls) {
//    var distribution = new Array(Math.round(value)+2);
//    for (var i = 0; i < distribution.length; i++) {
//      distribution[i]=0;
//    }
//    for (var diceIdx = 0; diceIdx < count.length; diceIdx++) {
//      for (var c = 0; c < count[diceIdx]; c++) {
//        var n = dices[diceIdx];
//        var p = 1;
//        for (var i = 1; i < distribution.length; i++) {
//          var sub = i%n==0 ? 0 : Math.pow(n,-(Math.floor(i/n)+1));
//          distribution[i]+=p;
//          p-=sub;
//        }
//      }
//    }
//    var div = distribution[1];
//    for (var i = 1; i < distribution.length; i++) {
//      distribution[i]/=div;
//    }
//    var valueInt = Math.floor(value);
//    var nachkomma = value - valueInt;
//    return distribution[valueInt]*(1-nachkomma) + distribution[valueInt]*nachkomma; 
        var reached = 0;
        if (_.isUndefined(rolls)) {
            rolls = 1000;
        }
        for (var i = 0; i < rolls; i++) {
            if (roll() >= value) {
                reached++;
            }
        }
        return reached / rolls;
    }

    function successes(value, rolls) {
        var reached = 0;
        if (_.isUndefined(rolls)) {
            rolls = 1000;
        }
        for (var i = 0; i < rolls; i++) {
            const diff = roll() - value;
            reached += Math.max(0, diff / 5);
        }
        return reached / rolls;
    }

    return {
        roll: roll,
        probabilityToReach: probabilityToReach,
        successes: successes,
    };

};

function tableInterpolate(t) {
    return function (stufe, wert) {
        var s = stufe;
        var w = wert;
        var s0 = Math.max(0, Math.min(149, Math.floor(s)));
        var w0 = Math.max(0, Math.min(500, Math.floor(w)));
        var s1 = s0 + 1;
        var w1 = w0 + 1;
        return t[s0][w0] * (s1 - s) * (w1 - w) +
            t[s0][w1] * (s1 - s) * (w - w0) +
            t[s1][w0] * (s - s0) * (w1 - w) +
            t[s1][w1] * (s - s0) * (w - w0);
    };
}

var probability = tableInterpolate(probabilityDiceTable);
var successes = tableInterpolate(successTable);

// $(function () {

//  var table = Table([],3);
//  for (var stufe = 1; stufe < Stufen.length-1; stufe++) {
//    table.newRow();
//    var dices = Dices(Stufen[stufe]);
//    table.col("Stufe",stufe);
//    table.col("Würfel",Stufen[stufe]);
//    for (var wert = 1; wert < 100; wert++) {
//      table.col(wert,(probability(stufe,wert) - dices.probabilityToReach(wert,1000)).toFixed(1));
//    }
//  }
//  $('body').append(table.toHtml());


//  Dices(Stufen[4]).probabilityToReach(4);
//  
//  var maxValue = 501;
//  var maxStufe = Stufen.length;
//  var t = new Array(maxStufe);
//  for (var i = 0; i < maxStufe; i++) {
//    t[i] = new Array(maxValue);
//    var dices = Dices(Stufen[i]);
//    for (var j = 0; j < maxValue; j++) {
//      t[i][j] = dices.probabilityToReach(j,10000);
//    }
//  }
//  $('body').text(JSON.stringify(t));

//  var table = Table([],3);
//  for (var stufe = 1; stufe < Stufen.length; stufe++) {
//    table.newRow();
//    var dices = Dices(Stufen[stufe]);
//    table.col("Stufe",stufe);
//    table.col("Würfel",Stufen[stufe]);
//    for (var wert = 1; wert < 100; wert++) {
//      table.col(wert,dices.probabilityToReach(wert));
//    }
//  }
//  $('body').append(table.toHtml());

    // var table = Table([], 3);
    // for (let stufe = 1; stufe < Stufen.length - 1; stufe++) {
    //     table.newRow();
    //     var dices = Dices(Stufen[stufe]);
    //     table.col("Stufe", stufe);
    //     table.col("Würfel", Stufen[stufe]);
    //     for (let wert = 1; wert < 500; wert++) {
    //         table.col(wert, dices.successes(wert, 1000).toFixed(4));
    //     }
    // }
    // $('body').append(table.toHtml());

     // var maxValue = 501;
     // var maxStufe = Stufen.length;
     // var t = new Array(maxStufe);
     // for (var i = 0; i < maxStufe; i++) {
     //   t[i] = new Array(maxValue);
     //   var dices = Dices(Stufen[i]);
     //   for (var j = 0; j < maxValue; j++) {
     //     t[i][j] = Math.round(dices.successes(j, 10000)*10000)/10000;
     //   }
     // }
     // $('body').text(JSON.stringify(t));

// });

