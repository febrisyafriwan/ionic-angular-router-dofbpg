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
export class ProductionProvider {

    constructor(public http: HttpClient, public _http: Http, public storage: Storage, public urlServices: URLServices) {
    }

    //Service Policy
    public getPolicy(Authorization, _body) {
        let body: any = _body;
        let url = this.urlServices.admin + '/production2/production/table?period=' + body.period + '&from=' + body.from + '&to=' + body.to + '&life_client_number=' + body.life_client_number + '&agent_number=' + body.agent_number + '&leader_number=' + body.leader_number + '&policy_number=' + body.policy_number + '&product_code=' + body.product_code + '&product_name=' + body.product_name + '&transaction_code=' + body.transaction_code + '&desc2=' + body.desc2;
        url += '&premium_category=' + body.premium_category + '&billing_frequency=' + body.billing_frequency + '&channel=' + body.channel + '&pflag=' + body.pflag;
        url += '&transaction_reference=' + body.transaction_reference + '&delete_flag=' + body.delete_flag + '&reversal_indicator=' + body.reversal_indicator;
        url += '&currency=' + body.currency +'&source_flag=' +body.source_flag + '&orderBy=' + body.orderBy + '&orderType=' + body.orderType + '&offset=' + body.offset + '&limit=' + body.limit;
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    public getPolicyTotalData(Authorization, _body) {
        let body: any = _body;
        let url = this.urlServices.admin + '/production2/production/page?period=' + body.period + '&from=' + body.from + '&to=' + body.to ;

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    // Service KPM
    public getKpmSnapDate(Authorization) {
        let body = {};
        let url = this.urlServices.admin + '/production2/kpm/list/snapdate';

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public getKpmYtdSnapDate(Authorization) {
        let body = {};
        let url = this.urlServices.admin + '/production2/kpm-ytd/list/snapdate';

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public getKpm(Authorization, _body) {
        let body: any = _body;
        let url = this.urlServices.admin + '/production2/kpm/table?period=' + body.period + '&from=' + body.from + '&to=' + body.to + '&snap_date=' + body.snap_date + '&office_code=' + body.office_code + '&office_name=' + body.office_name + '&ga_owner_code=' + body.ga_owner_code + '&ads_name=' + body.ads_name + '&radd_name=' + body.radd_name + '&orderBy=' + body.orderBy + '&sortType=' + body.sortType + '&offset=' + body.offset + '&limit=' + body.limit;

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public getKpmYtd(Authorization, _body) {
        let body: any = _body;
        let url = this.urlServices.admin + '/production2/kpm-ytd/table?period=' + body.period + '&from=' + body.from + '&to=' + body.to + '&snap_date=' + body.snap_date + '&office_code=' + body.office_code + '&office_name=' + body.office_name + '&ga_owner_code=' + body.ga_owner_code + '&ads_name=' + body.ads_name + '&radd_name=' + body.radd_name + '&orderBy=' + body.orderBy + '&sortType=' + body.sortType + '&offset=' + body.offset + '&limit=' + body.limit;

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public getKpmTotalData(Authorization, _body) {
        let body: any = _body;
        let url = this.urlServices.admin + '/production2/kpm/table/page?period=' + body.period + '&from=' + body.from + '&to=' + body.to + '&snap_date=' + body.snap_date + '&office_code=' + body.office_code + '&office_name=' + body.office_name + '&ga_owner_code=' + body.ga_owner_code + '&ads_name=' + body.ads_name + '&radd_name=' + body.radd_name;

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, "", options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    
    public getKpmYtdTotalData(Authorization, _body) {
        let body: any = _body;
        let url = this.urlServices.admin + '/production2/kpm-ytd/table/page?period=' + body.period + '&from=' + body.from + '&to=' + body.to + '&snap_date=' + body.snap_date + '&office_code=' + body.office_code + '&office_name=' + body.office_name + '&ga_owner_code=' + body.ga_owner_code + '&ads_name=' + body.ads_name + '&radd_name=' + body.radd_name;

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, "", options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    // Service Leader
    public getLeader(Authorization, _body) {
        let body: any = _body;
        let url = this.urlServices.admin + '/production2/unit/table?period=' + body.period + '&from=' + body.from + '&to=' + body.to + '&snap_date='+ body.snap_date + '&unit_number=' + body.unit_number + '&office_code=' + body.office_code + '&office_name=' + body.office_name + '&unit_name=' + body.unit_name + '&unit_agent_type=' + body.unit_agent_type + '&ads_name=' + body.ads_name + '&radd_name=' + body.radd_name + '&orderBy=' + body.orderBy + '&sortType=' + body.sortType + '&offset=' + body.offset + '&limit=' + body.limit;

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public getLeaderTotalData(Authorization, _body) {
        let body: any = _body;
        let url = this.urlServices.admin + '/production2/unit/table/page?period=' + body.period + '&from=' + body.from + '&to=' + body.to + '&snap_date='+ body.snap_date + '&unit_number=' + body.unit_number + '&office_code=' + body.office_code + '&office_name=' + body.office_name + '&unit_name=' + body.unit_name + '&unit_agent_type=' + body.unit_agent_type + '&ads_name=' + body.ads_name + '&radd_name=' + body.radd_name ;

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, "", options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    // Service Unit
    public getUnitSnapDate(Authorization) {
        let body = {};
        let url = this.urlServices.admin + '/production2/unit/list/snapdate';

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    // Service Agent

    public getIndividuSnapDate(Authorization) {
        let body = {};
        let url = this.urlServices.admin + '/production2/individual/list/snapdate';

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public getAgent(Authorization, _body) {
        let body: any = _body;
        let url = this.urlServices.admin + '/production2/individual/table?period=' + body.period + '&from=' + body.from + '&to=' + body.to + '&office_code=' + body.office_code + '&office_name=' + body.office_name + '&ads_name=' + body.ads_name + '&radd_name=' + body.radd_name + '&orderBy=' + body.orderBy + '&sortType=' + body.sortType + '&offset=' + body.offset + '&limit=' + body.limit;
        url += '&snap_date=' + body.snap_date + '&leader_number=' + body.leader_number + '&leader_name=' + body.leader_name + '&leader_agent_type=' + body.leader_agent_type;
        url += '&unit_number=' + body.unit_number + '&unit_name=' + body.unit_name + '&unit_agent_type=' + body.unit_agent_type;
        url += '&group_number=' + body.group_number + '&group_name=' + body.group_name + '&group_agent_type=' + body.group_agent_type;
        url += '&agent_number=' + body.agent_number + '&agent_name=' + body.agent_name + '&agent_type=' + body.agent_type;
        
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public getAgentTotalData(Authorization, _body) {
        let body: any = _body;
        let url = this.urlServices.admin + '/production2/individual/table/page?period=' + body.period + '&from=' + body.from + '&to=' + body.to + '&office_code=' + body.office_code + '&office_name=' + body.office_name + '&ads_name=' + body.ads_name + '&radd_name=' + body.radd_name;
        url += '&snap_date=' + body.snap_date + '&leader_number=' + body.leader_number + '&leader_name=' + body.leader_name + '&leader_agent_type=' + body.leader_agent_type;
        url += '&unit_number=' + body.unit_number + '&unit_name=' + body.unit_name + '&unit_agent_type=' + body.unit_agent_type;
        url += '&group_number=' + body.group_number + '&group_name=' + body.group_name + '&group_agent_type=' + body.group_agent_type;
        url += '&agent_number=' + body.agent_number + '&agent_name=' + body.agent_name + '&agent_type=' + body.agent_type;

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, "", options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    // Service Group
    public getGroupSnapDate(Authorization) {
        let body = {};
        let url = this.urlServices.admin + '/production2/group/list/snapdate';

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public getGroupYtdSnapDate(Authorization) {
        let body = {};
        let url = this.urlServices.admin + '/production2/group-ytd/list/snapdate';

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public getGroup(Authorization, _body) {
        let body: any = _body;
        let url = this.urlServices.admin + '/production2/group/table?period=' + body.period + '&from=' + body.from + '&to=' + body.to + '&snap_date=' + body.snap_date + '&office_code=' + body.office_code + '&office_name=' + body.office_name + '&group_agent_type=' + body.group_agent_type + '&ads_name=' + body.ads_name + '&radd_name=' + body.radd_name + '&orderBy=' + body.orderBy + '&sortType=' + body.sortType + '&offset=' + body.offset + '&limit=' + body.limit + '&group_number=' + body.group_number + '&group_name=' + body.group_name;

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    
    public getGroupYtd(Authorization, _body) {
        let body: any = _body;
        let url = this.urlServices.admin + '/production2/group-ytd/table?period=' + body.period + '&from=' + body.from + '&to=' + body.to + '&snap_date=' + body.snap_date + '&office_code=' + body.office_code + '&office_name=' + body.office_name + '&group_agent_type=' + body.group_agent_type + '&ads_name=' + body.ads_name + '&radd_name=' + body.radd_name + '&orderBy=' + body.orderBy + '&sortType=' + body.sortType + '&offset=' + body.offset + '&limit=' + body.limit + '&group_number=' + body.group_number + '&group_name=' + body.group_name;

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public getGroupTotalData(Authorization, _body) {
        let body: any = _body;
        let url = this.urlServices.admin + '/production2/group/table/page?period=' + body.period + '&from=' + body.from + '&to=' + body.to + '&snap_date=' + body.snap_date + '&office_code=' + body.office_code + '&office_name=' + body.office_name + '&group_agent_type=' + body.group_agent_type + '&ads_name=' + body.ads_name + '&radd_name=' + body.radd_name + '&group_number=' + body.group_number + '&group_name=' + body.group_name;

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, "", options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    
    public getGroupYtdTotalData(Authorization, _body) {
        let body: any = _body;
        let url = this.urlServices.admin + '/production2/group-ytd/table/page?period=' + body.period + '&from=' + body.from + '&to=' + body.to + '&snap_date=' + body.snap_date + '&office_code=' + body.office_code + '&office_name=' + body.office_name + '&group_agent_type=' + body.group_agent_type + '&ads_name=' + body.ads_name + '&radd_name=' + body.radd_name + '&group_number=' + body.group_number + '&group_name=' + body.group_name;

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, "", options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    // Service Adonad
    public getAdOnAdSnapDate(Authorization) {
        let body = {};
        let url = this.urlServices.admin + '/production2/adonad/list/snapdate';

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    //------------------------------------------
    public getAdOnAdYtdSnapDate(Authorization) {
        let body = {};
        let url = this.urlServices.admin + '/production2/adonad-ytd/list/snapdate';

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public getAdOnAd(Authorization, _body) {
        let body: any = _body;
        let url = this.urlServices.admin + '/production2/adonad/table?period=' + body.period + '&from=' + body.from + '&to=' + body.to + '&snap_date=' + body.snap_date + '&adad_number=' + body.adad_number + '&adad_name=' + body.adad_name + '&adad_agent_type=' + body.adad_agent_type + '&office_code=' + body.office_code + '&office_name=' + body.office_name + '&ads_name=' + body.ads_name + '&radd_name=' + body.radd_name + '&orderBy=' + body.orderBy + '&sortType=' + body.sortType + '&offset=' + body.offset + '&limit=' + body.limit;

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    //------------------------------------------
    public getAdOnAdYtd(Authorization, _body) {
        let body: any = _body;
        let url = this.urlServices.admin + '/production2/adonad-ytd/table?period=' + body.period + '&from=' + body.from + '&to=' + body.to + '&snap_date=' + body.snap_date + '&adad_number=' + body.adad_number + '&adad_name=' + body.adad_name + '&adad_agent_type=' + body.adad_agent_type + '&office_code=' + body.office_code + '&office_name=' + body.office_name + '&ads_name=' + body.ads_name + '&radd_name=' + body.radd_name + '&orderBy=' + body.orderBy + '&sortType=' + body.sortType + '&offset=' + body.offset + '&limit=' + body.limit;

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public getAdOnADTotalData(Authorization, _body) {
        let body: any = _body;
        let url = this.urlServices.admin + '/production2/adonad/table/page?period=' + body.period + '&from=' + body.from + '&to=' + body.to + '&snap_date=' + body.snap_date + '&adad_number=' + body.adad_number + '&adad_name=' + body.adad_name + '&adad_agent_type=' + body.adad_agent_type + '&office_code=' + body.office_code + '&office_name=' + body.office_name + '&ads_name=' + body.ads_name + '&radd_name=' + body.radd_name;

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, "", options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public getAdOnADYtdTotalData(Authorization, _body) {
        let body: any = _body;
        let url = this.urlServices.admin + '/production2/adonad-ytd/table/page?period=' + body.period + '&from=' + body.from + '&to=' + body.to + '&snap_date=' + body.snap_date + '&adad_number=' + body.adad_number + '&adad_name=' + body.adad_name + '&adad_agent_type=' + body.adad_agent_type + '&office_code=' + body.office_code + '&office_name=' + body.office_name + '&ads_name=' + body.ads_name + '&radd_name=' + body.radd_name;

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, "", options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public sendDataReport(Authorization, _body) {
        let url = this.urlServices.admin + '/production2/report/request-download';
        let body = _body;

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public triggerReport(Authorization, id_report) {
        let url = this.urlServices.admin + '/production2/report/request-download/finish?id_report=' + id_report;
        let body = [];

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, body ,options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public getListFile(Authorization, type){
        let url = this.urlServices.admin + '/production2/report/request-download/table?production_type='+type+'&limit=10';
        let body = [];

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, body ,options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public downloadFile(Authorization, id){
        let url = this.urlServices.admin + '/production2/report/request-download/report?id_report='+id;
        let body = [];

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': url,
            'X-Requested-Method': 'POST',
            'Authorization': Authorization
        });
        let options = { headers: headers };

        return this.http.post(this.urlServices.baseProxy, body ,options)
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