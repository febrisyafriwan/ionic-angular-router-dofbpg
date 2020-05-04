import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, Loading, LoadingController, Keyboard } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserProvider, ContestProvider, MainMenuProvider } from './../../../providers/providers';

import { MutDatatableComponentContest } from '../../../pages/contest/datatable/mut-datatable';
import { URLServices } from '../../../providers/url-services';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Observable } from 'rxjs';
import { Scroll } from 'ionic-angular';

import * as FileSaver from 'file-saver';
import { isArray } from 'ionic-angular/umd/util/util';

/**
 * Generated class for the ContestReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contest-report',
  templateUrl: 'contest-report.html',
})
export class ContestReportPage {

  @ViewChild('datatable') datatable: MutDatatableComponentContest;
  @ViewChild('scrollElem') scrollElem: Scroll;
  @ViewChild('scrollElemOffice') scrollElemOffice: Scroll;

  dataMaster: any;
  dataParam: any;
  username: any;
  dataRadd: any = [{
    'nama_radd': 'ASDwasgjeiodjea'
  },{
    'nama_radd': 'ASDwasgjeiodjea'
  },{
    'nama_radd': 'ASDwasgjeiodjea'
  },{
    'nama_radd': 'ASDwasgjeiodjea'
  },{
    'nama_radd': 'ASDwasgjeiodjea'
  },{
    'nama_radd': 'ASDwasgjeiodjea'
  },{
    'nama_radd': 'ASDwasgjeiodjea'
  },];
  dataAds: any = [];
  dataOffice: any = [];
  autorization: any;

  showList: any = [];
  raddList: any = [];
  listSearch: any = [];
  listRadd: any = [];
  limit: any = 10;
  offsetRadd: any = 1;
  offsetOffice: any = 1;
  isLastRadd: boolean = false;
  isLastOffice: boolean = false;
  isRadd: boolean = false;
  isAds: boolean = false;
  isGettingDataRadd: boolean = true;
  isGettingDataOffice: boolean = true;
  loadingDataRadd: boolean = false;
  loadingDataOffice: boolean = false;
  loadingDataAds: boolean = false;
  listSnapDate = [];
  dataForExcel: any = [];

  filterSearch: any = {
    'radd_code': "",
    'radd_name': "",
    'ads_code': "",
    'ads_name': "",
    'office_code': "",
    'office_name': "",
  }
  filterSnapDate: any = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public storage: Storage,
    public contestProvider: ContestProvider,
    public auth: UserProvider,
    public mainMenu: MainMenuProvider,
    public alertCtrl: AlertController,
    public urlServices: URLServices,
    public modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    public keyboard: Keyboard
  ) {
    this.dataParam = this.navParams.get('param');
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

    this.scrollElem.addScrollEventListener((e) => {
      let scrollTop = e.target.scrollTop;
      let scrollHeight = e.target.scrollHeight;
      let offsetHeight = e.target.offsetHeight;
      let contentHeight = scrollHeight - offsetHeight;

      if (!this.isLastRadd) {
        if (this.isGettingDataRadd && (scrollHeight > 200) && (contentHeight <= scrollTop)) {
          // if (scrollHeight > 200) {
          // if (contentHeight <= scrollTop) {
          this.isGettingDataRadd = false;
          this.getItemPush(0);
          // }
          // }
        }
      }
    })

    this.scrollElemOffice.addScrollEventListener((e) => {
      let scrollTop = e.target.scrollTop;
      let scrollHeight = e.target.scrollHeight;
      let offsetHeight = e.target.offsetHeight;
      let contentHeight = scrollHeight - offsetHeight;

      if (!this.isLastOffice) {
        if (this.isGettingDataOffice && (scrollHeight > 200) && (contentHeight <= scrollTop)) {
          // if () {
          // if (contentHeight <= scrollTop) {
          this.isGettingDataOffice = false;
          this.getItemPush(2);
          // }
          // }
        }
      }
    })


    this.storage.get('username').then((username) => {
      this.username = username;
    });
    this.storage.get('Authorization').then((Autorization) => {
      this.autorization = Autorization;
    });

    this.loadDatatable();
    this.initialData();
  }

  initialData() {
    this.storage.get('Authorization').then((Authorization) => {
      this.storage.get('roles').then((roles) => {

        this.contestProvider.getSnapDate(this.dataParam.code_contest, Authorization).subscribe((response: any) => {
          if (response && response.length) {
            this.listSnapDate = response;
          } else {
            this.listSnapDate = [];
            // this.popUpFail("Data is empty");
          }
        }, (error) => {
          this.popUpFail("Connection Problem");
        });

      });
    });

  }

  openAdditionalApiPage() {
    let data = {
      'param': this.dataParam,
    }

    let mFU = this.modalCtrl.create("ContestAdditionalApiPage", data);

    mFU.present();
    mFU.onDidDismiss(() => {
      this.ionViewDidLoad();
    })
  }

  openWinnerPage() {
    let data = {
      'param': this.dataParam,
    }

    let mFU = this.modalCtrl.create("FormContestWinnerPage", data);

    mFU.present();
    mFU.onDidDismiss(() => {
      this.ionViewDidLoad();
    })
  }

  searchReport() {
    let param = 'contest_code=' + this.dataParam.code_contest + '&radd_name=' + this.filterSearch.radd_name + '&ads_name=' + this.filterSearch.ads_name + '&office_code=' + this.filterSearch.office_code + '&snap_date=' + this.filterSnapDate
    // let param = 'contest_code=PAC2019&radd_name=' + this.filterSearch.radd_name + '&ads_name=' + this.filterSearch.ads_name + '&office_code=' + this.filterSearch.office_code

    this.storage.get('Authorization').then((Autorization) => {
      this.loadLazyloadDatatable(param, Autorization);
    })

  }

  downloadReport() {
    // let param = 'contest_code=PAC2019&radd_name=' + this.filterSearch.radd_name + '&ads_name=' + this.filterSearch.ads_name + '&office_code=' + this.filterSearch.office_code+'&download=true'
    let param = 'contest_code=' + this.dataParam.code_contest + '&radd_name=' + this.filterSearch.radd_name + '&ads_name=' + this.filterSearch.ads_name + '&office_code=' + this.filterSearch.office_code + '&snap_date=' + this.filterSnapDate + '&download=true'
    let url = this.urlServices.admin + "/contests/contests/result/report/table?" + param;
    window.open(url, '_blank');
  }

  getItems(ev, index, loadMore?) {
    // if (ev.target == undefined || ev.target.value == '' || ev.buttons == 1) {
    let param = ev.target == undefined ? '' : ev.target.value ? ev.target.value : '';
    let url = "";

    if (this.filterSearch.radd_name.length > 0 && index == 0) {
      param = this.filterSearch.radd_name;
    }

    if (this.filterSearch.office_name.length > 0 && index == 2) {
      param = this.filterSearch.office_name;
    }

    if (index == 1) {
      url = this.urlServices.admin + "/contests/contests/result/ads/" + this.filterSearch.radd_code;
      this.loadingDataAds = true;
      this.loadAutoComplete(url, 1);
      this.showList[index] = true;
    } else if (index == 0) {
      url = this.urlServices.admin + "/contests/contests/result/radd?limit=" + this.limit + "&radd_name=" + param;

      this.dataRadd = [];
      this.offsetRadd = 1;
      this.isLastRadd = false;
      this.loadingDataRadd = true;
      this.loadAutoComplete(url, index);
      this.showList[index] = true;
    } else if (index == 2) {
      url = this.urlServices.admin + "/contests/contests/result/office?limit=" + this.limit + "&ads_code=" + this.filterSearch.ads_code + "&office_name=" + param;

      this.dataOffice = [];
      this.offsetOffice = 1;
      this.isLastOffice = false;
      this.loadingDataOffice = true;
      this.loadAutoComplete(url, index);
      this.showList[index] = true;
    }
    // }
  }

  getItemPush(index) {
    let url = "";
    let tempRadd = this.filterSearch.radd_name;
    let tempOffice = this.filterSearch.office_name;

    if (index == 0) {
      this.loadingDataRadd = true;
      url = this.urlServices.admin + "/contests/contests/result/radd?limit=" + this.limit + "&radd_name=" + tempRadd + "&offset=" + (this.limit * this.offsetRadd);
      this.pushAutoComplete(url, 0);
    } else if (index == 2) {
      this.loadingDataOffice = true;
      url = this.urlServices.admin + "/contests/contests/result/office?limit=" + this.limit + "&ads_code=" + this.filterSearch.ads_code + "&office_name=" + tempOffice + "&offset=" + (this.limit * this.offsetRadd);
      this.pushAutoComplete(url, 2);
    }
  }

  loadAutoComplete(urlParam, index) {
    this.storage.get('Authorization').then((Autorization) => {
      let url = urlParam
      this.contestProvider.getListSearch(url, Autorization).subscribe((response: any) => {
        if (response && response.length > 0) {
          if (index == 1) {
            this.dataAds = response.filter((data) => { return data.ads_name != null });
            this.loadingDataAds = false;
          } else if (index == 0) {
            this.dataRadd = response;
            this.loadingDataRadd = false;
          } else if (index == 2) {
            this.dataOffice = response;
            this.loadingDataOffice = false;
          }
        } else {
          this.loadingDataRadd = false;
          this.loadingDataOffice = false;
          this.loadingDataAds = false;

        }
      }, (error) => {
        this.loadingDataRadd = false;
        this.loadingDataOffice = false;
        this.loadingDataAds = false;
        this.popUpFail("Connection Problem");
      })
    })
  }

  pushAutoComplete(urlParam, index) {
    this.storage.get('Authorization').then((Autorization) => {
      let url = urlParam;
      this.contestProvider.getListSearch(url, Autorization).subscribe((response: any) => {
        // RADD
        if (index == 0) {
          if (response.length > 0) {
            response.forEach((data) => {
              this.dataRadd.push(data);
            });
            this.offsetRadd++;
          } else {
            this.isLastRadd = true;
          }

          this.loadingDataRadd = false;
          this.isGettingDataRadd = true;
        } else if (index == 2) {
          // OFFICE
          if (response.length > 0) {
            response.forEach((data) => {
              this.dataOffice.push(data);
            });
            this.offsetOffice++;
          } else {
            this.isLastOffice = true;
          }

          this.loadingDataOffice = false;
          this.isGettingDataOffice = true;
        }
      }, (error) => {
        // OFFICE
        this.loadingDataOffice = false;
        this.isGettingDataOffice = true;
        // RADD
        this.isGettingDataRadd = true;
        this.loadingDataRadd = false;
        this.popUpFail("Connection Problem");
      })
    })
  }

  onChange(ev, index) {
    if (!this.filterSearch.radd_name.length && index == 0) {
      this.filterSearch.radd_code = '';
      this.isRadd = false;
    } else if (!this.filterSearch.ads_name.length && index == 1) {
      this.filterSearch.ads_code = '';
      this.isAds = false;
    } else if (!this.filterSearch.office_name.length && index == 2) {
      this.filterSearch.office_code = '';
    }
  }

  chooseFilter(ev, item, index) {
    if (index == 0) {
      this.filterSearch.radd_code = item.radd_code;
      this.filterSearch.radd_name = item.radd_name;
      this.isRadd = true;
      // this.cancelSearch
    } else if (index == 1) {
      this.filterSearch.ads_code = item.ads_code;
      this.filterSearch.ads_name = item.ads_name;
      this.isAds = true;
    } else if (index == 2) {
      this.filterSearch.office_code = item.office_code;
      this.filterSearch.office_name = item.office_name;
    }
  }

  cancelSearch(ev, index) {
    // setTimeout(() => {
    this.showList[index] = false;
    // Radd
    this.dataRadd = [];
    this.offsetRadd = 1;
    this.loadingDataRadd = false;
    // Ads
    this.dataAds = [];
    // Office
    this.dataOffice = [];
    this.offsetOffice = 1;
    this.loadingDataOffice = false;

    if (index == 0) {
      this.filterSearch.radd_code = '';
      this.filterSearch.radd_name = '';
      this.filterSearch.ads_code = '';
      this.filterSearch.ads_name = '';
      this.filterSearch.office_code = '';
      this.filterSearch.office_name = '';
      this.isRadd = false;
      this.isAds = false;
    } else if (index == 1) {
      this.filterSearch.ads_code = '';
      this.filterSearch.ads_name = '';
      this.isAds = false;
    } else if (index == 2) {
      this.filterSearch.office_code = '';
      this.filterSearch.office_name = '';
    }

    this.keyboard.close();
    // }, 500);
  }

  onBlurSearch(ev, index) {
    setTimeout(() => {
      this.showList[index] = false;
      // Radd
      this.dataRadd = [];
      this.loadingDataRadd = false;
      // Ads
      this.dataAds = [];
      // Office
      this.dataOffice = [];
      this.loadingDataOffice = false;
    }, 200);
  }

  loadDatatable() {
    this.datatable.loadDatatable(
      {
        columns: [
          {
            key: 'accounting_month',
            header: 'Accounting Month'
          },
          {
            key: 'accounting_year',
            header: 'Accounting Year'
          },
          {
            key: 'achieve_collected',
            header: 'Achieve Collected'
          },
          {
            key: 'achieve_limited_1',
            header: 'Achieve Limited 1'
          },
          {
            key: 'achieve_limited_2',
            header: 'Achieve Limited 2'
          },
          {
            key: 'achieve_limited_3',
            header: 'Achieve Limited 3'
          },
          {
            key: 'additional_api',
            header: 'Additional Api'
          },
          {
            key: 'ads_name',
            header: 'Ads Name'
          },
          {
            key: 'agentNumber',
            header: 'Agent Number'
          },
          {
            key: 'agentType',
            header: 'Agent Type'
          },
          {
            key: 'agent_name',
            header: 'Agent Name'
          },
          {
            key: 'api_percentage',
            header: 'Api Percentage'
          },
          {
            key: 'api_reguler_non_pribadi',
            header: 'Api Reguler Non Pribadi'
          },
          {
            key: 'api_reguler_pribadi',
            header: 'Api Reguler Pribadi'
          },
          {
            key: 'api_saver_non_pribadi',
            header: 'Api Saver Non Pribadi'
          },
          {
            key: 'api_saver_pribadi',
            header: 'Api Saver Pribadi'
          },
          {
            key: 'api_spi_non_pribadi',
            header: 'Api Spi Non Pribadi'
          },
          {
            key: 'api_spi_pribadi',
            header: 'Api Spi Pribadi'
          },
          {
            key: 'api_top_up_non_pribadi',
            header: 'Api Top Up Non Pribadi'
          },
          {
            key: 'api_top_up_pribadi',
            header: 'Api Top Up Pribadi'
          },
          {
            key: 'collected_percentage',
            header: 'Collected Percentage'
          },
          {
            key: 'cond_api_limited_1',
            header: 'Cond Api Limited 1'
          },
          {
            key: 'cond_api_limited_2',
            header: 'Cond Api Limited 2'
          },
          {
            key: 'cond_api_limited_3',
            header: 'Cond Api Limited 3'
          },
          {
            key: 'contest_code',
            header: 'Contest Code'
          },
          {
            key: 'contest_end_date',
            header: 'Contest End Date'
          },
          {
            key: 'contest_start_date',
            header: 'Contest Start Date'
          },
          {
            key: 'fy_prusaver_collection',
            header: 'Fy Prusaver Collection'
          },
          {
            key: 'is_achieved',
            header: 'Is Achieved'
          },
          {
            key: 'is_achieved_date',
            header: 'Is Achieved Date'
          },
          {
            key: 'is_overriding_achieved',
            header: 'Is Overriding Achieved'
          },
          {
            key: 'is_overriding_achieved_date',
            header: 'Is Overriding Achieved Date'
          },
          {
            key: 'net_case',
            header: 'Net Case'
          },
          {
            key: 'net_case_percentage',
            header: 'Net Case Percentage'
          },
          {
            key: 'net_case_target',
            header: 'Net Case Target'
          },
          {
            key: 'new_active_agent',
            header: 'New Active Agent'
          },
          {
            key: 'new_active_agent_percentage',
            header: 'New Active Agent Percentage'
          },
          {
            key: 'new_active_agent_target',
            header: 'New Active Agent Target'
          },
          {
            key: 'office_code',
            header: 'Office Code'
          },
          {
            key: 'office_name',
            header: 'Office Name'
          },
          {
            key: 'old_persistency',
            header: 'Old Persistency'
          },
          {
            key: 'peristency_percentage',
            header: 'Peristency Percentage'
          },
          {
            key: 'peristency_target',
            header: 'Peristency Target'
          },
          {
            key: 'radd_name',
            header: 'Radd Name'
          },
          {
            key: 'rank',
            header: 'Rank'
          },
          {
            key: 'reg_collection',
            header: 'Reg Collection'
          },
          {
            key: 'result_api_limited_1',
            header: 'Result Api Limited 1'
          },
          {
            key: 'result_api_limited_2',
            header: 'Result Api Limited 2'
          },
          {
            key: 'result_api_limited_3',
            header: 'Result Api Limited 3'
          },
          {
            key: 'result_persistency',
            header: 'Result Persistency'
          },
          {
            key: 'result_total_achievement',
            header: 'Result Total Achievement'
          },
          {
            key: 'rolling_persistency',
            header: 'Rolling Persistency'
          },
          {
            key: 'sgl_collection',
            header: 'Sgl Collection'
          },
          {
            key: 'snap_date',
            header: 'Snap Date'
          },
          {
            key: 'start_aaji_license',
            header: 'Start Aaji License'
          },
          {
            key: 'target_collected',
            header: 'Target Collected'
          },
          {
            key: 'total_api',
            header: 'Total Api'
          },
          {
            key: 'total_api_target',
            header: 'Total Api Target'
          }
        ],
        dataset: this.dataMaster,
        pagination: this.datatable.DEFAULT_PAGINATION,
        lazyLoad: {
          url: this.urlServices.admin + 'contests/contests/result/report/table',
          isGetUrl: true,
          keyLimit: 'limit',
          keyOffset: 'offset',
          keyData: 'content',
          keyTotalData: 'totalElements',
          forceUnloadTable: true
        },
        isViewItemsPerPage: true,
        onlyShowAfterReload: true
      }
    )
  }

  loadLazyloadDatatable(param, Authorization) {
    this.datatable.updateLazyLoadTable({
      url: this.urlServices.admin + '/contests/contests/result/report/table',
      isGetUrl: true,
      keyLimit: 'limit',
      keyOffset: 'offset',
      keyData: 'content',
      keyTotalData: 'totalElements',
      customParam: param,
      authKey: Authorization
    })
  }

  popUpFail(labelMassage) {
    let alert = this.alertCtrl.create({
      title: 'Contest Report',
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

  downloadExcel() {
    if (this.filterSnapDate == "") {
      this.popUpFail("Please Choose Snap Date for Download");
    } else {
      this.dataForExcel = [];
      this.showLoading("Load Data");
      this.storage.get('Authorization').then((Autorization) => {
        let body = {
          'code_contest': this.dataParam.code_contest,
          'radd_name': this.filterSearch.radd_name,
          'ads_name': this.filterSearch.ads_name,
          'office_code': this.filterSearch.office_code
        }
        this.contestProvider.getReport(body, 1, 0, this.filterSnapDate, Autorization).subscribe((response: any) => {
          if (response.totalElements && response.totalElements > 0) {
            let requestReport: Observable<any>[] = [];
            let limitData = 10000;
            for (var i = 0; i < Math.ceil(response.totalElements / limitData); i++) {
              // for (var i = 0; i < 6; i++) {
              let body = {
                'code_contest': this.dataParam.code_contest,
                'radd_name': this.filterSearch.radd_name,
                'ads_name': this.filterSearch.ads_name,
                'office_code': this.filterSearch.office_code
              }
              requestReport.push(this.contestProvider.getReport(body, limitData, (i * limitData), this.filterSnapDate, Autorization));
            }
            forkJoin(requestReport).subscribe((result) => {
              result.forEach((data) => {
                data.content.forEach((content) => {
                  this.dataForExcel.push({
                    "accounting_month": content.accounting_month,
                    "accounting_year": content.accounting_year,
                    "achieve_collected": content.achieve_collected,
                    "achieve_limited_1": content.achieve_limited_1,
                    "achieve_limited_2": content.achieve_limited_2,
                    "achieve_limited_3": content.achieve_limited_3,
                    "achieve_limited_4": content.achieve_limited_4,
                    "achieve_limited_5": content.achieve_limited_5,
                    "achieve_limited_6": content.achieve_limited_6,
                    "achieve_limited_7": content.achieve_limited_7,
                    "achieve_limited_8": content.achieve_limited_8,
                    "achieve_limited_9": content.achieve_limited_9,
                    "additional_api": content.additional_api,
                    "ads_name": content.ads_name,
                    "agentNumber": content.agentNumber,
                    "agentType": content.agentType,
                    "agent_name": content.agent_name,
                    "api_percentage": content.api_percentage,
                    "api_reguler_non_pribadi": content.api_reguler_non_pribadi,
                    "api_reguler_pribadi": content.api_reguler_pribadi,
                    "api_saver_non_pribadi": content.api_saver_non_pribadi,
                    "api_saver_pribadi": content.api_saver_pribadi,
                    "api_spi_non_pribadi": content.api_spi_non_pribadi,
                    "api_spi_pribadi": content.api_spi_pribadi,
                    "api_top_up_non_pribadi": content.api_top_up_non_pribadi,
                    "api_top_up_pribadi": content.api_top_up_pribadi,
                    "collected_percentage": content.collected_percentage,
                    "cond_api_limited_1": content.cond_api_limited_1,
                    "cond_api_limited_2": content.cond_api_limited_2,
                    "cond_api_limited_3": content.cond_api_limited_3,
                    "cond_api_limited_4": content.cond_api_limited_4,
                    "cond_api_limited_5": content.cond_api_limited_5,
                    "cond_api_limited_6": content.cond_api_limited_6,
                    "cond_api_limited_7": content.cond_api_limited_7,
                    "cond_api_limited_8": content.cond_api_limited_8,
                    "cond_api_limited_9": content.cond_api_limited_9,
                    "contest_code": content.contest_code,
                    "contest_end_date": content.contest_end_date,
                    "contest_start_date": content.contest_start_date,
                    "fy_prusaver_collection": content.fy_prusaver_collection,
                    "is_achieved": content.is_achieved,
                    "is_achieved_date": content.is_achieved_date,
                    "is_overriding_achieved": content.is_overriding_achieved,
                    "is_overriding_achieved_date": content.is_overriding_achieved_date,
                    "net_case": content.net_case,
                    "net_case_percentage": content.net_case_percentage,
                    "net_case_target": content.net_case_target,
                    "new_active_agent": content.new_active_agent,
                    "new_active_agent_percentage": content.new_active_agent_percentage,
                    "new_active_agent_target": content.new_active_agent_target,
                    "office_code": content.office_code,
                    "office_name": content.office_name,
                    "old_persistency": content.old_persistency,
                    "peristency_percentage": content.peristency_percentage,
                    "peristency_target": content.peristency_target,
                    "radd_name": content.radd_name,
                    "rank": content.rank,
                    "reg_collection": content.reg_collection,
                    "result_api_limited_1": content.result_api_limited_1,
                    "result_api_limited_2": content.result_api_limited_2,
                    "result_api_limited_3": content.result_api_limited_3,
                    "result_api_limited_4": content.result_api_limited_4,
                    "result_api_limited_5": content.result_api_limited_5,
                    "result_api_limited_6": content.result_api_limited_6,
                    "result_api_limited_7": content.result_api_limited_7,
                    "result_api_limited_8": content.result_api_limited_8,
                    "result_api_limited_9": content.result_api_limited_9,
                    "result_persistency": content.result_persistency,
                    "result_total_achievement": content.result_total_achievement,
                    "rolling_persistency": content.rolling_persistency,
                    "sgl_collection": content.sgl_collection,
                    "snap_date": content.snap_date,
                    "start_aaji_license": content.start_aaji_license,
                    "target_collected": content.target_collected,
                    "total_api": content.total_api,
                    "total_api_target": content.total_api_target,
                  });
                })
              })
              this.sendingData();
              // this.loading.dismiss();
            }, (error) => {
              this.loading.dismiss();
              this.popUpFail("Download Failed");
            })
          } else {
            this.loading.dismiss();
            this.popUpFail('Download Failed, Data Empty');
          }
        }, (error) => {
          this.loading.dismiss();
          this.popUpFail("Download Failed");
        });
      })
    }
  }

  sendingData() {

    let limit = 5000;
    let lengthFor = Math.ceil(this.dataForExcel.length / limit);
    var temp: any = [];
    let totalData = limit;

    if (lengthFor > 1) {
      for (var i = 0; i < lengthFor; i++) {
        temp.push({ 'data': JSON.stringify(this.dataForExcel.slice(i * limit, (i * limit) + limit)), 'position': i + 1, 'sheet_position': Math.ceil(totalData / 1000000) });
        totalData += limit;
        // if (i == 0) {
        //   temp.push({ 'data': JSON.stringify(this.dataForExcel.slice(i * limit, (i * limit) + limit)).replace(/\]$/, ''), 'position': i + 1 });
        // } else if (i > 0 && i < lengthFor - 1) {
        //   temp.push({ 'data': JSON.stringify(this.dataForExcel.slice(i * limit, (i * limit) + limit)).replace(/^\[/, ',').replace(/\]$/, ''), 'position': i + 1 });
        // } else if (i == lengthFor - 1) {
        //   temp.push({ 'data': JSON.stringify(this.dataForExcel.slice(i * limit, (i * limit) + limit)).replace(/^\[/, ','), 'position': i + 1 });
        // }
      }
    } else {
      temp = JSON.stringify(this.dataForExcel);
    }

    let requestReport: Observable<any>[] = [];
    let tempAuth = this.autorization;

    this.loading.dismiss();
    this.showLoading("Sending Data");

    if (Array.isArray(temp)) {
      let body1 = {
        "dataReport": {
          "contest_code": this.dataParam.code_contest,
          "created_at": null,
          "created_by": this.username,
          "deleted_at": null,
          "file_path": null,
          "status": null,
          "updated_at": null,
        },
        "data_value": temp[0].data,
        "id_report": null,
        "json_position": temp[0].position,
        "sheet_position": temp[0].sheet_position
      };

      this.contestProvider.downloadReport(tempAuth, body1).subscribe((response: any) => {

        for (var i = 1; i < temp.length; i++) {
          let dataTemp = temp[i];
          let body = {
            "dataReport": {
              "contest_code": this.dataParam.code_contest,
              "created_at": null,
              "created_by": this.username,
              "deleted_at": null,
              "file_path": null,
              "id_report": response.id_report,
              "status": null,
              "updated_at": null
            },
            "data_value": dataTemp.data,
            "id_report": response.id_report,
            "json_position": dataTemp.position,
            "sheet_position": dataTemp.sheet_position
          };

          requestReport.push(this.contestProvider.downloadReport(tempAuth, body));
        }

        forkJoin(requestReport).subscribe((result) => {

          this.contestProvider.downloadReportFinish(tempAuth, result[0].id_report).subscribe((res: any) => {
            this.loading.dismiss();
            if (res.message == true) {
              this.popUpFail("See and Download File in Button Download List");
            } else {
              this.popUpFail("File not created, Please try again");
            }
          })

        }, (error) => {
          this.loading.dismiss();
          this.popUpFail("Download Failed");
        })

      }, (error) => {
        this.loading.dismiss();
        this.popUpFail("Download Failed");
      });
    } else {
      let body = {
        "dataReport": {
          "contest_code": this.dataParam.code_contest,
          "created_at": null,
          "created_by": this.username,
          "deleted_at": null,
          "file_path": null,
          "status": null,
          "updated_at": null,
        },
        "data_value": temp,
        "id_report": null,
        "json_position": 1,
        "sheet_position": 1
      };

      this.contestProvider.downloadReport(tempAuth, body).subscribe((response: any) => {
        this.contestProvider.downloadReportFinish(tempAuth, response.id_report).subscribe((res: any) => {
          this.loading.dismiss();
          if (res.message == true) {
            this.popUpFail("See and Download File in Button Download List");
          } else {
            this.popUpFail("File not created, Please try again");
          }
        })
      }, (error) => {
        this.loading.dismiss();
        this.popUpFail("Download Failed");
      });
    }

  }

  openListDownloadReport() {
    let data = {
      'param': this.dataParam,
    }

    let mFU = this.modalCtrl.create("ContestReportDownloadListPage", data);

    mFU.present();
    mFU.onDidDismiss(() => {

    })
  }

  loading: Loading;
  showLoading(content) {
    this.loading = this.loadingCtrl.create({
      content: content
    });
    this.loading.present();
  }

}
