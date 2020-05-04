import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserProvider, ContestProvider, MainMenuProvider } from './../../../providers/providers';
/**
 * Generated class for the FormContestLevelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
class Registration {
  'id_level': any = '';
  'name_level': any = '';
  'agentType': any = '';
  'is_leader': boolean = false;
  'created_by': any = '';
  'created_at': any = '';
  'updated_at': any = '';
  'deleted_at': any = '';
}

@IonicPage()
@Component({
  selector: 'page-form-contest-level',
  templateUrl: 'form-contest-level.html',
})
export class FormContestLevelPage {

  value: any;
  title: any;
  dataMaster: any;
  valid: any = false;
  isMaxLength:any = false;
  isMaxLengthCode:any = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public storage: Storage,
    public contestProvider: ContestProvider,
    public auth: UserProvider,
    public mainMenu: MainMenuProvider,

  ) {
    this.value = this.navParams.get('param');

    this.title = this.value ? this.value.title : '';
    this.dataMaster = this.title == 'Edit' ? this.value.param : new Registration();
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
    // this.dataMaster = this.value && this.value.param ? this.value.param : this.dataMaster;
  }

  checkMaxLength(){
    if(this.dataMaster.name_level.length > 200){
      this.isMaxLength = true;
    }else{
      this.isMaxLength = false;
    }

    if(this.dataMaster.agentType.length > 50){
      this.isMaxLengthCode = true;
    }else{
      this.isMaxLengthCode = false;
    }
  }

  submitDataAdd() {

    if (this.dataMaster.name_level && this.dataMaster.agentType) {

      this.storage.get('Authorization').then((Authorization) => {
        this.storage.get('username').then((username) => {
          let body = {
            'name_level': this.dataMaster.name_level,
            'is_leader': this.dataMaster.is_leader,
            'agentType': this.dataMaster.agentType,
            'created_by': username
          }

          this.contestProvider.insertContestLevel(body, Authorization).subscribe((response: any) => {
            if (response) {
              this.popUpSuccess();
            } else {
              this.popUpFail(response.responseMsg);
            }
          }, (error) => {
            if (error.error.error == 400) {
              this.popUpFail('Data incorrect');
            } else if (error.error.error == 500) {
              this.popUpFail('Please fill form with correct data!');
            }
          });

        });
      });
      
    }else{
      this.popUpFail("Please fill form with correct data!");
    }

  }

  submitDataEdit() {

    if (this.dataMaster.name_level.length > 1 && this.dataMaster.agentType.length > 1) {

      this.storage.get('Authorization').then((Authorization) => {
        this.storage.get('username').then((username) => {
          let body = {
            'name_level': this.dataMaster.name_level,
            'is_leader': this.dataMaster.is_leader,
            'agentType': this.dataMaster.agentType,
            'created_by': username
          }

          this.contestProvider.updateContestLevel(this.dataMaster.id_level, body, Authorization).subscribe((response: any) => {
            if (response) {
              this.popUpSuccess();
            } else {
              this.popUpFail(response.responseMsg);
            }
          }, (error) => {
            if (error.error.error == 400) {
              this.popUpFail('Data incorrect');
            } else if (error.error.error == 500) {
              this.popUpFail('Please fill form with correct data!');
            }
          });

        });
      });
    }else{
      this.popUpFail("Please fill form with correct data!");
    }

  }

  back() {
    this.navCtrl.setRoot('ContestLevelPage');
  }

  popUpSuccess() {
    let alert = this.alertCtrl.create({
      title: 'Contest Level',
      message: 'Add / Edit Success',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.back();
          }
        }
      ]
    });
    alert.present();
  }

  popUpFail(labelMassage) {
    let alert = this.alertCtrl.create({
      title: 'Contest Level',
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
