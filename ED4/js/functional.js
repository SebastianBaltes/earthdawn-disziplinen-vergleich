//"use strict";

function assertNumbers(numbers) {
    numbers.forEach(function (n) {
        if (!(n==null || _.isNumber(n) || _.isFunction(n))) {
            debugger;
        }
    });
    return true;
}

let ß_depth = 0;
function ß(name,f) {
    return f;
    // return function (x) {
    //     const tab = _.repeat(' ',ß_depth);
    //     console.log(tab+'>',name);
    //     ß_depth++;
    //     const r = f(x);
    //     ß_depth--;
    //     console.log(tab+'<',name,'=',r);
    //     return r;
    // }
}

function val(key) {
    return function (x) {
        // const tab = _.repeat(' ',ß_depth);
        const value = x[key];
        // console.log(tab+' ',key,'=',value);
        return value;
    };
}

function funValues(funs, x) {
    return _.map(funs, function (f) {
        return funValue(f, x);
    });
}

let $_depth = 0;
function funValue(fun, x) {
    if ($_depth++>100) {
        debugger;
        var v = fun(x);
        var fv = funValue(v, x);
    }
    try {
        if (fun==null) {
            return 0;
        }
        if (Number.isNaN(fun)) {
            console.warn(fun);
            return 0;
        }
        if (_.isFunction(fun)) {
            var v = fun(x);
            var fv = funValue(v, x);
            return fv;
        }
        return fun;
    } finally {
        $_depth--;
    }
}

function add() {
    var funs = arguments;
    return function (x) {
        return _.reduce(funValues(funs, x), function (memo, num) {
            return memo + num;
        }, 0);
    };
}

function mul() {
    var funs = arguments;
    return function (x) {
        return _.reduce(funValues(funs, x), function (memo, num) {
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

function _floor(a) {
    return function (x) {
        return Math.floor(funValue(a, x));
    };
}

function pow(a, b) {
    return function (x) {
        return Math.pow(funValue(a, x), funValue(b, x));
    };
}

function later(key) {
    return function (x) {
        return window[key];
    };
}

function property(obj, key) {
    return function (x) {
        // const tab = _.repeat(' ',ß_depth);
        const o = funValue(obj, x);
        const k = funValue(key, x);
        // if (!_.isObject(o)) {
        //     debugger;
        // }
        // if (!_.isString(k)) {
        //     debugger;
        // }
        const value = o[k];
        // console.log(tab+' ',k,'=',value);
        return value;
    };
}

function navigate(x, path) {
    var xs = _.reduce(_.initial(path.split(".")), function (list, prop) {

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
        return _.reduce(list, function (memo, num) {
            return memo + num;
        }, 0);
    };
}

function integrate(start, end, f2) {
    return x => _.range(start, end).reduce((acc, i) => acc + f2(i)(x), 0);
}

function nth(index_,array_) {
    return x => {
        const index = funValue(index_,x);
        const array = funValue(array_,x);
        const i = Math.max(0,Math.min(array.length-1,index));
        console.log(index,i);
        return array[i];
    };
}