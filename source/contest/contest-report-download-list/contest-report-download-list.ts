import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Loading, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import * as FileSaver from 'file-saver';
import { MutDatatableComponentContest } from '../../../pages/contest/datatable/mut-datatable';
import { URLServices } from '../../../providers/url-services';

import { UserProvider, ContestProvider, MainMenuProvider } from './../../../providers/providers';
import { User } from '../../../providers/user/user';

/**
 * Generated class for the ContestReportDownloadListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contest-report-download-list',
  templateUrl: 'contest-report-download-list.html',
})
export class ContestReportDownloadListPage {

  @ViewChild('datatable') datatable: MutDatatableComponentContest;
  
  dataParam:any;
  dataMaster: any = [];

  constructor(
    public viewController: ViewController,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public urlServices: URLServices,
    public storage: Storage,
    public contestProvider: ContestProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public mainMenu: MainMenuProvider,
    public auth: UserProvider) {
  }

  ionViewCanEnter(): boolean {
    if (this.auth.loggedIn()) {
      return true;
    } else {
      this.mainMenu.activeChildPage = '';
      this.navCtrl.setRoot('LoginPage');
    }
  }

  ionViewDidLoad() {
    this.dataParam = this.navParams.data.param;
    this.loadDatatable();
    this.initialData();
  }

  initialData(){
    this.storage.get('Authorization').then((Authorization) => {
			this.loadLazyloadDatatable(Authorization);
		});
  }

  downloadReport(row){
    this.showLoading("Please Wait ...");
    this.storage.get('Authorization').then((Authorization) => {
			this.contestProvider.downloadFileReport(Authorization, row.id_report).subscribe((res: any) => {
        if(res && res.data){
          let tempRes = res.data.split(";");
          let base64 = tempRes[1].split(",");
          FileSaver.saveAs(this.b64toBlob(base64[1], tempRes[0]), 'Report_'+this.dataParam.code_contest+'_' + new Date().getTime() + '.xlsx');
        }else{
          this.popUpFail("Failed Download File");
        }
        this.loading.dismiss();
        this.close();
      },(error) => {
        this.loading.dismiss();
        this.close();
        this.popUpFail("Failed Download File");
      })
		});
  }

  loadDatatable() {
		this.datatable.loadDatatable(
			{
				columns: [
					{
						key: 'created_by',
						header: 'Created By'
					},
					{
						key: 'contest_code',
						header: 'Contest Code'
					},
					{
						key: 'status',
						header: 'Status'
          },
          {
            key: 'created_at',
            header: 'Created At'
          },
					{
						key: 'action',
            header: ' ',
            isAction: true,
            isOnlyActionDynamic: true,
            isActionDynamic: [
              {
                'label': 'Download',
                'icon': '',
                'onClick': (row:any) => { this.downloadReport(row) },
                'condition' : (row:any) => { return row.status == 'SUCCESS' },
              },
            ],

					},
				],
				dataset: this.dataMaster,
        pagination: this.datatable.DEFAULT_PAGINATION,
        lazyLoad : {
          url : this.urlServices.admin + '/contests/contests/result/report/requestdownload/table',
          isGetUrl : true,
          keyLimit: 'limit',
          keyOffset : 'offset',
          keyData : 'content',
          keyTotalData : 'totalElements',
          forceUnloadTable : true
        },
        isViewItemsPerPage: true
			}
		)
  }
  
  loadLazyloadDatatable(Authorization){
    let param = 'contest_code='+this.dataParam.code_contest;
    this.datatable.updateLazyLoadTable({
      url : this.urlServices.admin + '/contests/contests/result/report/requestdownload/table',
      isGetUrl : true,
      keyLimit: 'limit',
      keyOffset : 'offset',
      keyData : 'content',
      keyTotalData : 'totalElements',
      customParam : param,
      authKey: Authorization
    })
  }

  b64toBlob(b64Data, contentType='', sliceSize=512){
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
      
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  close() {
    this.viewController.dismiss();
  }

  refresh(){
    this.loadDatatable();
    this.initialData();
  }

  popUpFail(labelMassage) {
    let alert = this.alertCtrl.create({
      title: 'Download Report',
      message: labelMassage,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // this.close();
          }
        }
      ]
    });
    alert.present();
  }

  loading: Loading;
  showLoading(content) {
    this.loading = this.loadingCtrl.create({
      content: content
    });
    this.loading.present();
  }

}
