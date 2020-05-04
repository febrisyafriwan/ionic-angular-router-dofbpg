import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserProvider, ContestProvider, MainMenuProvider } from './../../../providers/providers';


/**
 * Generated class for the FormContestCriteriaCategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

class Registration {
  'id_criteria_category': any = '';
  'name_criteria_category': any = '';
  'name_column_achievement': any = '';
  'name_column_target': any = '';
  'name_column_achievement_percentage':any ='';
  'created_by': any = '';
  'created_at': any = '';
  'updated_at': any = '';
  'deleted_at': any = '';
}

@IonicPage()
@Component({
  selector: 'page-form-contest-criteria-category',
  templateUrl: 'form-contest-criteria-category.html',
})
export class FormContestCriteriaCategoryPage {

  value: any;
  title: any;
  dataMaster: any;
  valid: any = false;
  isMaxLength:any = false;
  isMaxLengthAchievement:any = false;
  isMaxLengthTarget:any = false;
  isMaxLengthPercentage:any = false;

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
    // console.log(this.dataMaster);
  }

  checkMaxLength(){
    if(this.dataMaster.name_criteria_category.length > 200){
      this.isMaxLength = true;
    }else{
      this.isMaxLength = false;
    }

    if(this.dataMaster.name_column_achievement.length > 200){
      this.isMaxLengthAchievement = true;
    }else{
      this.isMaxLengthAchievement = false;
    }

    if(this.dataMaster.name_column_target.length > 200){
      this.isMaxLengthTarget = true;
    }else{
      this.isMaxLengthTarget = false;
    }

    if(this.dataMaster.name_column_achievement_percentage.length > 200){
      this.isMaxLengthPercentage = true;
    }else{
      this.isMaxLengthPercentage = false;
    }
  }

  submitDataAdd() {

    if (this.dataMaster.name_criteria_category && this.dataMaster.name_column_achievement && this.dataMaster.name_column_target && this.dataMaster.name_column_achievement_percentage) {

      this.storage.get('Authorization').then((Authorization) => {
        this.storage.get('username').then((username) => {
          let body = {
            'name_criteria_category': this.dataMaster.name_criteria_category,
            'name_column_achievement': this.dataMaster.name_column_achievement,
            'name_column_target': this.dataMaster.name_column_target,
            'name_column_achievement_percentage': this.dataMaster.name_column_achievement_percentage,
            'created_by': username
          }

          this.contestProvider.insertCriteriaCategory(body, Authorization).subscribe((response: any) => {
            if (response) {
              this.popUpSuccess();
            } else {
              this.popUpFail(response.responseMsg);
            }
          }, (error) => {
            if (error.error.error == 400) {
              this.popUpFail('Data incorrect');
            } else if (error.error.error == 500) {
              this.popUpFail('Server ERROR');
            }
          });

        });
      });

    } else {
      this.popUpFail("Data can't be empty");
    }

  }

  submitDataEdit() {

    if (this.dataMaster.name_criteria_category.length > 0 && this.dataMaster.name_column_achievement.length > 0 && this.dataMaster.name_column_target.length > 0 && this.dataMaster.name_column_achievement_percentage.length > 0) {

      this.storage.get('Authorization').then((Authorization) => {
        this.storage.get('username').then((username) => {
          let body = {
            'name_criteria_category': this.dataMaster.name_criteria_category,
            'name_column_achievement': this.dataMaster.name_column_achievement,
            'name_column_target': this.dataMaster.name_column_target,
            'name_column_achievement_percentage': this.dataMaster.name_column_achievement_percentage,
            'created_by': username
          }

          this.contestProvider.updateCriteriaCategory(this.dataMaster.id_criteria_category, body, Authorization).subscribe((response: any) => {
            if (response) {
              this.popUpSuccess();
            } else {
              this.popUpFail(response.responseMsg);
            }
          }, (error) => {
            if (error.error.error == 400) {
              this.popUpFail('Data incorrect');
            } else if (error.error.error == 500) {
              this.popUpFail('Server ERROR');
            }
          });

        });
      });

    } else {
      this.popUpFail("Data can't be empty");
    }

  }

  back() {
    this.navCtrl.setRoot('ContestCriteriaCategoryPage');
  }

  popUpSuccess() {
    let alert = this.alertCtrl.create({
      title: 'Contest Criteria Category',
      message: 'Add / Edit Success',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.back()
          }
        }
      ]
    });
    alert.present();
  }

  popUpFail(labelMassage) {
    let alert = this.alertCtrl.create({
      title: 'Contest Criteria Category',
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
