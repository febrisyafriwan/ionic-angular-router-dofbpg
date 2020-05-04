import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Loading, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserProvider, ContestProvider, MainMenuProvider } from './../../../providers/providers';
import { MutDatatableComponentContest } from '../../../pages/contest/datatable/mut-datatable';
import { URLServices } from '../../../providers/url-services';

/**
 * Generated class for the MasterContestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-master-contest',
	templateUrl: 'master-contest.html',
})
export class MasterContestPage {

	@ViewChild('datatable') datatable: MutDatatableComponentContest;

	dataSearch: any = [];
	optFilter: any = '';
	categoryFilterSearch: any = '';
	nameFilterSearch: any = '';
	codeFilterSearch: any = '';
	contestCategory: any;
	inputFilter: any;
	optionSearch: any = [
		{
			'key': 'name_contest',
			'name': 'Name Contest'
		},
		{
			'key': 'code_contest',
			'name': 'Code Contest'
		},
		{
			'key': 'created_by',
			'name': 'Created By'
		}
	];

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private alertCtrl: AlertController,
		private storage: Storage,
		public contestProvider: ContestProvider,
		public auth: UserProvider,
		public mainMenu: MainMenuProvider,
		public urlServices: URLServices,
		private loadingCtrl: LoadingController
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

	initialData() {

		// Api For Get Data Contest
		// #Not used for now

		this.storage.get('Authorization').then((Authorization) => {
			this.storage.get('roles').then((roles) => {

				this.contestProvider.getAllContestCategory({}, Authorization).subscribe((response: any) => {
					if (response) {
						this.contestCategory = response;
					} else {
						this.contestCategory = [];
						// this.popUpFail("Data is empty");
					}
				}, (error) => {
					this.popUpFail(error);
				});

				this.loadLazyloadDatatable(Authorization);
				// this.contestProvider.getAllContest(Authorization).subscribe((response: any) => {
				// 	if(response){
				// 		this.dataSearch = response;
				// 	}else{
				// 		this.popUpFail(response.responseMsg);
				// 	}
				// }, (error) => {
				// 	this.popUpFail(error);
				// });

			});
		});

	}

	searchData() {
		this.storage.get('Authorization').then((Authorization) => {
			this.loadLazyloadDatatable(Authorization);
		})
	}

	openDeleteForm(row: any) {
		let date1 = new Date();
		let date2 = new Date(row.end_date + "T" + row.end_time);
		if (date1 > date2) {
			this.popUpFail("Sorry Contest has been ended, You can't delete this Contest");
		} else {
			let alert = this.alertCtrl.create({
				title: 'Confirm Delete Data',
				message: 'Are you sure want to delete this data?',
				buttons: [
					{
						text: 'No',
						handler: () => {
						
						}
					},
					{
						text: 'Yes',
						handler: () => {
						

							// Api Untuk Delete Data Contest
							// # Not used for now

							this.storage.get('Authorization').then((Authorization) => {
								this.contestProvider.deleteContest(row.id_contest, Authorization).subscribe((response: any) => {
									this.popUpFail('Data Berhasil di Hapus');
									this.navCtrl.setRoot("MasterContestPage");
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
	}

	openEditForm(row: any) {
		let date1 = new Date();
		let date2 = new Date(row.end_date + "T" + row.end_time);
		if (date1 > date2) {
			// console.log("Lebih");
			this.popUpFail("Sorry Contest has been ended, You can't edit this Contest");
		} else {
			// console.log("Kurang");
			let param = {
				'title': 'Edit',
				'param': row
			}
			this.navCtrl.setRoot('FormContestPage', { param: param })
		}
	}

	addData() {
		let param = {
			'title': 'Add',
			'param': undefined
		}
		this.navCtrl.setRoot('FormContestPage', { param: param })
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
					{
						key: 'status_mentoring',
						header: 'Status Mentoring',
						isTrueFalse: true,
					},
					{
						key: 'publish_contest',
						header: 'Publish Contest',
						isTrueFalse: true,
					},
					
				],
				dataset: this.dataSearch,
				pagination: this.datatable.DEFAULT_PAGINATION,
				lazyLoad: {
					url: this.urlServices.admin + 'contests/contests/table',
					isGetUrl: true,
					keyLimit: 'limit',
					keyOffset: 'offset',
					keyData: 'content',
					keyTotalData: 'totalElements',
					forceUnloadTable: true
				},
				isViewItemsPerPage: true,
				paramTrueFalse: ['Yes', 'No']

				// isLockHeader : true
			}
		)
	}

	loadLazyloadDatatable(Authorization) {
		let temp = this.categoryFilterSearch == '' ? '00000000-0000-0000-0000-000000000000' : this.categoryFilterSearch;
		let paramCategory = 'id_category=' + temp + "&name_contest=" + this.nameFilterSearch + "&code_contest=" + this.codeFilterSearch;

		this.datatable.updateLazyLoadTable({
			url: this.urlServices.admin + '/contests/contests/table',
			isGetUrl: true,
			keyLimit: 'limit',
			keyOffset: 'offset',
			keyData: 'content',
			keyTotalData: 'totalElements',
			customParam: paramCategory,
			authKey: Authorization
		})
	}

	filterDataTable(ev: any) {
		this.datatable.updateDatatable(
			this.dataSearch,
			{
				keyFilter: this.optFilter == '' ? 'name_contest' : this.optFilter,
				filterValue: this.inputFilter
			}
		);
	}

	loading: Loading;
	showLoading() {
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.loading.present();
	}

	popUpFail(labelMassage) {
		let alert = this.alertCtrl.create({
			title: 'Data Contest',
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
