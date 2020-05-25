import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';
var routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', loadChildren: './page/login/login.module#LoginPageModule' },
    { path: 'home', loadChildren: './page/home/home.module#HomePageModule' },
    { path: 'modal-profile', loadChildren: './page/modal-profile/modal-profile.module#ModalProfilePageModule' },
    { path: 'modal-info', loadChildren: './page/modal-info/modal-info.module#ModalInfoPageModule' },
    { path: 'meteorologia', loadChildren: './page/meteorologia/meteorologia.module#MeteorologiaPageModule' },
    { path: 'hidrologia', loadChildren: './page/hidrologia/hidrologia.module#HidrologiaPageModule' },
    { path: 'medicion', loadChildren: './page/medicion/medicion.module#MedicionPageModule' },
    { path: 'modal-birthday', loadChildren: './page/modal-birthday/modal-birthday.module#ModalBirthdayPageModule' },
    { path: 'modal-reset', loadChildren: './page/modal-reset/modal-reset.module#ModalResetPageModule' },
    { path: 'reset-password', loadChildren: './page/reset-password/reset-password.module#ResetPasswordPageModule' },
    { path: 'modal-recover', loadChildren: './page/modal-recover/modal-recover.module#ModalRecoverPageModule' },
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [
                RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
            ],
            exports: [RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map