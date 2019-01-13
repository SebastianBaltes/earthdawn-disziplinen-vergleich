//"use strict";

function funValues(funs, x) {
    return _.map(funs, function (f) {
        return funValue(f, x);
    });
}

function funValue(fun, x) {
    if (fun==null) {
        return 0;
    }
    if (Number.isNaN(fun)) {
        console.warn(fun);
        return 0;
    }
    if (_.isFunction(fun)) {
        return funValue(fun(x), x);
    }
    return fun;
}

function add() {
    var funs = arguments;
    return function (x) {
        return _.foldl(funValues(funs, x), function (memo, num) {
            return memo + num;
        }, 0);
    };
}

function mul() {
    var funs = arguments;
    return function (x) {
        return _.foldl(funValues(funs, x), function (memo, num) {
            return memo * num;
        }, 1);
    };
}

function debug(a) {
    return function (x) {
        return a(x);
    };
}

function max(a, b) {
    return function (x) {
        return Math.max(funValue(a, x), funValue(b, x));
    };
}

function min(a, b) {
    return function (x) {
        return Math.min(funValue(a, x), funValue(b, x));
    };
}

function sub(a, b) {
    return function (x) {
        return funValue(a, x) - funValue(b, x);
    };
}

function div(a, b) {
    return function (x) {
        return funValue(a, x) / funValue(b, x);
    };
}

function pow(a, b) {
    return function (x) {
        return Math.pow(funValue(a, x), funValue(b, x));
    };
}

function val(key) {
    return function (x) {
        return x[key];
    };
}

function evaluate(js) {
    return function () {
        return eval(js);
    };
}

function property(obj, key) {
    return function (x) {
        return funValue(obj, x)[funValue(key, x)];
    };
}

function navigate(x, path) {
    var xs = _.foldl(_.initial(path.split(".")), function (list, prop) {

        var subList = _.flatten(_.map(list, function (o) {
            var v = o[funValue(prop, o)];
            if (!_.isArray(v)) {
                v = [v];
            }
            var w = _.map(v, function (sub) {
                return _.extend({}, o, sub);
            });
            return w;
        }), true);

        return subList;
    }, [x]);
    var key = _.last(path.split("."));
    return _.map(xs, function (o) {
        return o[key](o);
    });
}

function sumOver(key) {
    return function (x) {
        var list = navigate(x, key);
        return _.foldl(list, function (memo, num) {
            return memo + num;
        }, 0);
    };
}

function integrate(start, end, f2) {
    return x => _.range(start, end).reduce((acc, i) => acc + f2(i)(x), 0);
}

