import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from "ionic-angular";
import { Storage } from "@ionic/storage";
import {
  UserProvider,
  ContestProvider,
  MainMenuProvider
} from "./../../../providers/providers";

/**
 * Generated class for the FormContestCriteriaTypePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

class Registration {
  "id_criteria_type": any = "";
  "name_criteria_type": any = "";
  "created_by": any = "";
  "created_at": any = "";
  "updated_at": any = "";
  "deleted_at": any = "";
}

@IonicPage()
@Component({
  selector: "page-form-contest-criteria-type",
  templateUrl: "form-contest-criteria-type.html"
})
export class FormContestCriteriaTypePage {
  value: any;
  title: any;
  dataMaster: any;
  isMaxLength: any = false;
  valid: any = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public storage: Storage,
    public contestProvider: ContestProvider,
    public auth: UserProvider,
    public mainMenu: MainMenuProvider
  ) {
    this.value = this.navParams.get("param");

    this.title = this.value ? this.value.title : "";
    this.dataMaster =
      this.title == "Edit" ? this.value.param : new Registration();
  }

  ionViewCanEnter(): boolean {
    if (this.auth.loggedIn()) {
      return true;
    } else {
      this.mainMenu.activeChildPage = "";
      this.navCtrl.setRoot("LoginPage");
    }
  }

  ionViewDidLoad() {
    // this.dataMaster = this.value && this.value.param ? this.value.param : this.dataMaster;
    // console.log(this.dataMaster);
  }

  checkMaxLength() {
    if (this.dataMaster.name_criteria_type.length > 200) {
      this.isMaxLength = true;
    } else {
      this.isMaxLength = false;
    }
  }

  submitDataAdd() {
    if (this.dataMaster.name_criteria_type) {
      this.storage.get("Authorization").then(Authorization => {
        this.storage.get("username").then(username => {
          let body = {
            name_criteria_type: this.dataMaster.name_criteria_type,
            created_by: username
          };

          // console.log(body);
          this.contestProvider
            .insertCriteriaType(body, Authorization)
            .subscribe(
              (response: any) => {
                if (response) {
                  this.popUpSuccess();
                } else {
                  this.popUpFail(response.responseMsg);
                }
              },
              error => {
                if (error.error.error == 400) {
                  this.popUpFail("Data incorrect");
                } else if (error.error.error == 500) {
                  this.popUpFail("Please fill form with correct data!");
                }
              }
            );
        });
      });
    } else {
      this.popUpFail("Please fill form with correct data!");
    }
  }

  submitDataEdit() {
    if (this.dataMaster.name_criteria_type.length > 1) {
      this.storage.get("Authorization").then(Authorization => {
        this.storage.get("username").then(username => {
          let body = {
            name_criteria_type: this.dataMaster.name_criteria_type,
            created_by: username
          };

          // console.log(body);
          this.contestProvider
            .updateCriteriaType(
              this.dataMaster.id_criteria_type,
              body,
              Authorization
            )
            .subscribe(
              (response: any) => {
                if (response) {
                  this.popUpSuccess();
                } else {
                  this.popUpFail(response.responseMsg);
                }
              },
              error => {
                if (error.error.error == 400) {
                  this.popUpFail("Data incorrect");
                } else if (error.error.error == 500) {
                  this.popUpFail("Please fill form with correct data!");
                }
              }
            );
        });
      });
    } else {
      this.popUpFail("Please fill form with correct data!");
    }
  }

  back() {
    this.navCtrl.setRoot("ContestCriteriaTypePage");
  }

  popUpSuccess() {
    let alert = this.alertCtrl.create({
      title: "Contest Criteria Type",
      message: "Add / Edit Success",
      buttons: [
        {
          text: "OK",
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
      title: "Contest Criteria Type",
      message: labelMassage,
      buttons: [
        {
          text: "OK",
          handler: () => {
            // this.close();
          }
        }
      ]
    });
    alert.present();
  }
}
