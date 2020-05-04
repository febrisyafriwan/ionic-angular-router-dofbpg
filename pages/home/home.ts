import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicApp } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) { }

  public ngOnInit() {
    this.formGroup = this.formBuilder.group({
      href: '',
    });

    this.formGroup.controls.href.valueChanges
      .subscribe((value) => this.router.navigate([value]));
  }
}
