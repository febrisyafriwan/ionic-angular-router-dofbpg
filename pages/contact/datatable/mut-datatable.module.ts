import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MutDatatableComponent } from './mut-datatable';

 
@NgModule({
  declarations: [
    MutDatatableComponent,

  ],
  imports: [
    IonicPageModule.forChild(MutDatatableComponent),
   ],
  exports : [
    MutDatatableComponent,

   ]
})
export class MutDatatableModule {}
