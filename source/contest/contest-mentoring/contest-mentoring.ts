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
 * Generated class for the ContestMentoringPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contest-mentoring',
  templateUrl: 'contest-mentoring.html',
})
export class ContestMentoringPage {

  @ViewChild('datatable') datatable: MutDatatableComponentContest;
  @ViewChild('scrollElem') scrollElem: Scroll;
  @ViewChild('scrollElemOffice') scrollElemOffice: Scroll;

  dataMaster: any;
  dataParam: any;
  username: any;
  dataMentor: any;
  dataMentee: any = [];
  autorization: any;

  showList: any = [];
  limit: any = 10;
  offsetMentor: any = 1;
  offsetMentee: any = 1;
  isLastMentor: boolean = false;
  isLastMentee: boolean = false;
  isGettingDataMentor: boolean = true;
  isGettingDataMentee: boolean = true;
  loadingDataMentor: boolean = false;
  loadingDataMentee: boolean = false;


  filterSearch: any = {
    'mentor': "",
    'mentee': "",
  }


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

      if (!this.isLastMentor) {
        if (this.isGettingDataMentor && (scrollHeight > 200) && (contentHeight <= scrollTop)) {
          // if (scrollHeight > 200) {
          // if (contentHeight <= scrollTop) {
          this.isGettingDataMentor = false;
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

      if (!this.isLastMentee) {
        if (this.isGettingDataMentee && (scrollHeight > 200) && (contentHeight <= scrollTop)) {
          // if () {
          // if (contentHeight <= scrollTop) {
          this.isGettingDataMentee = false;
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

  }


  openUploadMentoringPage() {
    let data = {
      'param': this.dataParam,
    }

    let mFU = this.modalCtrl.create("ContestUploadMentoringPage", data);

    mFU.present();
    mFU.onDidDismiss(() => {
      // this.ionViewDidLoad();
    })
  }


  getItems(ev, index, loadMore?) {
    // if (ev.target == undefined || ev.target.value == '' || ev.buttons == 1) {
    let param = ev.target == undefined ? '' : ev.target.value ? ev.target.value : '';
    let url = "";

    if (index == 0) {
      url = this.urlServices.admin + "/contests/contest/result/mentoring/mentor?limit=" + this.limit + "&mentor=" + this.filterSearch.mentor+ "&contest_code=" + this.dataParam.code_contest ;

      this.dataMentor = [];
      this.offsetMentor = 1;
      this.isLastMentor = false;
      this.loadingDataMentor = true;
      this.loadAutoComplete(url, index);
      this.showList[index] = true;

    } else if (index == 2) {
      url = this.urlServices.admin + "/contests/contest/result/mentoring/mentee?limit=" + this.limit + "&mentor=" + this.filterSearch.mentor + "&mentee=" + this.filterSearch.mentee+ "&contest_code=" + this.dataParam.code_contest ;

      this.dataMentee = [];
      this.offsetMentee = 1;
      this.isLastMentee = false;
      this.loadingDataMentee = true;
      this.loadAutoComplete(url, index);
      this.showList[index] = true;

    }
    // }
  }

  getItemPush(index) {
    let url = "";
    let tempMentor = this.filterSearch.mentor;
    let tempMentee = this.filterSearch.mentee;

    if (index == 0) {
      this.loadingDataMentor = true;
      url = this.urlServices.admin + "/contests/contest/result/mentoring/mentor?offset=" + (this.limit * this.offsetMentor) + "&limit=" + this.limit + "&mentor=" + tempMentor + "&contest_code=" + this.dataParam.code_contest ;
      this.pushAutoComplete(url, 0);
    } else if (index == 2) {
      this.loadingDataMentee = true;
      url = this.urlServices.admin + "/contests/contest/result/mentoring/mentee?offset=" + (this.limit * this.offsetMentee) + "&limit=" + this.limit + "&mentor=" + tempMentor + "&mentee=" + tempMentee +"&contest_code=" + this.dataParam.code_contest;
      this.pushAutoComplete(url, 2);
    }
  }

  loadAutoComplete(urlParam, index) {
    this.storage.get('Authorization').then((Autorization) => {
      let url = urlParam

      this.contestProvider.getListSearch(url, Autorization).subscribe((response: any) => {

        if (response && response.content.length > 0) {

          if (index == 0) {
            this.dataMentor = response.content;
            this.loadingDataMentor = false;

          } else if (index == 2) {
            this.dataMentee = response.content;
            this.loadingDataMentee = false;

          }
        } else {
          this.loadingDataMentor = false;
          this.loadingDataMentee = false;
        }
      }, (error) => {
        this.loadingDataMentor = false;
        this.loadingDataMentee = false;
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
          if (response.content.length > 0) {
            response.content.forEach((data) => {
              this.dataMentor.push(data);

            });
            this.offsetMentor++;

          } else {
            this.isLastMentor = true;
          }

          this.loadingDataMentor = false;
          this.isGettingDataMentor = true;
        } else if (index == 2) {
          // OFFICE
          if (response.content.length > 0) {
            response.content.forEach((data) => {
              this.dataMentee.push(data);
            });
            this.offsetMentee++;

          } else {
            this.isLastMentee = true;
          }

          this.loadingDataMentee = false;
          this.isGettingDataMentee = true;
        }
      }, (error) => {
        // OFFICE
        this.loadingDataMentee = false;
        this.isGettingDataMentee = true;
        // RADD
        this.isGettingDataMentee = true;
        this.loadingDataMentee = false;
        this.popUpFail("Connection Problem");
      })
    })
  }

  onChange(ev, index) {
    if (!this.filterSearch.mentor.length && index == 0) {
      this.filterSearch.mentor = '';
    } else if (!this.filterSearch.mentee.length && index == 2) {
      this.filterSearch.mentee = '';
    }
  }

  chooseFilter(ev, item, index) {
    if (index == 0) {
      this.filterSearch.mentor = item;
      this.filterSearch.mentee = '';
      // this.cancelSearch
    } else if (index == 2) {
      this.filterSearch.mentee = item;
    }
  }

  cancelSearch(ev, index) {
    // setTimeout(() => {
    this.showList[index] = false;
    //Mentor
    this.dataMentor = [];
    this.offsetMentor = 1;
    this.loadingDataMentor = false;
    //Mentee
    this.dataMentee = [];
    this.offsetMentee = 1;
    this.loadingDataMentee = false;

    if (index == 0) {
      this.filterSearch.mentee = '';
    } else if (index == 2) {
      // this.filterSearch.mentor = '';
    }

    this.keyboard.close();
    // }, 500);
  }

  onBlurSearch(ev, index) {
    setTimeout(() => {
      this.showList[index] = false;
      // Radd
      this.dataMentor = [];
      this.loadingDataMentor = false;

      // Office
      this.dataMentee = [];
      this.loadingDataMentee = false;
    }, 200);
  }
  searchReport() {
    // let param = 'contest_code=' + this.dataParam.code_contest + '&radd_name=' + this.filterSearch.radd_name + '&ads_name=' + this.filterSearch.ads_name + '&office_code=' + this.filterSearch.office_code + '&snap_date=' + this.filterSnapDate
    // let param = 'contest_code=PAC2019&radd_name=' + this.filterSearch.radd_name + '&ads_name=' + this.filterSearch.ads_name + '&office_code=' + this.filterSearch.office_code
    let param = 'mentee=' + this.filterSearch.mentee + '&mentor=' + this.filterSearch.mentor + "&contest_code=" + this.dataParam.code_contest;
    this.storage.get('Authorization').then((Autorization) => {
      this.loadLazyloadDatatable(param, Autorization);
    })

  }
  loadDatatable() {
    this.datatable.loadDatatable(
      {
        columns: [
          {
            key: 'mentor',
            header: 'Mentor'
          },
          {
            key: 'mentee',
            header: 'Mentee'
          },
          {
            key: 'updated_at',
            header: 'Updated at',
            isFormatDate: true
          }
        ],
        dataset: this.dataMaster,
        pagination: this.datatable.DEFAULT_PAGINATION,
        lazyLoad: {
          url: this.urlServices.admin + '/contests/contest/result/mentoring',
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
      url: this.urlServices.admin + '/contests/contest/result/mentoring',
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
      title: 'Contest Mentoring',
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

