import { NgModule, ErrorHandler } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { BrowserModule } from "@angular/platform-browser";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { MyApp } from "./app.component";
import { MutDatatableComponent } from "../pages/contact/datatable/mut-datatable";
import { AboutPage } from "../pages/about/about";
import { ContactPage } from "../pages/contact/contact";
import { ContactEditPage } from "../pages/contact/contact-edit/contact-edit";
import { HomePage } from "../pages/home/home";
import { TabsPage } from "../pages/tabs/tabs";
import { DownloadBase64Page } from "../pages/download-base64/download-base64";
import { DownloadBase64PageModule } from "../pages/download-base64/download-base64.module";
import { MutDatatableModule } from "../pages/contact/datatable/mut-datatable.module";
import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";
import { DataProvider } from "../providers/data";
const routes: Route[] = [
  {
    path: "",
    component: TabsPage,
    children: [
      {
        path: "home",
        component: HomePage
      },
      {
        path: "download-base64",
        component: DownloadBase64Page
      },
      {
        path: "contact",
        component: ContactPage
      },
      {
        path: "about",
        component: AboutPage
      },
      {
        path: "contact-edit",
        component: ContactEditPage
      },
      {
        path: "",
        pathMatch: "full",
        redirectTo: "home"
      }
    ]
  }
];

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    // DownloadBase64Page,
    MutDatatableComponent,
    ContactEditPage
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { useHash: true }),
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    HttpModule,
    FormsModule,
    DownloadBase64PageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    DataProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
