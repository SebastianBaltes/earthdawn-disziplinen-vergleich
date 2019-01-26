"use strict";

var Table = function(columns,defaultFixed) {

  if (typeof columns==='undefined') {
    columns = [];
  }
  if (typeof defaultFixed==='undefined') {
    defaultFixed = 0;
  }
  
  var rows = [];
  var row = {};
  rows.push(row);
  var fixedColumns = {};
  
  function newRow() {
    if (!_.isEmpty(row)) {
      row = {};
      rows.push(row);
    }
  }
  
  function col(name,value) {
    var fixedDigits = _.isUndefined(fixedColumns[name])?defaultFixed:fixedColumns[name];
    row[name]=(typeof value==='number')?value.toFixed(fixedDigits).replace(".",","):value;
    if (!_.includes(columns,name)) {
      columns.push(name);
    }
  }
  
  function fixed(name,fixedDigits) {
    fixedColumns[name] = fixedDigits;
  }

  function toHtmlTable() {
    var table = $("<table border='1' style='border-collapse:collapse;'><thead><tr/></thead><tbody/></table>");
    var theadTr = $('thead tr',table);
    var tbody = $('tbody',table);
    columns.forEach(function(col){
      var th = $("<th>");
      th.text(col);
      theadTr.append(th);
    });
    rows.forEach(function(row){
      var tr = $("<tr>");
      tbody.append(tr);
      columns.forEach(function(col){
        var td = $("<td>");
        td.text(row[col]);
        tr.append(td);
      });
    });
    return table;
  }
  
  return {
    newRow: newRow,
    col: col,
    toHtml: toHtmlTable,
    fixed: fixed
  };
  
};
  
