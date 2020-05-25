import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Modal
import { ModalBirthdayPageModule } from './page/modal-birthday/modal-birthday.module';
import { ModalInfoPageModule } from './page/modal-info/modal-info.module';
import { ModalProfilePageModule } from './page/modal-profile/modal-profile.module';
import { ModalRecoverPageModule } from './page/modal-recover/modal-recover.module';
import { ModalResetPageModule } from './page/modal-reset/modal-reset.module';
import { ModalResumenPageModule } from './page/modal-resumen/modal-resumen.module';

// Plugin
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { Camera } from '@ionic-native/camera/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
// import { HideHeaderDirective } from './directives/hide-header.directive';

@NgModule({
  declarations: [
    AppComponent,
    // HideHeaderDirective,
  ],
  entryComponents: [
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ModalBirthdayPageModule,
    ModalInfoPageModule,
    ModalProfilePageModule,
    ModalRecoverPageModule,
    HttpClientModule,
    HttpModule,
    ModalResetPageModule,
    ModalResumenPageModule,
    IonicStorageModule.forRoot()],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    AndroidPermissions,
    SMS,
    Network,
    Diagnostic,
    ImagePicker,
    DatePicker,
    WebView,
    CallNumber,
    Keyboard,
    Geolocation,
    Camera,
    FileTransfer,
    File,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
