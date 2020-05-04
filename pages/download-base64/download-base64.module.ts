import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DownloadBase64Page } from './download-base64';


@NgModule({
  declarations: [
    DownloadBase64Page,
  ],
  imports: [
    IonicPageModule.forChild(DownloadBase64Page),

  ],
})
export class DownloadBase64PageModule {}
