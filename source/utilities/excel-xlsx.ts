import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
type AOA = any[][];
@Injectable()
export class ExportExcelProvider {
    constructor(public http: HttpClient) {
        console.log("helo excelprov");

    }
    
    getSheet(columNames, dataFields, exportData) {
        var data = [];
        data.push(columNames);
        var rowData;
        exportData.forEach(value => {
            rowData = [];
            dataFields.forEach(column => {
                rowData.push(value[column])
            });
            data.push(rowData)
        });

        data.push([]);
        rowData = [];
        for (let i = 0; i < dataFields.length; i++) {
            rowData.push("")
        }
        rowData.push("Rows Exported");
        rowData.push(exportData.length);
        data.push(rowData);
        return data
    }

    export(options): void {
        var fileName = options.fileName;
        var dataArr = this.getSheet(options.columNames, options.dataFields, options.exportData)
        /* generate worksheet */
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dataArr);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, fileName + '.xlsx');
    }
}


