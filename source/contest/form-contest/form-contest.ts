import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, Loading, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserProvider, ContestProvider, MainMenuProvider } from './../../../providers/providers';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { saveAs } from 'file-saver';

import { URLServices } from '../../../providers/url-services';
import { FormBuilder, Validators } from '@angular/forms';
/**
 * Generated class for the FormContestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
class Registration {
  id_contest: any = '';
  contestCategory: any = {
    id_category: ''
  }
  // id_category:any = '';
  name_contest: any = '';
  alias: any = '';
  code_contest: any = '';
  description_contest: any = '';
  description_reward: any = '';
  term_and_condition: any = ''
  start_date: any = '';
  end_date: any = '';
  start_time: any = '';
  end_time: any = '';
  image: any = '';
  file_contest: any = '';
  created_by: any = '';
  created_at: any = '';
  updated_at: any = '';
  deleted_at: any = '';
  is_bonanza: any = false;
  status_mentoring: any = false;
  publish_contest: any = true;
}

class Contest_Criteria {
  criteria: any[] = [
    {
      'created_by': '',
      'criteriaCategory': {
        'id_criteria_category': ''
      },
      'criteriaType': {
        'id_criteria_type': ''
      }
    }
  ]
}


@IonicPage()
@Component({
  selector: 'page-form-contest',
  templateUrl: 'form-contest.html',
})
export class FormContestPage {
  @ViewChild('fileContest') fileContest: any;
  @ViewChild('imageContest') imageContest: any;

  value: any;
  dataContest: any;
  userLogin: any;
  currentDate: any = new Date();
  theEditor: any;
  theEditorReward: any;
  theEditorTerm: any;
  isContestCode: any = false;

  contestCategory: any = [];
  criteriaCategory: any = [];
  criteriaType: any = [];
  contestLevel: any;
  tempLevel: any;
  isMaxLengthAlias: any = false;
  isMaxLengthCode: any = false;
  isMaxLength: any = false;

  criteria: any;
  idEdit: any;
  title: any;

  isFile: any = false;
  isImage: any = false;
  img: any = {
    width: 0,
    height: 0
  }
  fileSaved: any;
  fileBase64: any = {
    'file': '',
    'module': 'contest',
    'fileName': '',
    'extension': ''
  };
  imageSaved: any;
  imageBase64: any = {
    'file': '',
    'module': 'contest',
    'fileName': '',
    'extension': ''
  };

  // Validator Input
  myForm: any;

  // Dummy
  existLevel: any = [];

  constructor(
    public navParams: NavParams,
    public storage: Storage,

    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public viewController: ViewController,

    public auth: UserProvider,
    public mainMenu: MainMenuProvider,
    public contestProvider: ContestProvider,
    public urlServices: URLServices,
    public formBuilder: FormBuilder,

    private loadingCtrl: LoadingController,

  ) {
    this.value = navParams.get('param');

    this.title = this.value ? this.value.title : '';
    this.dataContest = this.value && this.value.param ? this.value.param : new Registration();
   
    this.criteria = new Contest_Criteria();
    this.currentDate = this.currentDate.getFullYear() + 5;
    if (this.title == 'Edit') {
      this.existLevel = this.dataContest.contestsDetail;
      this.criteria.criteria = this.dataContest.contestsCriteria;
      this.criteria.criteria = this.criteria.criteria.filter((obj) => { return obj.deleted_at == null });
    }

    this.myForm = this.formBuilder.group({
      fCCategory: ['', Validators.required],
      fCLevel: [''],
      fCName: ['', Validators.required],
      fCAlias: ['', Validators.required],
      fCCode: ['', Validators.required],
      fCStarDate: ['', Validators.required],
      fCEndDate: ['', Validators.required],
      fCStarTime: ['', Validators.required],
      fCEndTime: ['', Validators.required],
      fCDesc: [''],
      fCReward: [''],
      fCTerm: [''],
    });

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
    ClassicEditor
      .create(document.querySelector('#editor'), {
        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'],
      })
      .then(editor => {
        this.theEditor = editor;
      })
      .catch(error => {
        // console.error(error);
      });

    ClassicEditor
      .create(document.querySelector('#editorReward'), {
        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'],
      })
      .then(ed => {
        this.theEditorReward = ed;
      })
      .catch(error => {
        // console.error(error);
      });

    ClassicEditor
      .create(document.querySelector('#editorTerm'), {
        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'],
      })
      .then(edTerm => {
        this.theEditorTerm = edTerm;
      })
      .catch(error => {
        // console.error(error);
      });

    this.setLoginUser();
    this.initialData();
  }

  setLoginUser() {
    this.storage.get('username').then((username) => {
      this.userLogin = username;
    })
  }

  initialData() {

    this.storage.get('Authorization').then((Authorization) => {
      this.storage.get('roles').then((roles) => {
        let body = [];

        this.contestProvider.getAllContestCategory(body, Authorization).subscribe((response: any) => {
          if (response) {
            this.contestCategory = response;
          } else {
            this.popUpFail(response.responseMsg);
          }
        }, (error) => {
          this.popUpFail(error);
        });

        this.contestProvider.getAllContestLevel(Authorization).subscribe((response: any) => {
          if (response) {
            this.contestLevel = response;
            this.addCheckboxParam();
          } else {
            this.popUpFail(response.responseMsg);
          }
        }, (error) => {
          this.popUpFail(error);
        });

        this.contestProvider.getAllCriteriaCategory(Authorization).subscribe((response: any) => {
          if (response) {
            this.criteriaCategory = response;
          } else {
            this.popUpFail(response.responseMsg);
          }
        }, (error) => {
          this.popUpFail(error);
        });

        this.contestProvider.getAllCriteriaType(Authorization).subscribe((response: any) => {
          if (response) {
            this.criteriaType = response;
          } else {
            this.popUpFail(response.responseMsg);
          }
        }, (error) => {
          this.popUpFail(error);
        });

      });
    });

  }

  // #Method, add variable 'checked' to data Level
  addCheckboxParam() {
    if (this.title == 'Edit') {
      for (let i = 0; i < this.contestLevel.length; i++) {
        this.contestLevel[i]['checked'] = false;

        for (let j = 0; j < this.existLevel.length; j++) {
          if (this.existLevel[j]['contestLevel'].id_level == this.contestLevel[i].id_level && this.existLevel[j]['deleted_at'] == null) {
            this.contestLevel[i]['checked'] = true;
          }
        }
      }
    } else {
      for (let i = 0; i < this.contestLevel.length; i++) {
        this.contestLevel[i]['checked'] = false;
      }
    }
  }

  addTempLevel() {
    this.tempLevel = this.contestLevel.filter((arr) => { return arr.checked == true });

    this.storage.get('username').then((username) => {
      this.tempLevel.forEach((current, index, arr) => {
        arr[index] = { 'created_by': username, 'contestLevel': current }
      })
    });
  }

  setCreatedForCriteria() {
    this.storage.get('username').then((username) => {
      this.criteria.criteria.forEach((current, index, arr) => {
        arr[index].created_by = username;
      })
    })
  }

  getImage() {
    let body = {
      'fileName': this.dataContest.image,
      'module': 'contest'
    }

    this.contestProvider.getImage(body).subscribe((response: any) => {
      this.imageSaved = response;
      // this.convertToBase64(response);
    }, (error) => {
      this.popUpFail(error);
    });
  }

  getFile() {
    let body = {
      'fileName': this.dataContest.file_contest,
      'module': 'contest'
    }

    window.open(this.urlServices.admin + "/base/commonFile/getFile?fileName=" + body.fileName + "&module=" + body.module, '_blank');

    // this.contestProvider.getImage(body).subscribe((response: any) => {

    //   let file64 = response.split(',')[1];
    //   let filePdf = this.base64ToBlob(file64);

    //   saveAs(filePdf, this.dataContest.file_contest);

    // }, (error) => {
    //   this.popUpFail(error);
    // });
  }

  convertToBase64(blob) {
    var reader = new FileReader();
    reader.onloadend = (e) => {
      this.imageSaved = reader.result;
    }
    reader.readAsDataURL(blob);
  }

  fileInputChange(ev: any, param: any) {
    let file = ev.dataTransfer ? ev.dataTransfer.files[0] : ev.target.files[0];
    let fileNameSplit = file.name.split('.');

    let _URL = window.URL;
    let reader = new FileReader();
    let image = new Image();

    if (param == '1') {
      this.imageBase64.fileName = file.name;
      this.imageBase64.extension = fileNameSplit[fileNameSplit.length - 1];

      // File After Load Set Base 64

      reader.onload = (e) => {
        this.imageBase64.file = reader.result;
      };

      image.onload = (ev) => {
        this.img.width = image.width;
        this.img.height = image.height;
        if (this.img.width != 1600 && this.img.height != 800) {
          this.imageBase64.file = '';
          this.popUpFail("Invalid Width and Height Image");
          this.resetImage();
          return
        }
      }

      image.src = _URL.createObjectURL(file);
      
      if (!file.type.match(/image-*/) || file.size > 900000) {
        this.imageBase64.file = '';
        this.popUpFail("Invalid format or image size more than 1MB");
        this.resetImage();
        return
      }

      this.isImage = true;
    } else {

      if (!file.type.match(/pdf-*/)) {
        this.fileBase64.file = '';
        this.popUpFail("Invalid format");
        this.resetFile();
        return
      }

      this.fileBase64.fileName = file.name;
      this.fileBase64.extension = fileNameSplit[fileNameSplit.length - 1];
      this.fileBase64.file = file;
      // reader.onload = (e) => {
      //   this.fileBase64.file = reader.result;
      // };
      this.isFile = true;
    }

    reader.readAsDataURL(file);
  }

  checkCode() {
    this.storage.get('Authorization').then((Authorization) => {

      this.contestProvider.checkContestCode(this.dataContest.code_contest, Authorization).subscribe((response: any) => {
        if (response && response.message) {
          if (response.message == 'true') {
            this.isContestCode = true;
          } else {
            this.isContestCode = false;
          }
        } else {
          this.isContestCode = false;
        }
      }, (error) => {
        this.isContestCode = false;
      });

      if (this.dataContest.code_contest.length > 50) {
        this.isMaxLengthCode = true;
      } else {
        this.isMaxLengthCode = false;
      }

    });

  }

  checkMaxLength() {
    if (this.dataContest.name_contest.length > 200) {
      this.isMaxLength = true;
    } else {
      this.isMaxLength = false;
    }

    if (this.dataContest.alias.length > 50) {
      this.isMaxLengthAlias = true;
    } else {
      this.isMaxLengthAlias = false;
    }
  }

  submitDataAdd() {

    this.addTempLevel();
    this.setCreatedForCriteria();

    this.storage.get('Authorization').then((Authorization) => {
      this.storage.get('username').then((username) => {

        let body = {
          'contestCategory': {
            'id_category': this.dataContest.contestCategory.id_category
          },
          'name_contest': this.dataContest.name_contest,
          'alias': this.dataContest.alias,
          'code_contest': this.dataContest.code_contest,
          'description_contest': this.theEditor.getData(),
          'description_reward': this.theEditorReward.getData(),
          'term_and_condition': this.theEditorTerm.getData(),
          'start_date': this.dataContest.start_date,
          'end_date': this.dataContest.end_date,
          'start_time': this.dataContest.start_time,
          'end_time': this.dataContest.end_time,
          'contestsDetail': this.tempLevel,
          'contestsCriteria': this.criteria.criteria,
          'created_by': username,
          'status_mentoring': this.dataContest.status_mentoring,
          'publish_contest' : this.dataContest.publish_contest
          // 'is_bonanza': this.dataContest.is_bonanza
        }

        if (this.myForm.valid) {

          if (this.imageContest.nativeElement.value != '' && this.fileContest.nativeElement.value != '') {
            
            this.showLoading();
            this.contestProvider.insertImage(this.imageBase64, Authorization).subscribe((response: any) => {
              body['image'] = response.content;
              this.contestProvider.insertImage(this.fileBase64, Authorization).subscribe((res: any) => {
                body['file_contest'] = res.content;
                this.contestProvider.insertContest(body, Authorization).subscribe((responses: any) => {
                  this.loading.dismiss();
                  if (responses) {
                    this.popUpSuccess();
                  } else {
                    this.popUpFail(responses.responseMsg);
                  }
                }, (error) => {
                  this.loading.dismiss();
                  if (error.error.error == 400) {
                    this.popUpFail('Data incorrect');
                  } else if (error.error.error == 500) {
                    if(body.contestsCriteria[0].criteriaCategory.id_criteria_category.length > 0 && body.contestsCriteria[0].criteriaType.id_criteria_type.length > 0){
                      this.dataContest.code_contest = '';
                      this.popUpFail('Please fill form with correct data! check Code Contest');
                    }else{
                      this.dataContest.code_contest = '';
                      this.popUpFail('Please fill form Type Criteria and Category Criteria and check Code Contest');
                    }
                  } else if (error.error.error == 501) {
                    this.popUpFail('Please fill form with correct data!');
                  }
                });
              }, (error) => {
                this.loading.dismiss();
                if (error.error.error == 400) {
                  this.popUpFail('Data incorrect');
                } else if (error.error.error == 500) {
                  this.popUpFail('Please fill form with correct data! check File Contest');
                }
              });
            }, (error) => {
              this.loading.dismiss();
              if (error.error.error == 400) {
                this.popUpFail('Data incorrect');
              } else if (error.error.error == 500) {
                this.popUpFail('Please fill form with correct data! check Image Contest');
              }
            });
          } else {
            this.popUpFail("Please Choose File Contest or Image");
          }
        }

      });
    });

  }

  submitDataEdit() {
    this.addTempLevel();
  
    this.storage.get('Authorization').then((Authorization) => {
      this.storage.get('username').then((username) => {
        let body = {
          'contestCategory': {
            'id_category': this.dataContest.contestCategory.id_category
          },
          'name_contest': this.dataContest.name_contest,
          'alias': this.dataContest.alias,
          'code_contest': this.dataContest.code_contest,
          'description_contest': this.theEditor.getData(),
          'description_reward': this.theEditorReward.getData(),
          'term_and_condition': this.theEditorTerm.getData(),
          'start_date': this.dataContest.start_date,
          'end_date': this.dataContest.end_date,
          'start_time': this.dataContest.start_time,
          'end_time': this.dataContest.end_time,
          'file_contest': this.dataContest.file_contest,
          'image': this.dataContest.image,
          'contestsDetail': this.tempLevel,
          'contestsCriteria': this.criteria.criteria,
          'created_by': this.dataContest.created_by,
          'status_mentoring': this.dataContest.status_mentoring,
          'publish_contest' : this.dataContest.publish_contest
          // 'is_bonanza': this.dataContest.is_bonanza
        }

        if (this.imageContest.nativeElement.value != '' && this.fileContest.nativeElement.value != '') {
          this.contestProvider.insertImage(this.imageBase64, Authorization).subscribe((response: any) => {
            body['image'] = response.content
            this.contestProvider.insertImage(this.fileBase64, Authorization).subscribe((res: any) => {
              body['file_contest'] = res.content;
              this.updateContest(this.dataContest.id_contest, body, Authorization);
            }, (error) => {
              if (error.error.error == 400) {
                this.popUpFail('Data incorrect');
              } else if (error.error.error == 500) {
                this.popUpFail('Please fill form with correct data!');
              } else if (error.error.error == 501) {
                this.popUpFail('Please fill form with correct data!');
              }
            });
          }, (error) => {
            if (error.error.error == 400) {
              this.popUpFail('Data incorrect');
            } else if (error.error.error == 500) {
              this.popUpFail('Please fill form with correct data!');
            }
          });
        } else if (this.imageContest.nativeElement.value != '') {
          // console.log("Image")
          this.contestProvider.insertImage(this.imageBase64, Authorization).subscribe((response: any) => {
            body['image'] = response.content
            this.updateContest(this.dataContest.id_contest, body, Authorization);
          }, (error) => {
            if (error.error.error == 400) {
              this.popUpFail('Data incorrect');
            } else if (error.error.error == 500) {
              this.popUpFail('Please fill form with correct data!');
            } else if (error.error.error == 501) {
              this.popUpFail('Please fill form with correct data!');
            }
          });
        } else if (this.fileContest.nativeElement.value != '') {
          // console.log("File")
          this.contestProvider.insertImage(this.fileBase64, Authorization).subscribe((res: any) => {
            body['file_contest'] = res.content;
            this.updateContest(this.dataContest.id_contest, body, Authorization);
          }, (error) => {
            if (error.error.error == 400) {
              this.popUpFail('Data incorrect');
            } else if (error.error.error == 500) {
              this.popUpFail('Please fill form with correct data!');
            } else if (error.error.error == 501) {
              this.popUpFail('Please fill form with correct data!');
            }
          });
        } else {
          this.updateContest(this.dataContest.id_contest, body, Authorization);
        }

      });
    });
  }

  updateContest(id, body, Authorization) {
    this.contestProvider.updateContest(id, body, Authorization).subscribe((responses: any) => {
      if (responses) {
        this.popUpSuccess();
      } else {
        this.popUpFail(responses.responseMsg);
      }
    }, (error) => {
      if (error.error.error == 400) {
        this.popUpFail('Data incorrect');
      } else if (error.error.error == 500) {
        this.popUpFail('Please fill form with correct data!');
      } else if (error.error.error == 501) {
        this.popUpFail('Please fill form with correct data!');
      }
    });
  }

  resetFile() {
    this.fileContest.nativeElement.value = "";
    this.isFile = false;
  }

  resetImage() {
    this.imageContest.nativeElement.value = "";
    this.isImage = false;
  }

  convertInt() {
    this.criteria.criteria.forEach((current, index, arr) => {
      arr[index].target_criteria = parseInt(current.target_criteria)
    })
  }

  checkDate() {
    let date1 = new Date(this.dataContest.start_date);
    let date2 = new Date(this.dataContest.end_date);

    if (date2 <= date1) {
      this.popUpFail("End Date must not be less than Start Date", true);
    }
  }

  addNewRow() {
    this.criteria.criteria.push({
      'created_by': '',
      'criteriaCategory': {
        'id_criteria_category': ''
      },
      'criteriaType': {
        'id_criteria_type': ''
      }
    })
  }

  deleteRow(index: number) {
    this.criteria.criteria.splice(index, 1);
  }

  back() {
    this.navCtrl.setRoot('MasterContestPage');
  }

  loading: Loading;
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  base64ToBlob(base64) {
    let binary = atob(base64.replace(/\s/g, ''));
    let len = binary.length;
    let buffer = new ArrayBuffer(len);
    let view = new Uint8Array(buffer);

    for (var i = 0; i < len; i++) {
      view[i] = binary.charCodeAt(i);
    }

    let blob = new Blob([view], { type: "application/pdf" });

    return blob;
  }

  popUpSuccess() {
    let alert = this.alertCtrl.create({
      title: 'Data Contest',
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

  popUpFail(labelMassage, isDate?) {
    let alert = this.alertCtrl.create({
      title: 'Data Contest',
      message: labelMassage,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // this.close();
            if (isDate) {
              this.dataContest.end_date = "";
            }
          }
        }
      ]
    });
    alert.present();
  }

}
