import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
class Contact {
  "name_category": any = "";
  "created_by": any = "";
  "created_at": any = "";
}
@Component({
  selector: "page-contact-edit",
  templateUrl: "contact-edit.html"
})
export class ContactEditPage {
  param: any;
  dataTemp = new Contact();
  title = "";
  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.param = Object.assign(params);
      this.initialData();
    });
  }
  initialData() {
    this.param["title"] == "Edit"
      ? ((this.dataTemp.created_at = this.param.created_at),
        (this.dataTemp.created_by = this.param.created_by),
        (this.dataTemp.name_category = this.param.name_category))
      : this.dataTemp;
    this.title = this.param.title;
  }
  submitDataAdd() {
    this.router.navigate(["contact"], { queryParams: this.dataTemp });
  }
  submitDataEdit() {

    let obj = {
      index : this.param.index,
      title : this.param.title
    }
    this.dataTemp = Object.assign(this.dataTemp,obj);
    this.router.navigate(["contact"], { queryParams: this.dataTemp });
  }
  back() {
    this.router.navigate(["contact"]);
  }
}
