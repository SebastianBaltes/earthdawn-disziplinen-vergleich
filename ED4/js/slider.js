"use strict";

var Slider = function(varName,min,max,step,onChange) {
  var div = $('<div class="slider"><span class="label">'+varName+'</span><input type="range" min="'+min+'" max="'+max+'" step="'+step+'" value="'+get()+'"/><span class="value"></span></div>');
  var input = $('input',div);
  var text = $('.value',div);
  text.text(get());
  var onChangeDebounced = _.debounce(onChange,300);
  input.change(function(){
    set(input.val());
    text.text(get());
    onChangeDebounced();
  });
  function get() {
    return parseFloat(window[varName]);
  };
  function set(val) {
      window[varName]=parseFloat(val);
  };
  return div;
};