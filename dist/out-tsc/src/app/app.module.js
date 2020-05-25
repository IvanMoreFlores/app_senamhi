import * as tslib_1 from "tslib";
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
// Plugin
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = tslib_1.__decorate([
        NgModule({
            declarations: [
                AppComponent,
            ],
            entryComponents: [],
            imports: [
                BrowserModule,
                IonicModule.forRoot(),
                AppRoutingModule,
                ModalBirthdayPageModule,
                ModalInfoPageModule,
                ModalProfilePageModule,
                ModalRecoverPageModule,
                ModalResetPageModule
            ],
            providers: [
                StatusBar,
                SplashScreen,
                AndroidPermissions,
                SMS,
                Network,
                Diagnostic,
                { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
            ],
            bootstrap: [AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map