import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserProvider, ContestProvider, MainMenuProvider } from './../../../providers/providers';

import { MutDatatableComponentContest } from '../../../pages/contest/datatable/mut-datatable';

/**
 * Generated class for the ContestCategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contest-category',
  templateUrl: 'contest-category.html',
})
export class ContestCategoryPage {

  @ViewChild('datatable') datatable: MutDatatableComponentContest;

  // dataSearch:any = [
  //   {
  //     'id_category': '',
	// 		'name_category': 'PPC',
	// 		'description_category': 'PCC 2019',
	// 		'created_by': '',
	// 		'created_at': '',
	// 		'updated_at': '',
	// 		'deleted_at': ''
  //   }
	// ];

	dataSearch:any = [];
	inputFilter:any = "";

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
		public alertCtrl: AlertController,
		public storage: Storage,
		public contestProvider: ContestProvider,
		public auth: UserProvider,
    public mainMenu: MainMenuProvider,
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
		this.initialData();
  }

  initialData(){

		// Api For Get Data Contest
		// #Not used for now

		this.storage.get('Authorization').then((Authorization) => {
			this.storage.get('roles').then((roles) => {

				let body = {
					'appsId': "pruhub",
				}

				this.contestProvider.getAllContestCategory(body, Authorization).subscribe((response: any) => {
					if(response && response.length){
						this.dataSearch = response;
					}else{
						this.dataSearch = [];
						// this.popUpFail("Data is empty");
					}
					this.loadDatatable();
				}, (error) => {
					this.popUpFail(error);
				});
				
			});
		});

	}

  loadDatatable() {
	console.log(this.datatable.DEFAULT_PAGINATION);
		this.datatable.loadDatatable(
			{
				columns: [
					{
						key: 'action',
						header: ' ',
						isAction: true,
						isActionDelete: true
					},
					{
						key: 'name_category',
						header: 'Category Name'
					},
					{
						key: 'created_by',
						header: 'Created By'
					},
					{
						key: 'created_at',
						header: 'Created Time',
						isFormatDate: true
					},
					{
						key: 'updated_at',
						header: 'Updated Time',
						isFormatDate: true
				
					},
				
				],
				dataset: this.dataSearch,
        pagination: this.datatable.DEFAULT_PAGINATION
			}
		)
	}
	
	filterDataTable(ev:any){
		this.datatable.updateDatatable(
			this.dataSearch,
			{
				keyFilter: 'name_category',
				filterValue: this.inputFilter
			}
		);
	}

  openDeleteForm(row: any){
		let alert = this.alertCtrl.create({
			title: 'Confirm Delete Data',
			message: 'Are you sure want to delete this data?',
			buttons: [
				{
					text: 'No',
					handler: () => {
						// console.log("No");
					}
				},
				{
					text: 'Yes',
					handler: () => {
						// console.log("Yes");

						// Api Untuk Delete Data Contest
						// # Not used for now

						this.storage.get('Authorization').then((Authorization) => {
							this.contestProvider.deleteContestCategory(row.id_category, Authorization).subscribe((response: any) => {
								this.popUpFail('Data have been deleted');
								this.navCtrl.setRoot("ContestCategoryPage");
							}, (error) => {
								this.popUpFail("Failed to delete data, maybe this data is used in Contest");
							});
						});

					}
				}
			]
		})
		alert.present();
  }
  
  openEditForm(row: any){
		let param = {
			'title': 'Edit',
			'param': row
		}
		this.navCtrl.setRoot('FormContestCategoryPage',{ param : param })
	}
	
	addData(){
		let param = {
			'title': 'Add',
			'param': []
		}
		this.navCtrl.setRoot('FormContestCategoryPage',{ param : param })
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
