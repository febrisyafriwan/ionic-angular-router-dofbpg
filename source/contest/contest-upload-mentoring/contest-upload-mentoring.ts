import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, Loading, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ContestProvider, MainMenuProvider, UserProvider } from './../../../providers/providers';
import { URLServices } from './../../../providers/url-services';


/**
 * Generated class for the ContestUploadMentoringPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contest-upload-mentoring',
  templateUrl: 'contest-upload-mentoring.html',
})
export class ContestUploadMentoringPage {

  @ViewChild('fileUpload') fileUpload: any;
  dataParam: any;
  downloadTemplateLink: any = '';
  fileBase64: any = {
    'fileName': '',
    'extension': '',
    'file': '',
    'pureFile': ''
  };
  dataMaster: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewController: ViewController,
    public alertCtrl: AlertController,
    public storage: Storage,

    public contestProvider: ContestProvider,
    public auth: UserProvider,
    public mainMenu: MainMenuProvider,
    public loadingCtrl: LoadingController,
    public urlServices: URLServices
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
    // this.initialData();
    this.downloadTemplateLink = this.urlServices.admin + "/contests/contests/result/download/mentoring?contest_code=" + this.dataParam.code_contest;
  }

  fileInputChange(ev: any, param: any) {
    let file = ev.dataTransfer ? ev.dataTransfer.files[0] : ev.target.files[0];

    let fileNameSplit = file.name.split('.');

    this.fileBase64.fileName = file.name;
    this.fileBase64.extension = fileNameSplit[fileNameSplit.length - 1];
    this.fileBase64.pureFile = file;

    if (!file.type.match('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') && !file.type.match('application/vnd.ms-excel')) {
      this.popUpFail('Please input valid format');
      this.resetFormFile();
      return
    }

    let reader = new FileReader();

    reader.onload = (e) => {
      this.fileBase64.file = reader.result;
    };

    reader.readAsDataURL(file);
  }

  submitData() {

    this.storage.get('Authorization').then((Authorization) => {
      this.storage.get('username').then(async (username) => {

        let body = {
          'file': this.fileBase64.pureFile,
        }
        let url = this.urlServices.admin + "/contests/contests/result/upload/mentoring?contest_code=" + this.dataParam.code_contest;

        if (this.fileUpload.nativeElement.value == "") {
          this.popUpFail("File Excel not found", true);
        } else {
          this.showLoading();
          //insertWinner
          this.contestProvider.insertMentoring(body, url).subscribe((res: any) => {

            this.loading.dismiss();
            this.popUpFail("Data Uploaded Successfully", true);
          }, (error) => {
            this.loading.dismiss();
            if (error.status != 501) {

              this.popUpFail("Please try again later", true);
            } else {
              let err = JSON.parse(error._body)

              let messageHead = "<ul style='text-decoration: none;'>";
              let message = ''
              let messageTail = "</ul>"

              if (err.data != '') {

                this.downloadFile(err.data,err.fileName);
              }
              if (err.message.length) {

                if (err.message[0].indexOf("Error") != -1) {

                  for (var i = 0; i < err.message.length; i++) {
                    message += '<li>' + err.message[i] + '</li>';
                  }
                  let messageComplete = messageHead + message + messageTail;
                  this.popUpFail(messageComplete, true);
                } else {
                  this.popUpFail(err.message[0], true);
                }
              } else {
                this.popUpFail("Connection problem, try again Later", true);
              }
            }
          });
        }

      });
    });
  }


  downloadFile(excelData: any, excelName:any) {

    let file = excelData.split(',')[1];
    let filename = excelName;

    var bstr = atob(file);
    // var bstr = decodeBase64(file);
    var n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    let filetype = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    var fblob = new File([u8arr], filename, { type: filetype });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(fblob);
    link.download = filename;
    link.click();
  }

  resetFormFile() {
    this.fileUpload.nativeElement.value = "";
  }

  close() {
    this.viewController.dismiss();
  }

  loading: Loading;
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  popUpFail(labelMassage, isCenter?) {
    let alert = this.alertCtrl.create({
      title: 'Contest Mentoring',
      message: '<div class="alert-align-left">' + labelMassage + '</div>',
      buttons: [
        {
          text: 'OK',
          handler: () => {

          }
        }
      ]
    });

    if (isCenter) {
      alert.setMessage("<center>" + labelMassage + "</center>");
    }
    alert.present();
  }
}
