import { Component } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Network } from '@ionic-native/network/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { ConnectionStatus, NetworkService } from './services/network/network.service';
import { SqliteService } from './services/sqlite/sqlite.service';
import { UtilsService } from './services/utils.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public androidPermissions: AndroidPermissions,
    public network: Network,
    private toastController: ToastController,
    public utilsService: UtilsService,
    public sqlite: SqliteService,
    private networkService: NetworkService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#4c62ab');
      this.statusBar.styleLightContent();
      this.hideSplashScreen();
    });
  }

  hideSplashScreen() {
    if (this.splashScreen) {
      setTimeout(() => {
        this.splashScreen.hide();
        // this.openDB();
        this.permisoSendSms();
        this.permisoReadSms();
        this.permisoWritedSms();
        this.permisoCamera();
        this.permisoLocation();
        this.permisoPhone();
        // this.permisoNetwork();
        // this.networkSubscriber();
        this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
          console.log(status);
        });
      },         3000);
    }
  }

  openDB() {
    this.sqlite.createBD();
  }

  permisoSendSms() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.SEND_SMS)
      .then(success => console.log('Permiso permisoSendSms'),
        // tslint:disable-next-line: max-line-length
            err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS),
      );
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.SEND_SMS]);
  }

  permisoReadSms() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS)
      .then(success => console.log('Permiso permisoReadSms'),
        // tslint:disable-next-line: max-line-length
            err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_SMS),
      );
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_SMS]);
  }

  permisoWritedSms() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_SMS)
      .then(success => console.log('Permiso permisoWritedSms'),
        // tslint:disable-next-line: max-line-length
            err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_SMS),
      );
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.WRITE_SMS]);
  }

  permisoCamera() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA)
      .then(success => console.log('Permiso permisoCamera'),
        // tslint:disable-next-line: max-line-length
            err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA),
      );
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA]);
  }

  permisoLocation() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.LOCATION)
      .then(success => console.log('Permiso permisoLocation'),
        // tslint:disable-next-line: max-line-length
            err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.LOCATION),
      );
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.LOCATION]);
  }

  permisoPhone() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CALL_PHONE)
      .then(success => console.log('Permiso permisoPhone'),
        // tslint:disable-next-line: max-line-length
            err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CALL_PHONE),
      );
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CALL_PHONE]);
  }
}
