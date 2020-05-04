import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Response, ResponseOptions, RequestOptions, Headers, Http } from '@angular/http';
import { HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import { URLServices } from '../url-services';

@Injectable()
export class ContestProvider {

  constructor(public http: HttpClient, public _http: Http, public storage: Storage, public urlServices: URLServices) {
  }

  public insertImage(_encrypted, Authorization): Observable<any[]> {
    let body: FormData = new FormData();
    body.append('file', _encrypted.file);
    body.append('module', _encrypted.module);
    body.append('fileName', _encrypted.fileName);
    body.append('extension', _encrypted.extension);

    let url = this.urlServices.admin + "/base/commonFile/upload2";

    let headers = new HttpHeaders({
      //   'Content-Type': 'application/json',
      'X-Requested-Method': 'POST',
      'Authorization': Authorization
    });

    let options = { headers: headers };

    return this.http.post(url, body, options)
      .map(this.extractData)
      .catch((error:any) => { return Observable.throw(error) });
  }

  public getImage(body): Observable<any> {
    let url = this.urlServices.admin + "/base/commonFile/getFile?fileName=" + body.fileName + "&module=" + body.module;

    return this._http.get(url).map(
      (res: any) => { return res._body }
    )
  }

  public getFile(body): Observable<any> {
    let url = this.urlServices.admin + "/base/commonFile/getFile?fileName=" + body.fileName + "&module=" + body.module;

    return this._http.get(url).map(
      (res: any) => { return res._body.blob() }
    )
  }

  /**
   * Return observeable of master data request
   * @param _encrypted 
   * @param Authorization 
   */
  public getAllContestCategory(_encrypted, Authorization): Observable<any[]> {
    let url = this.urlServices.admin + '/contests/category';

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-Url': url,
      'X-Requested-Method': 'GET',
      'Authorization': Authorization
    });
    let options = { headers: headers };

    return this.http.get(this.urlServices.baseProxy, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public insertContestCategory(body, Authorization) {
    let url = this.urlServices.admin + "/contests/category";

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-Url': url,
      'X-Requested-Method': 'POST',
      'Authorization': Authorization
    });
    let options = { headers: headers };

    return this.http.post(this.urlServices.baseProxy, body, options)
      .map(this.extractData)
      .catch((error:any) => { return Observable.throw(error) });
  }

  public updateContestCategory(id, body, Authorization) {
    let url = this.urlServices.admin + "/contests/category/" + id;

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-Url': url,
      'X-Requested-Method': 'PUT',
      'Authorization': Authorization
    });
    let options = { headers: headers };

    return this.http.put(this.urlServices.baseProxy, body, options)
      .map(this.extractData)
      .catch((error:any) => { return Observable.throw(error) });
  }

  public deleteContestCategory(id, Authorization) {
    let url = this.urlServices.admin + "/contests/category/" + id;

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-Url': url,
      'X-Requested-Method': 'DELETE',
      'Authorization': Authorization
    });
    let options = { headers: headers };

    return this.http.delete(this.urlServices.baseProxy, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  // # Contest Level

  public getAllContestLevel(Authorization): Observable<any[]> {
    let url = this.urlServices.admin + '/contests/level';

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-Url': url,
      'X-Requested-Method': 'GET',
      'Authorization': Authorization
    });
    let options = { headers: headers };

    return this.http.get(this.urlServices.baseProxy, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public insertContestLevel(body, Authorization) {
    let url = this.urlServices.admin + "/contests/level";

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-Url': url,
      'X-Requested-Method': 'POST',
      'Authorization': Authorization
    });
    let options = { headers: headers };

    return this.http.post(this.urlServices.baseProxy, body, options)
      .map(this.extractData)
      .catch((error:any) => { return Observable.throw(error) });
  }

  public updateContestLevel(id, body, Authorization) {
    let url = this.urlServices.admin + "/contests/level/" + id;

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-Url': url,
      'X-Requested-Method': 'PUT',
      'Authorization': Authorization
    });
    let options = { headers: headers };

    return this.http.put(this.urlServices.baseProxy, body, options)
      .map(this.extractData)
      .catch((error:any) => { return Observable.throw(error) });
  }

  public deleteContestLevel(id, Authorization) {
    let url = this.urlServices.admin + "/contests/level/" + id;

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-Url': url,
      'X-Requested-Method': 'DELETE',
      'Authorization': Authorization
    });
    let options = { headers: headers };

    return this.http.delete(this.urlServices.baseProxy, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  // # End Contest Level

  // # Criteria Category

  public getAllCriteriaCategory(Authorization): Observable<any[]> {
    let url = this.urlServices.admin + '/contests/criteria_category';

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-Url': url,
      'X-Requested-Method': 'GET',
      'Authorization': Authorization
    });
    let options = { headers: headers };

    return this.http.get(this.urlServices.baseProxy, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public insertCriteriaCategory(body, Authorization) {
    let url = this.urlServices.admin + "/contests/criteria_category";

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-Url': url,
      'X-Requested-Method': 'POST',
      'Authorization': Authorization
    });
    let options = { headers: headers };

    return this.http.post(this.urlServices.baseProxy, body, options)
      .map(this.extractData)
      .catch((error:any) => { return Observable.throw(error) });
  }

  public updateCriteriaCategory(id, body, Authorization) {
    let url = this.urlServices.admin + "/contests/criteria_category/" + id;

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-Url': url,
      'X-Requested-Method': 'PUT',
      'Authorization': Authorization
    });
    let options = { headers: headers };

    return this.http.put(this.urlServices.baseProxy, body, options)
      .map(this.extractData)
      .catch((error:any) => { return Observable.throw(error) });
  }

  public deleteCriteriaCategory(id, Authorization) {
    let url = this.urlServices.admin + "/contests/criteria_category/" + id;

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-Url': url,
      'X-Requested-Method': 'DELETE',
      'Authorization': Authorization
    });
    let options = { headers: headers };

    return this.http.delete(this.urlServices.baseProxy, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  // # End of Criteria Category

  // # Criteria Type

  public getAllCriteriaType(Authorization): Observable<any[]> {
    let url = this.urlServices.admin + '/contests/criteria_type';

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-Url': url,
      'X-Requested-Method': 'GET',
      'Authorization': Authorization
    });
    let options = { headers: headers };

    return this.http.get(this.urlServices.baseProxy, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public insertCriteriaType(body, Authorization) {
    let url = this.urlServices.admin + "/contests/criteria_type";

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-Url': url,
      'X-Requested-Method': 'POST',
      'Authorization': Authorization
    });
    let options = { headers: headers };

    return this.http.post(this.urlServices.baseProxy, body, options)
      .map(this.extractData)
      .catch((error:any) => { return Observable.throw(error) });
  }

  public updateCriteriaType(id, body, Authorization) {
    let url = this.urlServices.admin + "/contests/criteria_type/" + id;

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-Url': url,
      'X-Requested-Method': 'PUT',
      'Authorization': Authorization
    });
    let options = { headers: headers };

    return this.http.put(this.urlServices.baseProxy, body, options)
      .map(this.extractData)
      .catch((error:any) => { return Observable.throw(error) });
  }

  public deleteCriteriaType(id, Authorization) {
    let url = this.urlServices.admin + "/contests/criteria_type/" + id;

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-Url': url,
      'X-Requested-Method': 'DELETE',
      'Authorization': Authorization
    });
    let options = { headers: headers };

    return this.http.delete(this.urlServices.baseProxy, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  // # End Criteria Type

  // # Contest
  public getAllContest(Authorization): Observable<any[]> {
    let url = this.urlServices.admin + '/contests/contests';

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-Url': url,
      'X-Requested-Method': 'GET',
      'Authorization': Authorization
    });
    let options = { headers: headers };

    return this.http.get(this.urlServices.baseProxy, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public insertContest(body, Authorization) {
    let url = this.urlServices.admin + "/contests/contests";

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-Url': url,
      'X-Requested-Method': 'POST',
      'Authorization': Authorization
    });
    let options = { headers: headers };

    return this.http.post(this.urlServices.baseProxy, body, options)
      .map(this.extractData)
      .catch((error:any) => { return Observable.throw(error) });
  }

  public updateContest(id, body, Authorization) {
    let url = this.urlServices.admin + "/contests/contests/" + id;

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-Url': url,
      'X-Requested-Method': 'PUT',
      'Authorization': Authorization
    });
    let options = { headers: headers };

    return this.http.put(this.urlServices.baseProxy, body, options)
      .map(this.extractData)
      .catch((error:any) => { return Observable.throw(error) });
  }

  public deleteContest(id, Authorization) {
    let url = this.urlServices.admin + "/contests/contests/" + id;

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-Url': url,
      'X-Requested-Method': 'DELETE',
      'Authorization': Authorization
    });
    let options = { headers: headers };

    return this.http.delete(this.urlServices.baseProxy, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getListSearch(url, Authorization) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-Url': url,
      'X-Requested-Method': 'GET',
      'Authorization': Authorization
    });
    let options = { headers: headers };

    return this.http.get(this.urlServices.baseProxy, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  insertAdditionaApi(body, Authorization): Observable<any[]> {

    let formData: FormData = new FormData();
    formData.append('file', body.file, body.file.name);

    let url = this.urlServices.admin + "/contests/contests/result/upload/additional_api?contest_code=" + body.code_contest + "&created_by=" + body.created_by;

    // let headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      // 'Content-Type': 'multipart/form-data',
    //   'X-Requested-Url': url,
    //   'X-Requested-Method': 'POST',
    //   'Authorization': Authorization
    // });

    // let options = { headers: headers };
    
    let headers = new Headers({});
    let options = new RequestOptions({headers});

    return this._http.post(url, formData, options)
      
    .map((res: any) => { return res.body })
    .catch((error:any) => { return Observable.throw(error.json()) });
  }

  insertWinner(body, Authorization): Observable<any[]> {
    let url = this.urlServices.admin + "/contests/contests/result/upload/winner?contest_code=" + body.code_contest + "&created_by=" + body.created_by;

    let formData: FormData = new FormData();
    formData.append('file', body.file, body.file.name);

    // let headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      // 'Content-Type': 'multipart/form-data',
      // 'X-Requested-Url': url,
      // 'X-Requested-Method': 'POST',
      // 'Authorization': Authorization
    // });

    // let options = { headers: headers };

    let headers = new Headers({});
    let options = new RequestOptions({headers});

    return this._http.post(url, formData, options)
      .map(this.extractData)
      .catch((error:any) => { return Observable.throw(error.json()) });
  }

  insertMentoring(body,url): Observable<any[]> {

    let formData: FormData = new FormData();
    formData.append('file', body.file);

    // let headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      // 'Content-Type': 'multipart/form-data',
      // 'X-Requested-Url': url,
      // 'X-Requested-Method': 'POST',
      // 'Authorization': Authorization
    // });

    // let options = { headers: headers };

    let headers = new Headers({});
    let options = new RequestOptions({headers});

    return this._http.post(url, formData, options)
      .map(this.extractData)
      .catch((error:HttpErrorResponse) => { return Observable.throw(error)});
  }

  checkContestCode(param, Authorization) {
    let url = this.urlServices.admin + "/contests/contests/checkCodeContest?code_contest="+param;

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-Url': url,
      'X-Requested-Method': 'GET',
      'Authorization': Authorization
    });
    let options = { headers: headers };

    return this.http.get(this.urlServices.baseProxy, options)
      .map((res: any) => { return res })
      .catch(this.handleError);
  }

  getSnapDate(code, Authorization){
    let url = this.urlServices.admin + '/contests/contests/result/snap_date?contests_code='+code;
    // let url = this.urlServices.admin + '/contests/contests/result/snap_date?contests_code=PAC2019';

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-Url': url,
      'X-Requested-Method': 'GET',
      'Authorization': Authorization
    });
    let options = { headers: headers };

    return this.http.get(this.urlServices.baseProxy, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getReport(body, limit, offset , snap_date, Authorization){
    
    let url = this.urlServices.admin + '/contests/contests/result/report/table?contest_code='+body.code_contest+'&snap_date='+snap_date+'&offset='+offset+'&limit='+limit+'&radd_name=' + body.radd_name + '&ads_name=' + body.ads_name + '&office_code=' + body.office_code+'&order_by=desc&download=false';
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-Url': url,
      'X-Requested-Method': 'GET',
      'Authorization': Authorization
    });
    let options = { headers: headers };

    return this.http.get(this.urlServices.baseProxy, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  downloadReport(Authorization, _body){
    let url = this.urlServices.admin+ '/contests/contests/result/report/requestdownload';
    let body = _body;

    let headers    = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-Url': url,
      'X-Requested-Method': 'POST',
      'Authorization': Authorization
    });
    let options    = { headers: headers };

    return this.http.post(this.urlServices.baseProxy, body, options)
    .map(this.extractData)
    .catch(this.handleError);
  }

  downloadReportFinish(Authorization, id_report){
    let url = this.urlServices.admin+ '/contests/contests/result/report/requestdownload/finish?id_report='+id_report;

    let headers    = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-Url': url,
      'X-Requested-Method': 'GET',
      'Authorization': Authorization
    });
    let options    = { headers: headers };

    return this.http.get(this.urlServices.baseProxy, options)
    .map(this.extractData)
    .catch(this.handleError);
  }
  
  downloadFileReport(Authorization, id_report){
    let url = this.urlServices.admin+ '/contests/contests/result/report/requestdownload/report?id_report='+id_report;
  
    let headers    = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-Url': url,
      'X-Requested-Method': 'GET',
      'Authorization': Authorization
    });
    let options    = { headers: headers };
  
    return this.http.get(this.urlServices.baseProxy, options)
    .map(this.extractData)
    .catch(this.handleError);
  }

  getFakeApi(){
    return this.http.get('https://jsonplaceholder.typicode.com/comments')
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(body: any) {
    return Object.assign(body);
  }

  private extractImage(body: any) {
    return body;
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