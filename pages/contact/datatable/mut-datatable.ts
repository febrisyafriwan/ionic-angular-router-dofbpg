import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {Injectable, Component, Input, EventEmitter, Output} from '@angular/core';
import { ColumnParam } from './column/column-param';
import { DatatableFilter } from './filter-datatable';
import { MutDatatableParam } from './datatable-param';
import { PaginationParam } from './pagination-param';
import { LazyLoadParam } from './lazy-load-param';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController,ModalController, Events } from 'ionic-angular';
import { ReceivedResponse } from './received-response';

@Component({
  selector: 'mut-datatable',
  templateUrl: 'mut-datatable.html', 
})

/**
 * Datatable component for ez life
 * Author : Muhammad (Mut)tabi Hudaya
 */
export class MutDatatableComponent { 
public urlServices = 'http://10.170.49.199'
  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
  
  ){}
  //Pagination
  private isUsingPagination: boolean = false;
  public currentPage :number;
  private itemsPerPage:number;
  private rowOfNumberShown:number;
  public DEFAULT_PAGINATION:PaginationParam = {
    itemsPerPage : 10,
    loadOnPage : 1,
    rowOfNumberShown : 5
  }

  refreshDatatable: boolean = true;
  loading: Loading;

  //Attributes
  private dataset:any[] = [];
  private columns:ColumnParam[];
  private viewDatatable:any[] = [];
  private itemsPerPageArray = [10,50,100];
  private viewItemsPerPage;
  private isLockHeader: boolean = false;
  private isViewItemsPerPage: boolean = false;
  private isTextHeaderCenter: boolean = false;
  private isPagingCenter: boolean = false;
  private onlyShowAfterReload: boolean = false;
  private paramTrueFalse: any[];

  private viewPaginationIndex : {
      disablePrev: boolean,
      disableNext:boolean,
      firstPage : number,
      lastPage : number,
      indexView:number[],
      isShowJumpStringFirstPage:boolean,
      isShowJumpStringLastPage:boolean,
  } = {
    disablePrev : null,
    disableNext : null,
    firstPage : null,
    lastPage : null,
    indexView : [],
    isShowJumpStringFirstPage:null,
    isShowJumpStringLastPage:null
  }

  //Lazy Load
  isLazyLoad:boolean = false;
  offsetString:string;
  limitString:string;
  totalDataString:string;
  keyDataString:string;
  isPostUrl:boolean = false;
  bodyPost:any = {};
  customBodyPost:any = {};
  customParamUrl:string = "";
  paramUrl:string;
  isGetUrl:boolean = false;
  url:string;
  totalData:number;
  authKey:string;

  //Emitter
  @Output() onResponseReceived = new EventEmitter<ReceivedResponse>();
  @Output() onActionButtonClick = new EventEmitter<Event>();
  @Output() onActionDeleteClick = new EventEmitter<Event>();

  /**
   * Called when all param is ready and rendering to component view
   * @description
   * ```ts
   * {
        columns : [
          {
            key : 'descitem',
            header : 'Description Item',
          },
          {
            key : 'shortdesc',
            header : 'Short Desc Item',
          },
          {
            key : 'desctabl',
            header : 'Description Table',
          },
          {
            key : 'longdesc',
            header : 'Long Desc',
          },
        ],
        dataset : datadummy,
        pagination : {
          itemsPerPage : 5,
          loadOnPage : 1,
          rowOfNumberShown : 5
        }
      }
      ```
   */
  public loadDatatable(datatableParam:MutDatatableParam){
    // console.log('loadDatatable');
    this.viewDatatable = [];
    this.columns = datatableParam.columns;
    this.isLockHeader = datatableParam.isLockHeader;
    this.isViewItemsPerPage = datatableParam.isViewItemsPerPage;
    this.isTextHeaderCenter = datatableParam.isTextHeaderCenter;
    this.isPagingCenter = datatableParam.isPagingCenter;
    this.onlyShowAfterReload = datatableParam.onlyShowAfterReload;
    this.paramTrueFalse = datatableParam.paramTrueFalse;
    
    //Lazy load
    if(datatableParam.lazyLoad){
      this.isLazyLoad = true;
    }

    if(!this.isLazyLoad){
      this.dataset = Object.assign([],datatableParam.dataset);
      // console.log(this.dataset);
      this.initDataset(this.columns, this.dataset);
    }

    if(datatableParam.pagination){
        //Set attribute pagination
        this.isUsingPagination = true;
        this.currentPage = 1;
        if(datatableParam.pagination.loadOnPage){
            this.currentPage = datatableParam.pagination.loadOnPage;
        }
        this.itemsPerPage = datatableParam.pagination.itemsPerPage;
        this.viewItemsPerPage = this.itemsPerPage;
        
        this.rowOfNumberShown = datatableParam.pagination.rowOfNumberShown;
        if(this.isLazyLoad){
          this.dataset = [];
          this.initLazyLoad(datatableParam.lazyLoad);
        }else{
          this.initPagination(this.dataset);
        }
    }else{
        this.viewDatatable = this.dataset;
    }

  }

  /**
   * Set dataset attribute to current Prudential standard
   * Standard : 
   *  - Money Format Std = 1234.00
   *  - Date Format = 20180101
   */
  private initDataset(columns:any[], dataset:any[]){
    columns.forEach(column => {
        dataset.forEach(data => {
            for(let key in data){
                if(data.hasOwnProperty(key)){
                    if(key == column.key){
                        if(column.isDate){
                           data[key] = this.splitDate(data[key])
                        }
                        if(column.isFormatDate){
                         
                            data[key] = this.doFormatDate(data[key])
                        }
                        if(column.isMoneyFormat){
                          this.removeComma(data[key])
                        }
                        if(column.isAction){
                          data[key] = data[key];
                        }
                    }
                }
            }
        });
    });
  }

  //#region lazy load
    private initLazyLoad(lazyLoadParam:LazyLoadParam){
      //Set lazy load attribute
      this.url = lazyLoadParam.url;
      this.offsetString = lazyLoadParam.keyOffset;
      this.limitString = lazyLoadParam.keyLimit;
      if(lazyLoadParam.isGetUrl){
        this.isGetUrl = lazyLoadParam.isGetUrl;
      }else{
        this.isPostUrl = lazyLoadParam.isPostUrl != null ? lazyLoadParam.isPostUrl : true;
      }
      if(lazyLoadParam.authKey){
        this.authKey = lazyLoadParam.authKey;
      }
      this.keyDataString = lazyLoadParam.keyData;
      this.totalDataString = lazyLoadParam.keyTotalData;
      this.setCustomParamLazyLoadReq(lazyLoadParam);
      if(lazyLoadParam.forceUnloadTable == false || lazyLoadParam.forceUnloadTable == null){
        this.getLazyLoadData();
      }
    }

    private generateParamLazyLoadReq(){
      this.bodyPost[this.offsetString] = (this.currentPage -1) * this.itemsPerPage;
      this.bodyPost[this.limitString] = this.itemsPerPage;
      this.paramUrl = "?"+this.offsetString+"="+((this.currentPage-1) * this.itemsPerPage).toString()+"&"+this.limitString+"="+ this.itemsPerPage.toString();
    }

    private getLazyLoadData(){
      this.generateParamLazyLoadReq();
      if(!this.isDatasetCached()){
        this.showLoading();
        if(this.isGetUrl){
         
          let body = Object.assign({}, this.bodyPost);
          this.generateCustomBodyLazyLoadReq(body);
          let headers    = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': this.url+this.paramUrl,
            'X-Requested-Method': 'GET',
            'Authorization': this.authKey
          });
          let options    = { headers: headers };
          this.http.get(this.urlServices, options).subscribe(
            (res:any) => {
              if(res[this.keyDataString]){
                this.totalData = res[this.totalDataString];
                this.setCachedDataset(res[this.keyDataString]);
                this.initDataset(this.columns, this.dataset);
                this.viewDatatable = this.getSlicedDataFromDataset(this.dataset);
                this.setViewPaginationIndex(this.dataset);
                if(res[this.keyDataString].length > 0){
                  this.onResponseReceived.emit({
                    successResponse : true,
                    isEmptyData : false
                  });
                }else{
                  this.onResponseReceived.emit({
                    successResponse : true,
                    isEmptyData : true
                  });
                }
              }else{
                this.totalData = 0;
                this.setViewPaginationIndex(this.dataset);
                this.showAlert(res.resultDesc);
                this.onResponseReceived.emit({
                  errorResponse : true
                });

              }
              this.loading.dismiss();
            },
            (error:any) => {
              this.loading.dismiss();
              this.onResponseReceived.emit({
                errorResponse : true
              });
              this.showAlert('Connection problem, Please try again later');
            }
          )
        }else{
          let body = Object.assign({}, this.bodyPost);
          this.generateCustomBodyLazyLoadReq(body);
          let headers    = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Requested-Url': this.url,
            'X-Requested-Method': 'POST',
            'Authorization': this.authKey
          });
          let options    = { headers: headers };
          this.http.post(this.urlServices, body, options).subscribe(
            (res:any) => {
              if(res[this.keyDataString]){
                this.totalData = res[this.totalDataString];
                this.setCachedDataset(res[this.keyDataString]);
                this.initDataset(this.columns, this.dataset);
                this.viewDatatable = this.getSlicedDataFromDataset(this.dataset);
                this.setViewPaginationIndex(this.dataset);
                if(res[this.keyDataString].length > 0){
                  this.onResponseReceived.emit({
                    successResponse : true,
                    isEmptyData : false
                  });
                }else{
                  this.onResponseReceived.emit({
                    successResponse : true,
                    isEmptyData : true
                  });
                }
              }else{
                this.totalData = 0;
                this.setViewPaginationIndex(this.dataset);
                this.showAlert(res.resultDesc);
                this.onResponseReceived.emit({
                  errorResponse : true
                });

              }
              this.loading.dismiss();
            },
            (error:any) => {
              this.loading.dismiss();
              this.onResponseReceived.emit({
                errorResponse : true
              });
                this.showAlert('Connection problem, Please try again later');
            }
          )
        }
      }else{
        // this.loading.dismiss();
        this.viewDatatable = this.getSlicedDataFromDataset(this.dataset);
        this.setViewPaginationIndex(this.dataset);
      }         
    }

    private setCachedDataset(data:any[]){
      if(this.dataset[((this.currentPage- 1) * this.itemsPerPage)] == null || this.dataset[(this.currentPage * this.itemsPerPage) - 1] == undefined){
        for(let i=0; i<data.length; i++){
          this.dataset[(i + ((this.currentPage - 1)  * this.itemsPerPage))] = data[i];
        }
      }
    }

    private isDatasetCached(){
      let startIndex:number = (this.currentPage - 1) * this.itemsPerPage;
      let endIndex:number = ((this.currentPage - 1) * this.itemsPerPage) + this.itemsPerPage -1;
      for(var i = startIndex;i <= endIndex;i++){
        if(this.dataset[i] == null || this.dataset[i] == undefined){
          return false;
        }
      }
      return true;
    }

    private setCustomParamLazyLoadReq(lazyLoadParam:LazyLoadParam){
      if(this.isPostUrl){
        this.customBodyPost = lazyLoadParam.customBody;
      }else{
        this.customParamUrl = lazyLoadParam.customParam;
      }
    }

    private generateCustomBodyLazyLoadReq(bodyPost:any){
      if(this.isPostUrl){
        for(let key in this.customBodyPost){
          if(this.customBodyPost.hasOwnProperty(key)){
            bodyPost[key] = this.customBodyPost[key];
          }
        }
      }else{
        this.paramUrl = this.paramUrl+"&"+this.customParamUrl;
      }
    }
  //#endregion
  //#region pagination

  /**
   * Initialize pagination set on datatable
   */
  private initPagination(dataPaginated:any[]){
    this.setViewPaginationIndex(dataPaginated);
    if(dataPaginated.length > 0){
      this.viewDatatable = dataPaginated.slice((this.currentPage - 1), ((this.currentPage - 1) * this.itemsPerPage) + this.itemsPerPage);
    }
  }

  /**
   * Set pagination index for indexing datatable
   * Details : 
   *  - First Page Button
   *  - Last Page Button
   *  - Previous Page Button
   *  - Next Page Button
   *  - Index shown on declared row shown
   */
  private setViewPaginationIndex(dataPaginated:any[]){
    this.viewPaginationIndex.firstPage = 1,
    this.viewPaginationIndex.lastPage = this.getLastPagePagination(dataPaginated);
    this.viewPaginationIndex.disablePrev = this.isPrevPageDisabled();
    this.viewPaginationIndex.disableNext = this.isNextPageDisabled();
    this.viewPaginationIndex.indexView = this.getIndexViewPagination();
    this.viewPaginationIndex.isShowJumpStringFirstPage = this.isShowJumpStringFirstPagePagination();
    this.viewPaginationIndex.isShowJumpStringLastPage = this.isShowJumpStringLastPagePagination();
  }

  /**
   * Stuff happened when indexing button clicked
   * Set datatable to certain data when 
   */
  private onClickPage(clickedPage:number){
 
    this.currentPage = clickedPage;
    if(!this.isLazyLoad){
      this.viewDatatable = this.getSlicedDataFromDataset(this.dataset);
      this.setViewPaginationIndex(this.dataset);
    }else{
      this.getLazyLoadData();
    }
  }

  /**
   * Return sliced data on current page index
   */
  private getSlicedDataFromDataset(dataPaginated:any[]):any[]{
    return dataPaginated.slice((this.currentPage - 1) * this.itemsPerPage, ((this.currentPage - 1) * this.itemsPerPage) + this.itemsPerPage)
  }

  /**
   * Return last pagination index on given dataset and items per page
   */
  private getLastPagePagination(dataPaginated:any[]):number{
    if(!this.isLazyLoad){
      return Math.ceil(dataPaginated.length / this.itemsPerPage)
    }else{
      return Math.ceil(this.totalData / this.itemsPerPage)
    }
  }

  /**
   * Return state whether previous page button is disable
   */
  private isPrevPageDisabled():boolean{
      return this.currentPage == this.viewPaginationIndex.firstPage || this.dataset.length <=0
  }

  /**
   *  Return state whether previous next button is disable
   */
  private isNextPageDisabled():boolean{
      return this.currentPage == this.viewPaginationIndex.lastPage || this.dataset.length <=0
  }

  /**
   *  Return state whether pagination index is showing jump string to first page
   */
  private isShowJumpStringLastPagePagination():boolean{
    return this.currentPage + Math.floor(this.rowOfNumberShown / 2) < this.viewPaginationIndex.lastPage;
  }

  /**
   *  Return state whether pagination index is showing jump string to last page
   */
  private isShowJumpStringFirstPagePagination():boolean{
    return this.currentPage - Math.floor(this.rowOfNumberShown / 2) > this.viewPaginationIndex.firstPage;
  }

  /**
   *  Return index number view on indexing page
   */
  private getIndexViewPagination():any[]{
      let indexView: number[] = [];
      let headShowPageNumber:number;
      let tailShowPageNumber:number

      if(this.currentPage == this.viewPaginationIndex.firstPage){
        headShowPageNumber = this.viewPaginationIndex.firstPage;
        tailShowPageNumber = this.viewPaginationIndex.firstPage + Math.floor(this.rowOfNumberShown / 2);
      }else if(this.currentPage == this.viewPaginationIndex.lastPage){
        headShowPageNumber = this.viewPaginationIndex.lastPage - Math.floor(this.rowOfNumberShown / 2);
        tailShowPageNumber = this.viewPaginationIndex.lastPage;
      }else{
        headShowPageNumber = this.currentPage - Math.floor(this.rowOfNumberShown / 2);
        tailShowPageNumber = this.currentPage + Math.floor(this.rowOfNumberShown / 2);
      }
      
      for(let i=headShowPageNumber; i<=tailShowPageNumber; i++){
        if((i >= this.viewPaginationIndex.firstPage) && (i <= this.viewPaginationIndex.lastPage)){
            indexView.push(i);
        }
      }

      return indexView;
  }

  private onChangeItemsPerPage(itemsPerPage:any){
    this.currentPage = Math.floor((this.currentPage -1) * this.itemsPerPage / parseInt(itemsPerPage)) + 1;
    this.itemsPerPage = parseInt(itemsPerPage);
    this.initPagination(this.dataset);
    this.onClickPage(this.currentPage);
  }
  //#endregion

  //#region update datatable

  /**
   * Filter datatable by given filter
   * @param filterDatatable 
   */
  public onFilterDatatable(filterDatatable:DatatableFilter){
    let filteredArr:any[];
    let keyFilter:string = filterDatatable.keyFilter;
    let filterValue:any = filterDatatable.filterValue;

    filteredArr = this.dataset.filter((data) => {
        for(let key in data){
            if(data.hasOwnProperty(key)){
                if(key == keyFilter){
                  if(filterValue !== null && typeof filterValue === 'object'){
                    return JSON.stringify(data[key]) === JSON.stringify(filterValue);
                  }else{
                    return data[key].toLowerCase().indexOf(filterValue.toLowerCase()) > -1
                  }
                }
            }
        }
    });
    this.viewDatatable.splice(this.viewDatatable.length -1 ,1);
    this.viewDatatable = [...this.viewDatatable];
    this.viewDatatable = filteredArr;
    this.reloadDatatable(this.viewDatatable);
  }

  /**
   * Re init datatable
   */
  private reloadDatatable(dataPaginated?:any[]){
    this.refreshDatatable = false;
    setTimeout(()=>{
      this.refreshDatatable = true;
      this.onlyShowAfterReload = false;
      this.currentPage = 1;
      this.initDataset(this.columns,this.dataset);
      if(dataPaginated){
        this.initPagination(this.viewDatatable);
      }else{
        this.initPagination(this.dataset);
      }
    },10)
  }

  /**
   * Update dataset of datatable and given optional datatable filtering on update dataset
   * @param dataset 
   * @param filterDatatable 
   */
  public updateDatatable(dataset:any[], filterDatatable?:DatatableFilter){
    this.dataset.splice(this.dataset.length -1 ,1);
    this.viewDatatable = [...this.viewDatatable];
    this.dataset = dataset;
    this.dataset = Object.assign([],dataset);
    if(filterDatatable){
    
      if(filterDatatable.filterValue != '' && filterDatatable.filterValue != null && filterDatatable.filterValue != undefined){
        this.onFilterDatatable(filterDatatable);
        return;
      }else{
        this.viewDatatable = this.dataset;
        this.reloadDatatable();
        return;
      }
    }else{
      this.viewDatatable = this.dataset;
      this.reloadDatatable();
      return;
    }
  }

  public updateLazyLoadTable(lazyLoadParam:LazyLoadParam){
    if(this.dataset.length > 0){
      this.dataset.splice(this.dataset.length -1 ,1);
      this.dataset = [...this.dataset];
    }
    if(this.viewDatatable.length > 0){
      this.viewDatatable.splice(this.viewDatatable.length -1 ,1);
      this.viewDatatable = [...this.viewDatatable];
    }
    this.currentPage = 1;
    this.dataset = Object.assign([],[]);
    this.viewDatatable = Object.assign([],[]);
    this.onlyShowAfterReload = false;
    this.initLazyLoad(lazyLoadParam);
  }

  public isDatasetEmpty(){
    return this.dataset.length < 1;
  }
  //#endregion

  //#region utilities

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  showAlert(text) {
    let button:any = ['OK'];
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: text,
      buttons: button
    });
    
    alert.present();
  }

  /**
   * Return date string format dd-MMMM-yyyy
   * @param string 
   */
  private splitDate(string:string) : string{
    if(string.length == 8){
      let _string = string.toString();
      let segment1 = _string.substr(0,4);
      let segment2 = _string.substr(4,2);
      let segment3 = _string.substr(6,2);
      return segment1+'-'+segment2+'-'+segment3;
    }else if(string.length >= 14){
      if(string.length > 14){
        string = string.slice(0,14);
      }
      let _string = string.toString();
      let segment1 = _string.substr(0,4);
      let segment2 = _string.substr(4,2);
      let segment3 = _string.substr(6,2);
      let segment4 = _string.substr(8,2);
      let segment5 = _string.substr(10,2);
      let segment6 = _string.substr(12,2);
      return segment1+'-'+segment2+'-'+segment3+' '+segment4+':'+segment5+':'+segment6;
    }else{
      return string;
    }
  }

  /**
   * Return date string format from yyyy-mm-dd to dd mmm yyyy
   * @param string 
   */
  private doFormatDate(string:string) : string{
    // let temp = "2019-12-28 21:46:29.863"
    // 23 Apr 2019 09:36:35.343
  let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let d = new Date(string);
  let result:string;
  if(d.getMinutes() == 0&&d.getSeconds()==0&&d.getMilliseconds()==0){
  result = d.getDate()+' '+months[d.getMonth()]+' '+d.getFullYear()
  }else{
  result = d.getDate()+' '+months[d.getMonth()]+' '+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()+':'+d.getMilliseconds();
  }
  return result;
}

  /**
   * Return string format after replacing all commas
   * @param value 
   */
  private removeComma(value: string) :string{
    if (value != undefined) {
      let _string = value.toString();
      let get_int = _string.split('.');
      let after_comma = '00';
      if (get_int[1]) {
        after_comma = get_int[1].replace(/\D/g, "");
      }
      let before_comma = get_int[0].replace(/\D/g, "");
      return parseFloat(before_comma+'.'+after_comma).toFixed(2);
    }else{
      return '0.00';
    }
  }
  //#endregion


  //Attributer getter setter
  public getTotalData(){
    return this.totalData;
  }

  public onClickActionButton(row:any,i:number){
    let index = {'index': i};
    this.onActionButtonClick.emit(Object.assign(row, index));
  }

  public onClickActionDelete(row:any,i:number){
    let index = {'index': i};
    this.onActionDeleteClick.emit( Object.assign(row, index));
  }
}