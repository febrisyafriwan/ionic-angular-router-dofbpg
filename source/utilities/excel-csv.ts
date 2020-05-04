import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ExportCsvProvider {
	header: any[] = [];
  constructor(public http: HttpClient) {
  }
  
  flatten(object, addToList, prefix) {
		this.header = [];
    Object.keys(object).map(key => {
        this.header.push(key.replace(/_/g, " ").replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); }));
        if (object[key] === null) {
            addToList.push("null");
        } else if (object[key] instanceof Array) {
          let string = JSON.stringify(object[key]);
          addToList.push(string);
        } else if (typeof object[key] == 'object' && !object[key].toLocaleDateString) {
          let string = JSON.stringify(object[key]);
          addToList.push(string);
        }else{
          if (addToList instanceof Array) {
            addToList.push(object[key]);
          }else{
          	addToList[prefix + key] = object[key]
          }
        }
    })
    return addToList
  }

  exportToCsv(fileName, rows) {
      var processRow = function (row) {
          var finalVal = '';
          for (var j = 0; j < row.length; j++) {
              var innerValue = row[j]? row[j].toString() : '';
              if (row[j] instanceof Date) {
                  innerValue = row[j].toLocaleString();
              };
              var result = innerValue.replace(/"/g, '""');
              if (result.search(/("|,|\n)/g) >= 0)
                  result = '"' + result + '"';
              if (j > 0)
                  finalVal += ',';
              finalVal += result;
          }
          return finalVal + '\n';
      };

      var csvFile = '';
      csvFile += processRow(this.header);
      for (var i = 0; i < rows.length; i++) {
          csvFile += processRow(rows[i]);
      }

      var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' }); 

      if (navigator.msSaveBlob) { // IE 10+
          // navigator.msSaveBlob(blob, fileName);
      }

      return blob;
  }
}
