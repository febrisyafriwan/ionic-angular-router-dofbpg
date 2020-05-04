import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserProvider, ContestProvider, MainMenuProvider } from './../../../providers/providers';

import { MutDatatableComponentContest } from '../../../pages/contest/datatable/mut-datatable';

/**
 * Generated class for the ContestWinnerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contest-winner',
  templateUrl: 'contest-winner.html',
})
export class ContestWinnerPage {

  @ViewChild('datatable') datatable: MutDatatableComponentContest;

  dataParam:any;
  dataMaster:any = [{
    'code_agent': '00000213',
    'name_agent': 'Muhabi'
  }];

  isFile:boolean = false;
  fileBase64:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
		public storage: Storage,
		public contestProvider: ContestProvider,
		public auth: UserProvider,
    public mainMenu: MainMenuProvider,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController
  ) {
    this.dataParam = navParams.get('param');
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
  }

  openModal(){

  }

  initialData(){
    // this.storage.get('Autorization').then((Autorization) => {
    //   this.contestProvider.getContestWinner(Autorization).subscribe((response) => {
    //     if(response && response.length){
    //       this.dataMaster = response;
    //     }else{
    //       this.dataMaster = []
    //     }
    //     this.loadDatatable();
    //   }),(error) => {
    //     this.popUpFail(error)
    //   }
    // })
  }

  openFormUpload(){
    let data = {
      'param': this.dataParam,
    }

    let mFU = this.modalCtrl.create("FormContestWinnerPage", data);

    mFU.present();
    mFU.onDidDismiss(() => {
      this.ionViewDidLoad();
    })
  }

  loadDatatable() {
		this.datatable.loadDatatable(
			{
				columns: [
					{
            key: 'code_agent',
            header: 'Code'
          },
          {
            key: 'name_agent',
            header: 'Name'
          },
				],
				dataset: this.dataMaster,
        pagination: this.datatable.DEFAULT_PAGINATION
			}
		)
  }
  
  back(){
    this.navCtrl.setRoot('FinishedContestPage');
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
