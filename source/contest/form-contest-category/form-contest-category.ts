import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Storage } from '@ionic/storage';
import { UserProvider, ContestProvider, MainMenuProvider } from './../../../providers/providers';

/**
 * Generated class for the FormContestCategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

class Registration {
  'id_category':any = '';
	'name_category':any = '';
	'description_category':any = '';
	'is_parent':boolean = false;
	'created_by':any = '';
	'created_at':any = '';
	'updated_at':any = '';
	'deleted_at':any = ''
}

@IonicPage()
@Component({
  selector: 'page-form-contest-category',
  templateUrl: 'form-contest-category.html',
})
export class FormContestCategoryPage {

  value: any;
  title: any;
  dataMaster: any;
  theEditor:any;
  valid:any = false;
  isMaxLength:any = false;
  
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
    this.dataMaster =  this.title == "Edit" ? this.value.param : new Registration();
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
    // console.log(this.dataMaster);

    ClassicEditor
    .create( document.querySelector( '#editor' ), {
      toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'],
    } )
    .then( editor => {
        this.theEditor = editor;
    } )
    .catch( error => {
        // console.error( error );
    } );

  }

  checkMaxLength(){
    if(this.dataMaster.name_category.length > 200){
      this.isMaxLength = true;
    }else{
      this.isMaxLength = false;
    }
  }

  submitDataAdd(){
    
    this.dataMaster.description_category = this.theEditor.getData();
    if(this.dataMaster.name_category){
      if(this.dataMaster.description_category.length > 14){

      this.storage.get('Authorization').then((Authorization) => {
        this.storage.get('username').then((username) => {
  
          let body = {
            'name_category': this.dataMaster.name_category,
            'description_category': this.dataMaster.description_category,
            'is_parent': this.dataMaster.is_parent,
            'created_by': username
          }
          
          this.contestProvider.insertContestCategory(body, Authorization).subscribe((response: any) => {
            if (response) {
              this.popUpSuccess();
            } else {
              this.popUpFail(response.responseMsg);
            }
          }, (error) => {
            if (error.error.error == 400) {
              this.popUpFail('Data incorrect');              
            }else if (error.error.error == 500) {
              this.popUpFail('Please fill form with correct data!');                            
            }
          });
  
        });
      });

      }else{
        this.popUpFail("Description Category must more than 14 character");
      }
      
    }else{
      this.popUpFail("Name Category can't be empty");
    }


  }

  submitDataEdit(){
    
    this.dataMaster.description_category = this.theEditor.getData();
    if(this.dataMaster.name_category.length > 1){
      if(this.dataMaster.description_category.length > 14){

      this.storage.get('Authorization').then((Authorization) => {
        this.storage.get('username').then((username) => {
          let body = {
            'name_category': this.dataMaster.name_category,
            'description_category': this.dataMaster.description_category,
            'is_parent': this.dataMaster.is_parent,
            'created_by': 49662
          }
          
          this.contestProvider.updateContestCategory(this.dataMaster.id_category, body, Authorization).subscribe((response: any) => {
            if (response) {
              this.popUpSuccess();
            } else {
              this.popUpFail(response.responseMsg);
            }
          }, (error) => {
            if (error.error.error == 400) {
              this.popUpFail('Data incorrect');              
            }else if (error.error.error == 500) {
              this.popUpFail('Please fill form with correct data!');                            
            }
          });
  
        });
      });

      }else{
        this.popUpFail("Description Category must more than 14 character");
      }
    }else{
      this.popUpFail("Name Category can't be empty");
    }
  }

  back(){
    this.navCtrl.setRoot('ContestCategoryPage');
  }

  popUpSuccess() {
    let alert = this.alertCtrl.create({
      title: 'Contest Category',
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
      title: 'Contest Category',
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
