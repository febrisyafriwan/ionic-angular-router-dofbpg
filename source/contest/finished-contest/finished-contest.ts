import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserProvider, ContestProvider, MainMenuProvider } from './../../../providers/providers';

import { MutDatatableComponentContest } from '../../../pages/contest/datatable/mut-datatable';
import { URLServices } from '../../../providers/url-services';

/**
 * Generated class for the FinishedContestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-finished-contest',
  templateUrl: 'finished-contest.html',
})
export class FinishedContestPage {

  @ViewChild('datatable') datatable: MutDatatableComponentContest;

  dataMaster:any = [];
  // dataMaster:any= [
  //   {
  //     'id_contest': '',
  //     'contestCategory': {
  //       'id_category': '',
  //       'name_category': 'Pru',
  //     },
  //     'name_contest': 'Pru Contest',
  //     'alias': 'PruC',
  //     'code_contest': 'PC',
  //     'description_contest': '',
  //     'description_reward': '',
  //     'start_date': '',
  //     'end_date': '',
  //     'start_time': '',
  //     'end_time': '',
  //     'image': '',
  //     'file_contest': '',
  //     'created_by': '',
  //     'created_at': '',
  //     'updated_at': '',
  //     'deleted_at': '',
  //     'is_bonanza': false,
  //   }
  // ];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController,
		public storage: Storage,
		public contestProvider: ContestProvider,
		public auth: UserProvider,
    public mainMenu: MainMenuProvider,
    public urlServices: URLServices,
    public modalCtrl: ModalController
    ) {
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
    this.loadDatatable();
    this.initialData();
  }

  initialData(){
    this.storage.get('Authorization').then((Authorization) => {
			this.loadLazyloadDatatable(Authorization);
		});
	}

  loadDatatable() {
		this.datatable.loadDatatable(
			{
				columns: [
          {
						key: 'action',
            header: ' ',
            isAction: true,
            isOnlyActionDynamic: true,
            isActionDynamic: [
              {
                'label': 'Report',
                'icon': 'book',
                'onClick': (row:any) => { this.openReportPage(row) }
              },
            ],

					},
					{
            key: 'name_contest',
            header: 'Contest Name'
          },
          {
            key: 'alias',
            header: 'Alias'
          },
          {
            key: 'code_contest',
            header: 'Contest Code'
          },
          {
            key: 'contestCategory',
            keyChild: 'name_category',
            header: 'Contest Category ',
            isChild: true
          },
          {
            key: 'start_date',
            header: 'Contest Periode Date (Start)',
     
            isFormatDate: true
          },
          {
            key: 'end_date',
            header: 'Contest Periode Date (End)',
       
            isFormatDate: true
          },
          {
            key: 'start_time',
            header: 'Contest Time (Start)'
          },
          {
            key: 'end_time',
            header: 'Contest Time (End)'
          },
          {
            key: 'created_by',
            header: 'Created By'
          },
					
				],
				dataset: this.dataMaster,
        pagination: this.datatable.DEFAULT_PAGINATION,
        lazyLoad : {
          url : this.urlServices.admin + 'contests/contests/end/table',
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
    let param = 'id_category=00000000-0000-0000-0000-000000000000'
    this.datatable.updateLazyLoadTable({
      url : this.urlServices.admin + '/contests/contests/end/table',
      isGetUrl : true,
      keyLimit: 'limit',
      keyOffset : 'offset',
      keyData : 'content',
      keyTotalData : 'totalElements',
      customParam : param,
      authKey: Authorization
    })
  }

  
  openAdditionalAPI(row: any){
		let data = {
      'param': row,
    }

    let mFU = this.modalCtrl.create("ContestAdditionalApiPage", data);

    mFU.present();
    mFU.onDidDismiss(() => {
      this.ionViewDidLoad();
    })
  }
  
  openWinnerPage(row:any){
    // let param = row;
    // this.navCtrl.setRoot('ContestWinnerPage', { param:param } );
    
    let data = {
      'param': row,
    }

    let mFU = this.modalCtrl.create("FormContestWinnerPage", data);

    mFU.present();
    mFU.onDidDismiss(() => {
      this.ionViewDidLoad();
    })
  }

  openReportPage(row:any){
    let param = row;
    this.navCtrl.setRoot('ContestReportPage', { param:param } );
  }

	popUpFail(labelMassage) {
    let alert = this.alertCtrl.create({
      title: 'Contest Category',
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


}
