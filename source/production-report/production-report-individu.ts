import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Loading, LoadingController, ModalController } from 'ionic-angular';
import { ProductionProvider, MainMenuProvider, UserProvider } from './../../../providers/providers';
import { Storage } from '@ionic/storage';
import { URLServices } from '../../../providers/url-services';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs/observable/forkJoin';

/**
 * Generated class for the ProductionReportIndividuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-production-report-individu',
  templateUrl: 'production-report-individu.html',
})
export class ProductionReportIndividuPage {

  showSearchPanel: boolean;
  search = {
    'from': '',
    'to': '',
    'period': '',
    'snap_date': '',
    'agent_number': '',
    'agent_name': '',
    'agent_type': '',
    'leader_number': '',
    'leader_name': '',
    'leader_agent_type': '',
    'unit_number': '',
    'unit_name': '',
    'unit_agent_type': '',
    'group_number': '',
    'group_name': '',
    'group_agent_type': '',
    'office_code': '',
    'office_name': '',
    'ads_name': '',
    'radd_name': '',
    'orderBy': '',
    'sortType': 'ASC'
  }

  // Condition
  isAsc: any = [];
  isSearchAble: boolean = false;
  isSearched: any;

  // Data Master
  snapDate: any;
  dataView: any;
  totalData: number = 0;
  tempBody: any;
  dataExcel: any = [];
  currentDate: any = new Date();
  maxDate: any;

  // Pagination
  private jumpToPage: any;
  private pagingLoaded: boolean;
  private itemsPerPage: number = 10;
  private currentPage: number;
  private rowOfNumberShown: number = 5;
  private viewPagination: {
    indexView: number[],
    firstPage: number,
    lastPage: number,
    disablePrev: boolean,
    disableNext: boolean,
    isShowLastPage: boolean,
    isShowFirstPage: boolean,
  } = {
      indexView: [],
      firstPage: null,
      lastPage: null,
      disableNext: null,
      disablePrev: null,
      isShowLastPage: null,
      isShowFirstPage: null
    }

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public prodProvider: ProductionProvider,
    public storage: Storage,
    public alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    public urlServices: URLServices,
    public modalCtrl: ModalController,
    public mainMenu: MainMenuProvider,
    public auth: UserProvider
  ) {
    this.maxDate = this.currentDate.getFullYear() + 2;
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
    this.currentPage = 1;
    this.storage.get('Authorization').then((Authorization) => {
      this.getSnapDate(Authorization);
    });
  }

  // Function Get Data From Service
  getTotalData(Auth) {
    this.pagingLoaded = false;
    let body = this.search;

    this.prodProvider.getAgentTotalData(Auth, body).subscribe((res: any) => {
      this.totalData = res.totalData;
      this.iniPagination();
      this.pagingLoaded = true;
    }, (error) => {
      this.popUpFail("Connection Problem");
    });
  }

  getDataTable(Auth, isSearch?) {
    this.showLoading("Please Wait...");

    let limit = 10;
    let offset = (this.currentPage - 1) * limit;

    let body = this.search;
    body['limit'] = limit;
    body['offset'] = offset;

    if (isSearch == 1) {
      this.tempBody = body;
    }

    if (isSearch == 2) {
      body = this.tempBody;
      body.orderBy = this.search.orderBy;
      body.sortType = this.search.sortType;
      body['limit'] = limit;
      body['offset'] = offset;
    }

    this.prodProvider.getAgent(Auth, body).subscribe((res: any) => {
      this.dataView = res;
      this.loading.dismiss();
    }, (error) => {
      this.dataView = [];
      this.popUpFail("Connection Problem");
      this.loading.dismiss();
    });
  }

  getSnapDate(Auth) {
    this.prodProvider.getIndividuSnapDate(Auth).subscribe((res: any) => {
      this.snapDate = res;
      // this.getDataTable(Auth);
    }, (error) => {
      this.popUpFail("Connection Problem");
    });
  }

  // End

  // Function for Action in Html
  onSearch() {
    if (!this.isSearchAble) {
      if (this.checkDate(this.search.from, this.search.to)) {
        this.popUpFail("To Date must not be less than From Date");
      } else {
        this.isSearched = true;
        this.currentPage = 1;
        this.storage.get('Authorization').then((Authorization) => {
          // Authorization = 'Bearer-eyJhbGciOiJIUzI1NiJ9.eyJwcmluY2lwYWwiOiJINHNJQUFBQUFBQUFBSlZUVFc4VE1SQjFRdG9BUmYxQUtoS0hjcUhjMEFaUkNaQnlJZDJFVXJUSlJ0MUVLRVVpY25lZDFLM1hYcnplTnJtZ25FQ2loNWFQU2tqOGhSNzVGM0RoQnlDUVFOeDZSRndaWjdQZDlGVFZKXC92TitMMlpOXC9iUk1ab0lKWHJvQ3Q4SVpPUVJyaWhtZXRzUjBpVUc0TDdnUmtqY1NGTFZOeUpGbVZFZlJac2hrV1dpTUdYaHJ6ZXMrZm50M3o5WmxMWFFGTzRDVHh4UjZLcTFoWGR3Z1dIZUxUaEtVdDR0V2lqdmJtTE9DWHVCWHFKTVQ2S2xydFEwUnNDaUxnVzlRT2VscWlEa3hVTEd5akJSUzZONFpiSW9ZNkVzOVU1TDJSdGJ4RlZGNEw0clpIZkUySkhZSjd0Q2JxY2R1VUtTVXdJcGRlWWdpXC9McmFBNjdyb2k0cWdsZTZRVlVFbThkemFhWUpkeHREYzI3RUluOUM4ZFQ4NFRqRFVZODdVdWtOZ1dvVWhJcU5CTVhxeDB0T0VTQktSY0RISVpRblRkMEJjNjZMQTRWeHk0RkdWZ3dyRnY2WGp3SlV6QUdYVkxCdzhVbTk0VkhPMVNMQWQ5ZzRkMjNcL1UrRFpoWWg4T0QyMlhkU1wvUG95R254NVwvdVwvRzBOaU1xOUMxc1ZMVHRHSXZnR3JtVXVhR0pGcjUrOGY2KzhQajE4OHVnTExPZUhSK1wveGRMSTZmNnB2QURMTEVTWXpNQjJ0MGM3Q2VCZlBsczhzVDF2dUZRUDJBRVhoQlh4RHVSU0ltaDNad1VMUEZib2J4cDF4b1ZweEZxWkVhaFMyYmRjVnBPbzFKTmtDc3JwWGJKc3V5bnBacFpTY0RwZXFsVnJkUWE3YXBkYmxvbjhId0MxMjFyMVd5MUg5dFd1YktXUkNcL1gxeURiYkt6YU5TMDk2VDY0djNUbkhyUTRQWFJZUDJyREV2Qjc5bjRmZk4yXC8rUVBLZllJbWRqQ0xDQXg0TmsycVJmNEdrYStPRGhlbVB2emNHOXFWZkJXRmNqeGk4Q2x6MnZIXC9xeDR5Z1wvMERBQUE9Iiwic3ViIjoiYzg3MzA2Iiwicm9sZXMiOlsiQ09OVEVTVCIsIkNQU1NZU1RFTSIsIkdBX0FMTE9XQU5DRSIsIlBBWU1FTlRfTU9EVUxFIiwiUEFZTUVOVF9QT0xJQ1lfSE9MREVSIiwiUFJPRFVDVElPTiJdLCJleHAiOjE1NjcxNTA5MzMsImlhdCI6MTU2NzA2NDUzM30.MAi-g-BR3Z7WPEmz59ZijAhpMRb9wCC6VQwi5VOMtf0';
          this.getDataTable(Authorization, 1);
          this.getTotalData(Authorization);
        });
      }
    } else {
      this.popUpFail("Period must be filled");
    }
  }

  onFilterSearch() {

    this.storage.get('Authorization').then((Authorization) => {
      // Authorization = 'Bearer-eyJhbGciOiJIUzI1NiJ9.eyJwcmluY2lwYWwiOiJINHNJQUFBQUFBQUFBSlZUVFc4VE1SQjFRdG9BUmYxQUtoS0hjcUhjMEFaUkNaQnlJZDJFVXJUSlJ0MUVLRVVpY25lZDFLM1hYcnplTnJtZ25FQ2loNWFQU2tqOGhSNzVGM0RoQnlDUVFOeDZSRndaWjdQZDlGVFZKXC92TitMMlpOXC9iUk1ab0lKWHJvQ3Q4SVpPUVJyaWhtZXRzUjBpVUc0TDdnUmtqY1NGTFZOeUpGbVZFZlJac2hrV1dpTUdYaHJ6ZXMrZm50M3o5WmxMWFFGTzRDVHh4UjZLcTFoWGR3Z1dIZUxUaEtVdDR0V2lqdmJtTE9DWHVCWHFKTVQ2S2xydFEwUnNDaUxnVzlRT2VscWlEa3hVTEd5akJSUzZONFpiSW9ZNkVzOVU1TDJSdGJ4RlZGNEw0clpIZkUySkhZSjd0Q2JxY2R1VUtTVXdJcGRlWWdpXC9McmFBNjdyb2k0cWdsZTZRVlVFbThkemFhWUpkeHREYzI3RUluOUM4ZFQ4NFRqRFVZODdVdWtOZ1dvVWhJcU5CTVhxeDB0T0VTQktSY0RISVpRblRkMEJjNjZMQTRWeHk0RkdWZ3dyRnY2WGp3SlV6QUdYVkxCdzhVbTk0VkhPMVNMQWQ5ZzRkMjNcL1UrRFpoWWg4T0QyMlhkU1wvUG95R254NVwvdVwvRzBOaU1xOUMxc1ZMVHRHSXZnR3JtVXVhR0pGcjUrOGY2KzhQajE4OHVnTExPZUhSK1wveGRMSTZmNnB2QURMTEVTWXpNQjJ0MGM3Q2VCZlBsczhzVDF2dUZRUDJBRVhoQlh4RHVSU0ltaDNad1VMUEZib2J4cDF4b1ZweEZxWkVhaFMyYmRjVnBPbzFKTmtDc3JwWGJKc3V5bnBacFpTY0RwZXFsVnJkUWE3YXBkYmxvbjhId0MxMjFyMVd5MUg5dFd1YktXUkNcL1gxeURiYkt6YU5TMDk2VDY0djNUbkhyUTRQWFJZUDJyREV2Qjc5bjRmZk4yXC8rUVBLZllJbWRqQ0xDQXg0TmsycVJmNEdrYStPRGhlbVB2emNHOXFWZkJXRmNqeGk4Q2x6MnZIXC9xeDR5Z1wvMERBQUE9Iiwic3ViIjoiYzg3MzA2Iiwicm9sZXMiOlsiQ09OVEVTVCIsIkNQU1NZU1RFTSIsIkdBX0FMTE9XQU5DRSIsIlBBWU1FTlRfTU9EVUxFIiwiUEFZTUVOVF9QT0xJQ1lfSE9MREVSIiwiUFJPRFVDVElPTiJdLCJleHAiOjE1NjcxNTA5MzMsImlhdCI6MTU2NzA2NDUzM30.MAi-g-BR3Z7WPEmz59ZijAhpMRb9wCC6VQwi5VOMtf0';
      this.getDataTable(Authorization, 2);
      // this.getTotalData(Authorization, 1);
    });
  }

  openSearch(e) {
    this.showSearchPanel = !this.showSearchPanel
  }

  sort(i, field?) {
    this.isAsc[i] = !this.isAsc[i];
    this.search.orderBy = field;
    this.search.sortType = this.isAsc[i] ? 'ASC' : 'DESC';
    this.onFilterSearch();
  }

  onChangeGoto() {
    let regex = /\D/g;
    if (this.jumpToPage > this.viewPagination.lastPage) {
      this.jumpToPage = this.viewPagination.lastPage;
    } else if (this.jumpToPage < 0) {
      this.jumpToPage = this.viewPagination.firstPage;
    } else {
      this.jumpToPage = this.jumpToPage.replace(regex, '');
    }
  }

  private checkDate(from, to): boolean {
    let date1 = new Date(from);
    let date2 = new Date(to);

    return date2 < date1;
  }

  private getMaxDate() {
    let date1 = new Date(this.search.from);
    let tempDate: any;

    if (this.search.period == 'YTD') {
      tempDate = date1.setFullYear(date1.getFullYear() + 2);
      this.maxDate = date1.getFullYear() + "-12-01";
    } else {
      tempDate = date1.setMonth(date1.getMonth() + 12);
      tempDate = date1.getMonth() + 1;
      let month = tempDate.toString().length > 1 ? tempDate : "0" + tempDate;
      this.maxDate = date1.getFullYear() + "-" + month + "-01";
    }

  }

  resetDate() {
    this.search.from = "";
    this.search.to = "";

    this.dataView = []
    this.isSearched = false;

    if (this.search.period) {
      if (this.search.from && this.search.to) {
        this.isSearchAble = false;
      } else {
        this.isSearchAble = true;
      }
    } else {
      this.isSearchAble = false;
    }
  }

  checkSearchAble(counter?) {
    if (counter == 1) {
      this.getMaxDate();
      this.search.to = "";
    }

    if (this.search.period) {
      if (this.search.from && this.search.to) {
        this.isSearchAble = false;
      } else {
        this.isSearchAble = true;
      }
    } else {
      this.isSearchAble = false;
    }
  }

  initExcel(row: any) {
    let url = this.urlServices.admin + "/production2/individual/report?agent_number=" + row.agent_number + "&period_year=" + row.accounting_year + "&period_month=" + row.accounting_month;
    window.open(url, '_blank');
  }

  // Download File
  requestDownload() {

    if (!this.isSearchAble) {
      if (this.checkDate(this.search.from, this.search.to)) {
        this.popUpFail("To Date must not be less than From Date");
      } else {
        this.dataExcel = [];
        this.showLoading("Load Data");

        this.storage.get('Authorization').then((Autorization) => {
          this.storage.get('username').then((username) => {

            let body = this.search;

            if (this.search.orderBy != '') {
              body.orderBy = this.search.orderBy;
            }

            if (this.search.sortType != '') {
              body.sortType = this.search.sortType;
            }

            // Get Total Data 
            this.prodProvider.getAgentTotalData(Autorization, body).subscribe((response: any) => {
              if (response && response.totalData > 0) {
                let requestReport: Observable<any>[] = [];
                let limitData = 5000;
                let totalData = Math.ceil(response.totalData / limitData);

                for (let i = 0; i < totalData; i++) {
                  body['limit'] = limitData;
                  body['offset'] = (i * limitData);

                  requestReport.push(this.prodProvider.getAgent(Autorization, body));
                }

                // Get Data from Database
                forkJoin(requestReport).subscribe((res) => {
                  res.forEach((data) => {
                    data.forEach((content) => {
                      this.dataExcel.push(content);
                    })
                  })
                  this.sendData(Autorization, limitData, response.totalData, username);
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
        })
      }
    } else {
      this.popUpFail("Period must be filled");
    }
  }

  sendData(auth, limit, totalData, username) {
    let temp: any = [];
    let sheet: any = Math.ceil(totalData / limit);
    let totalDataPush = limit

    // Set Json Position and Sheet Position
    if (sheet > 1) {
      for (let i = 0; i < sheet; i++) {
        temp.push({ 'data': JSON.stringify(this.dataExcel.slice(i * limit, (i * limit) + limit)), 'position': i + 1, 'sheet_position': Math.ceil(totalDataPush / 1000000) });
        totalDataPush += limit;
      }
    } else {
      temp = JSON.stringify(this.dataExcel);
    }

    let requestReport: Observable<any>[] = [];

    this.loading.dismiss();
    this.showLoading("Sending Data");

    // Sending Data to Backend
    if (Array.isArray(temp)) {
      let body1 = {
        "dataReport": {
          "created_at": null,
          "created_by": username,
          "deleted_at": null,
          "file_path": null,
          "id_report": null,
          "production_type": 'individu',
          "status": null,
          "updated_at": null,
        },
        "data_value": temp[0].data,
        "id_report": null,
        "json_position": temp[0].position,
        "sheet_position": temp[0].sheet_position
      };

      this.prodProvider.sendDataReport(auth, body1).subscribe((response: any) => {
        for (var i = 1; i < temp.length; i++) {
          let dataTemp = temp[i];

          let body = {
            "dataReport": {
              "created_at": null,
              "created_by": username,
              "deleted_at": null,
              "file_path": null,
              "id_report": response.id_report,
              "production_type": 'individu',
              "status": null,
              "updated_at": null,
            },
            "data_value": dataTemp.data,
            "id_report": response.id_report,
            "json_position": dataTemp.position,
            "sheet_position": dataTemp.sheet_position
          };

          requestReport.push(this.prodProvider.sendDataReport(auth, body));
        }

        // Send Data to Backend
        forkJoin(requestReport).subscribe((result) => {
          // Send Trigger for Make Excel
          this.prodProvider.triggerReport(auth, result[0].id_report).subscribe((res: any) => {
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
          "created_at": null,
          "created_by": username,
          "deleted_at": null,
          "file_path": null,
          "id_report": null,
          "production_type": 'individu',
          "status": null,
          "updated_at": null,
        },
        "data_value": temp,
        "id_report": null,
        "json_position": 1,
        "sheet_position": 1
      };

      // Send Data to Backend with Trigger
      this.prodProvider.sendDataReport(auth, body).subscribe((response: any) => {
        this.prodProvider.triggerReport(auth, response.id_report).subscribe((res: any) => {
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

  openDownloadPage() {
    let mFU = this.modalCtrl.create("ProductionIndividuDownloadPage");

    mFU.present();
    mFU.onDidDismiss(() => {

    })
  }

  // End

  // Function for Pagination
  iniPagination() {
    this.setViewPaginationIndex(this.totalData);
  }

  private setViewPaginationIndex(totalData: any) {
    this.viewPagination.firstPage = 1;
    this.viewPagination.lastPage = this.getLastPagePagination(totalData);
    this.viewPagination.disableNext = this.isNextPageDisabled();
    this.viewPagination.disablePrev = this.isPrevPageDisabled();
    this.viewPagination.indexView = this.getIndexViewPagination();
    this.viewPagination.isShowLastPage = this.isShowLastPage();
    this.viewPagination.isShowFirstPage = this.isShowFirstPage();
  }

  onClickPage(clickedPage: any) {
    if (clickedPage > 0 && clickedPage <= this.viewPagination.lastPage) {
      this.currentPage = parseInt(clickedPage);
      this.storage.get('Authorization').then((Authorization) => {
        // Authorization = 'Bearer-eyJhbGciOiJIUzI1NiJ9.eyJwcmluY2lwYWwiOiJINHNJQUFBQUFBQUFBSlZUVFc4VE1SQjFRdG9BUmYxQUtoS0hjcUhjMEFaUkNaQnlJZDJFVXJUSlJ0MUVLRVVpY25lZDFLM1hYcnplTnJtZ25FQ2loNWFQU2tqOGhSNzVGM0RoQnlDUVFOeDZSRndaWjdQZDlGVFZKXC92TitMMlpOXC9iUk1ab0lKWHJvQ3Q4SVpPUVJyaWhtZXRzUjBpVUc0TDdnUmtqY1NGTFZOeUpGbVZFZlJac2hrV1dpTUdYaHJ6ZXMrZm50M3o5WmxMWFFGTzRDVHh4UjZLcTFoWGR3Z1dIZUxUaEtVdDR0V2lqdmJtTE9DWHVCWHFKTVQ2S2xydFEwUnNDaUxnVzlRT2VscWlEa3hVTEd5akJSUzZONFpiSW9ZNkVzOVU1TDJSdGJ4RlZGNEw0clpIZkUySkhZSjd0Q2JxY2R1VUtTVXdJcGRlWWdpXC9McmFBNjdyb2k0cWdsZTZRVlVFbThkemFhWUpkeHREYzI3RUluOUM4ZFQ4NFRqRFVZODdVdWtOZ1dvVWhJcU5CTVhxeDB0T0VTQktSY0RISVpRblRkMEJjNjZMQTRWeHk0RkdWZ3dyRnY2WGp3SlV6QUdYVkxCdzhVbTk0VkhPMVNMQWQ5ZzRkMjNcL1UrRFpoWWg4T0QyMlhkU1wvUG95R254NVwvdVwvRzBOaU1xOUMxc1ZMVHRHSXZnR3JtVXVhR0pGcjUrOGY2KzhQajE4OHVnTExPZUhSK1wveGRMSTZmNnB2QURMTEVTWXpNQjJ0MGM3Q2VCZlBsczhzVDF2dUZRUDJBRVhoQlh4RHVSU0ltaDNad1VMUEZib2J4cDF4b1ZweEZxWkVhaFMyYmRjVnBPbzFKTmtDc3JwWGJKc3V5bnBacFpTY0RwZXFsVnJkUWE3YXBkYmxvbjhId0MxMjFyMVd5MUg5dFd1YktXUkNcL1gxeURiYkt6YU5TMDk2VDY0djNUbkhyUTRQWFJZUDJyREV2Qjc5bjRmZk4yXC8rUVBLZllJbWRqQ0xDQXg0TmsycVJmNEdrYStPRGhlbVB2emNHOXFWZkJXRmNqeGk4Q2x6MnZIXC9xeDR5Z1wvMERBQUE9Iiwic3ViIjoiYzg3MzA2Iiwicm9sZXMiOlsiQ09OVEVTVCIsIkNQU1NZU1RFTSIsIkdBX0FMTE9XQU5DRSIsIlBBWU1FTlRfTU9EVUxFIiwiUEFZTUVOVF9QT0xJQ1lfSE9MREVSIiwiUFJPRFVDVElPTiJdLCJleHAiOjE1NjcxNTA5MzMsImlhdCI6MTU2NzA2NDUzM30.MAi-g-BR3Z7WPEmz59ZijAhpMRb9wCC6VQwi5VOMtf0';
        this.getDataTable(Authorization, 2);
      });
      this.setViewPaginationIndex(this.totalData);
    }
  }

  private getIndexViewPagination(): any[] {
    let indexView: number[] = [];
    let headPageNumber: number;
    let tailPageNumber: number;

    if (this.currentPage == this.viewPagination.firstPage) {
      headPageNumber = this.viewPagination.firstPage;
      tailPageNumber = this.viewPagination.firstPage + Math.floor(this.rowOfNumberShown / 2);
    } else if (this.currentPage == this.viewPagination.lastPage) {
      headPageNumber = this.viewPagination.lastPage - Math.floor(this.rowOfNumberShown / 2);
      tailPageNumber = this.viewPagination.lastPage;
    } else {
      headPageNumber = this.currentPage - Math.floor(this.rowOfNumberShown / 2);
      tailPageNumber = this.currentPage + Math.floor(this.rowOfNumberShown / 2);
    }

    for (let i = headPageNumber; i <= tailPageNumber; i++) {
      if ((i >= this.viewPagination.firstPage) && (i <= this.viewPagination.lastPage)) {
        indexView.push(i);
      }
    }

    return indexView;
  }

  private getLastPagePagination(totalData: any): number {
    return Math.ceil(totalData / this.itemsPerPage);
  }

  private isPrevPageDisabled(): boolean {
    return this.currentPage == this.viewPagination.firstPage || this.totalData <= 0;
  }

  private isNextPageDisabled(): boolean {
    return this.currentPage == this.viewPagination.lastPage || this.totalData <= 0;
  }

  private isShowLastPage(): boolean {
    return this.currentPage + Math.floor(this.rowOfNumberShown / 2) < this.viewPagination.lastPage;
  }

  private isShowFirstPage(): boolean {
    return this.currentPage - Math.floor(this.rowOfNumberShown / 2) > this.viewPagination.firstPage;
  }

  // End

  // Function Complement
  loading: Loading;
  showLoading(msg) {
    this.loading = this.loadingCtrl.create({
      content: msg
    });
    this.loading.present();
  }

  popUpFail(labelMassage) {
    let alert = this.alertCtrl.create({
      title: 'Production',
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

  // End Complement
}
