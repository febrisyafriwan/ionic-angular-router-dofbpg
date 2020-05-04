import { Component, ViewChild } from "@angular/core";
import { IonicPage, AlertController } from "ionic-angular";
import { MutDatatableComponent } from "../../pages/contact/datatable/mut-datatable";
import { RouterModule, Routes } from "@angular/router";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { DataProvider } from "../../providers/data";
@IonicPage()
@Component({
  selector: "page-contact",
  templateUrl: "contact.html"
})
export class ContactPage {
  @ViewChild(MutDatatableComponent) datatable: MutDatatableComponent;
  dataSearch: any = [];
  inputFilter: any = "";
  isLazysLoad = false;
  dataLazysLoad: any = [];
  constructor(
    private router: Router,
    public alertCtrl: AlertController,
    private route: ActivatedRoute,
    public dataProvide: DataProvider
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.initialData();
      this.updateData(params);
      console.log(this.dataSearch);
    });
    // this.getDataLazyLoad();
  }

  getDataLazyLoad() {
    this.dataProvide.getData().subscribe(
      rs => {
        console.log(rs);
      },
      error => {}
    );
    //untuk lazy load backend harus menyediakan limit offset dan total element
    /* */
  }

  updateData(param: any) {
    let data = {
      name_category: param.name_category,
      created_by: param.created_by,
      created_at: param.created_at
    };
    if (param.title == "Edit") {
      console.log(this.dataSearch);

      this.dataSearch.splice(param.index, 1, data);
      console.log(this.dataSearch);
    } else if (param.title == "Add") {
      this.dataSearch.push(data);
    }
    this.loadDatatable();
  }

  initialData() {
    // Api For Get Data Contest
    // #Not used for now

    this.dataSearch = [
      { name_category: "AG", created_by: "Rahma", created_at: "2019-06-03" },
      { name_category: "AD", created_by: "Cinta", created_at: "2019-06-03" },
      { name_category: "AR", created_by: "Nia", created_at: "2019-06-03" }
    ];
    this.loadDatatable();
  }

  loadDatatable() {
    this.datatable.loadDatatable({
      columns: [
        {
          key: "action",
          header: " ",
          isAction: true,
          isActionDelete: true
        },
        {
          key: "name_category",
          header: "Category Name"
        },
        {
          key: "created_by",
          header: "Created By"
        },
        {
          key: "created_at",
          header: "Created Time"
        },
        {
          key: "action",
          header: " ",
          isAction: true,
          isOnlyActionDynamic: true,
          isActionDynamic: [
            {
              label: "Alert",
              icon: "",
              onClick: (row: any) => {
                this.alerts(row);
              },
              condition: (row: any) => {
                return row.created_by == "Cinta";
              }
            }
          ]
        }
      ],
      dataset: this.dataSearch,
      pagination: this.datatable.DEFAULT_PAGINATION
    });
  }
  alerts(row:any) {
    alert(`im dynamic button from ${row.created_by}`);
  }
  filterDataTable(ev: any) {
    this.datatable.updateDatatable(this.dataSearch, {
      keyFilter: "name_category",
      filterValue: this.inputFilter
    });
  }

  openDeleteForm(row: any) {
    let alert = this.alertCtrl.create({
      title: "Confirm Delete Data",
      message: "Are you sure want to delete this data?",
      buttons: [
        {
          text: "No",
          handler: () => {}
        },
        {
          text: "Yes",
          handler: () => {
            // Api Untuk Delete Data Contest
            // # Not used for now

            this.dataSearch.splice(row.index, 1);
            this.loadDatatable();
            this.popUpFail("Data have been deleted");
          }
        }
      ]
    });
    alert.present();
  }

  openEditForm(row: any) {
    let param = {
      title: "Edit"
    };
    param = Object.assign(param, row);
    this.router.navigate(["contact-edit"], { queryParams: param });
  }

  addData() {
    let param = {
      title: "Add"
    };
    this.router.navigate(["contact-edit"], { queryParams: param });
  }

  popUpFail(message) {
    let alert = this.alertCtrl.create({
      title: "Contact",
      message: message,
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
