"use strict";

function storage_save(varName) {
    sessionStorage[varName] = JSON.stringify(window[varName]);
}

function storage_load(varName) {
    if (sessionStorage[varName] !== undefined) {
        window[varName] = JSON.parse(sessionStorage[varName]);
    }
}

function Slider(varName, min, max, step, onChange, fun = 'linear') {
    var f = x => x;
    var f_ = x => x;
    var _min = min;
    var _max = max;
    var _step = step;
    if (fun == 'quadratic') {
        f = x => Math.round((Math.pow(x, 2) * (max - min) + min)*step)/step;
        f_ = x => Math.pow((x - min) / (max - min), 0.5);
        _step = 1/((max-min)*step);
        _min = 0;
        _max = 1;
    }
    var div = $('<div class="slider"><span class="label">' + varName + '</span><input type="range" min="' + _min + '" max="' + _max + '" step="' + _step + '"/><span class="value"></span></div>');
    var input = $('input', div);
    var text = $('.value', div);
    $('body').on('uirefresh', init);
    storage_load(varName);
    init();

    function init() {
        text.text(get());
        input.val(f_(get()));
    }

    var onChangeDebounced = _.debounce(onChange, 300);
    input.change(function () {
        set(f(input.val()));
        text.text(get());
        onChangeDebounced();
        storage_save(varName);
    });

    function get() {
        return parseFloat(window[varName]);
    };

    function set(val) {
        window[varName] = parseFloat(val);
    };
    return div;
};

function MultiSelect(varName, options, onChange) {
    var div = $('<div class="MultiSelect"><span class="label">' + varName + '</span><select multiple="multiple"></select></div>');
    var select = $('select', div);
    options.forEach((e) => {
        select.append('<option value="' + e + '">' + e + '</option>');
    });
    storage_load(varName);
    get();
    var onChangeDebounced = _.debounce(onChange, 300);
    select.change(() => {
        set();
        onChangeDebounced();
        storage_save(varName);
    });

    function get() {
        $('option', select).prop('selected', false);
        window[varName].forEach(value => {
            $('option[value="' + value + '"]', select).prop('selected', true);
        });
    };

    function set() {
        window[varName] = $(':selected', select).map(function () {
            return $(this).val()
        }).toArray();
        console.log(window[varName]);
    };
    return div;
};

function SingleSelect(varName, options, onChange) {
    var div = $('<div class="SingleSelect"><span class="label">' + varName + '</span><select></select></div>');
    var select = $('select', div);
    options.forEach((e) => {
        select.append('<option value="' + e + '">' + e + '</option>');
    });
    storage_load(varName);
    get();
    var onChangeDebounced = _.debounce(onChange, 300);
    select.change(() => {
        set();
        onChangeDebounced();
        storage_save(varName);
    });

    function get() {
        select.val(window[varName]);
    };

    function set() {
        window[varName] = select.val();
        console.log(window[varName]);
    };
    return div;
};
