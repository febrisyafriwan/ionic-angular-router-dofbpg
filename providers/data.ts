import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/Rx';

/*
  Generated class for the PersistencyProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {


  constructor(public http: HttpClient) {
   
  }

  getData(): Observable<any> {
    
    let url = "https://jsonplaceholder.typicode.com/todos/1";
    let response:any; 
    let headers    = new HttpHeaders({  
      'Content-Type': 'application/json', 
      // 'X-Requested-Url': url, 
      // 'X-Requested-Method': 'POST', 
      // 'Authorization': Authorization 
    }); 
    let options    = { headers: headers }; 

    return this.http
      .get(url) 
      .map(this.extractData) 
      .catch(this.handleError); 
  }

  // ------------------------------------------------------------------------------------------------------


  private extractData(body: any) {
    return Object.assign(body);
  }

  private handleError(error: HttpErrorResponse | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    let errObj: any;

    if (error instanceof HttpErrorResponse) {
      const err = error.message || JSON.stringify(error);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      errObj = error.message;
    } else {
      errMsg = error.message ? error.message : error.toString();
      const body = error.message || '';
      errObj = body;
    }

    return Observable.throw(errObj);
  }
}
