import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Network } from '@ionic-native/network/ngx';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { UtilsService } from './services/utils.service';
export var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus[ConnectionStatus["Online"] = 0] = "Online";
    ConnectionStatus[ConnectionStatus["Offline"] = 1] = "Offline";
})(ConnectionStatus || (ConnectionStatus = {}));
var AppComponent = /** @class */ (function () {
    function AppComponent(platform, splashScreen, statusBar, androidPermissions, network, toastController, utilsService) {
        this.platform = platform;
        this.splashScreen = splashScreen;
        this.statusBar = statusBar;
        this.androidPermissions = androidPermissions;
        this.network = network;
        this.toastController = toastController;
        this.utilsService = utilsService;
        this.status = new BehaviorSubject(ConnectionStatus.Offline);
        this.utilsService.gpsOn();
        this.utilsService.datosOn();
        this.initializeApp();
    }
    AppComponent.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.statusBar.backgroundColorByHexString('#4c62ab');
            _this.statusBar.styleLightContent();
            _this.hideSplashScreen();
        });
    };
    AppComponent.prototype.hideSplashScreen = function () {
        var _this = this;
        if (this.splashScreen) {
            setTimeout(function () {
                _this.splashScreen.hide();
                _this.permisoSendSms();
                _this.permisoReadSms();
                _this.permisoWritedSms();
                // this.permisoNetwork();
                // this.networkSubscriber();
            }, 3000);
        }
    };
    // networkSubscriber(): void {
    //   this.utilsService
    //     .getNetworkStatus()
    //     .pipe(debounceTime(300))
    //     .subscribe((connected: boolean) => {
    //       this.isConnected = connected;
    //       console.log('[Home] isConnected', this.isConnected);
    //       // this.handleNotConnected(connected);
    //     });
    // }
    // permisoNetwork() {
    //   this.network.onDisconnect().subscribe(() => {
    //     if (this.status.getValue() === ConnectionStatus.Online) {
    //       console.log('fuera de línea');
    //       this.updateNetworkStatus(ConnectionStatus.Offline);
    //     }
    //   });
    //   this.network.onConnect().subscribe(() => {
    //     if (this.status.getValue() === ConnectionStatus.Offline) {
    //       console.log('en línea');
    //       this.updateNetworkStatus(ConnectionStatus.Online);
    //     }
    //   });
    // }
    // private async updateNetworkStatus(status: ConnectionStatus) {
    //   this.status.next(status);
    //   const connection = status === ConnectionStatus.Offline ? 'Offline' : 'Online';
    //   const toast = this.toastController.create({
    //     message: `Ahora estas ${connection}`,
    //     duration: 1500,
    //     position: 'bottom',
    //     // mode: 'ios',
    //     translucent: true
    //   });
    //   // tslint:disable-next-line: no-shadowed-variable
    //   toast.then(toast => toast.present());
    // }
    AppComponent.prototype.permisoSendSms = function () {
        var _this = this;
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.SEND_SMS)
            .then(function (success) { return console.log('Permiso concevido'); }, function (err) { return _this.androidPermissions.requestPermission(_this.androidPermissions.PERMISSION.SEND_SMS); });
        this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.SEND_SMS]);
    };
    AppComponent.prototype.permisoReadSms = function () {
        var _this = this;
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS)
            .then(function (success) { return console.log('Permiso concevido'); }, function (err) { return _this.androidPermissions.requestPermission(_this.androidPermissions.PERMISSION.READ_SMS); });
        this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_SMS]);
    };
    AppComponent.prototype.permisoWritedSms = function () {
        var _this = this;
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_SMS)
            .then(function (success) { return console.log('Permiso concevido'); }, function (err) { return _this.androidPermissions.requestPermission(_this.androidPermissions.PERMISSION.WRITE_SMS); });
        this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.WRITE_SMS]);
    };
    AppComponent = tslib_1.__decorate([
        Component({
            selector: 'app-root',
            templateUrl: 'app.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [Platform,
            SplashScreen,
            StatusBar,
            AndroidPermissions,
            Network,
            ToastController,
            UtilsService])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map