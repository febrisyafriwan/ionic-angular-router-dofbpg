import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserProvider, ContestProvider, MainMenuProvider } from './../../../providers/providers';
import { MutDatatableComponentContest } from '../../../pages/contest/datatable/mut-datatable';

/**
 * Generated class for the ContestCriteriaCategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-contest-criteria-category',
	templateUrl: 'contest-criteria-category.html',
})
export class ContestCriteriaCategoryPage {

	@ViewChild('datatable') datatable: MutDatatableComponentContest;

	dataSearch: any = [];
	inputFilter: any = '';
	optFilter: any = 'name_criteria_category';
	optionSearch: any = [
		{
			'key': 'name_criteria_category',
			'name': 'Name Criteria Category'
		},
		{
			'key': 'name_column_achievement',
			'name': 'Name Column Achievement'
		},
		{
			'key': 'name_column_target',
			'name': 'Name Column Target'
		},
		{
			'key': 'name_column_achievement_percentage',
			'name': 'Name Column Achievement Percentage'
		}
	]

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

	initialData() {

		// Api For Get Data Contest
		// #Not used for now

		this.storage.get('Authorization').then((Authorization) => {
			this.storage.get('roles').then((roles) => {

				this.contestProvider.getAllCriteriaCategory(Authorization).subscribe((response: any) => {
					if (response && response.length) {
						this.dataSearch = response;
					} else {
						this.dataSearch = [];
						// this.popUpFail(response.responseMsg);
					}
					this.loadDatatable();
				}, (error) => {
					this.popUpFail(error);
				});

			});
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
						isActionDelete: true
					},
					{
						key: 'name_criteria_category',
						header: 'Name of Criteria Category'
					},
					{
						key: 'name_column_achievement',
						header: 'Name Column Achievement'
					},
					{
						key: 'name_column_target',
						header: 'Name Column Target'
					},
					{
						key: 'name_column_achievement_percentage',
						header: 'Name Column Achievement Percentage'
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

	filterDataTable(ev: any) {
		this.datatable.updateDatatable(
			this.dataSearch,
			{
				keyFilter: this.optFilter,
				filterValue: this.inputFilter
			}
		);
	}

	resetData() {
		this.initialData();
		this.inputFilter = '';
	}

	openDeleteForm(row: any) {
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
							this.contestProvider.deleteCriteriaCategory(row.id_criteria_category, Authorization).subscribe((response: any) => {
								this.popUpFail('Data have been deleted');
								this.navCtrl.setRoot("ContestCriteriaCategoryPage")
							}, (error) => {
								this.popUpFail(error);
							});
						});

					}
				}
			]
		})
		alert.present();
	}

	openEditForm(row: any) {
		let param = {
			'title': 'Edit',
			'param': row
		}
		this.navCtrl.setRoot('FormContestCriteriaCategoryPage', { param: param })
	}

	addData() {
		let param = {
			'title': 'Add',
			'param': []
		}
		this.navCtrl.setRoot('FormContestCriteriaCategoryPage', { param: param })
	}

	popUpFail(labelMassage) {
		let alert = this.alertCtrl.create({
			title: 'Criteria Category',
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
