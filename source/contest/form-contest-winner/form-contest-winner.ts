import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ContestProvider, MainMenuProvider, UserProvider } from './../../../providers/providers';
import { URLServices } from './../../../providers/url-services';

/**
 * Generated class for the FormContestWinnerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-form-contest-winner',
  templateUrl: 'form-contest-winner.html',
})
export class FormContestWinnerPage {
  @ViewChild('fileUpload') fileUpload: any;

  dataParam: any;
  downloadTemplateLink: any = '';
  fileBase64: any = {
    'fileName': '',
    'extension': '',
    'file': '',
    'pureFile': ''
  };

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
    this.downloadTemplateLink = this.urlServices.admin + "/contests/contests/result/download/winner";
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
      this.storage.get('username').then((username) => {

        let body = {
          'code_contest': this.dataParam.code_contest,
          'created_by': username,
          // 'file': this.fileBase64.file,
          'file': this.fileBase64.pureFile,
        }

        if (this.fileUpload.nativeElement.value == "") {
          this.popUpFail("File Excel not found");
        } else {
          this.showLoading();
          this.contestProvider.insertWinner(body, Authorization).subscribe((res: any) => {
            this.loading.dismiss();
            this.popUpFail("Success upload data, Your data will be processed tomorrow on green plum database");
          }, (error) => {
            this.loading.dismiss();
            let messageHead = "<ul style='text-decoration: none;'>";
            let message = ''
            let messageTail = "</ul>"
            if (error.length) {
              if (error[0].indexOf("Error") != -1) {
                for (var i = 0; i < error.length; i++) {
                  message += '<li>' + error[i] + '</li>';
                }
                let messageComplete = messageHead + message + messageTail;
                this.popUpFail(messageComplete);
              } else {
                this.popUpFail(error[0], true);
              }
            } else {
              this.popUpFail("Connection problem, try again Later");
            }
          });
        }

      });
    });
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
      title: 'Contest Winner',
      message: '<div class="alert-align-left">'+labelMassage+'</div>',
      buttons: [
        {
          text: 'OK',
          handler: () => {

          }
        }
      ]
    });
    
    if(isCenter){
      alert.setMessage("<center>"+labelMassage+"</center>");
    }
    alert.present();
  }

}
