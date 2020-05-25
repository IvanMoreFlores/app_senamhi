import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ResetPasswordPage } from './reset-password.page';
var routes = [
    {
        path: '',
        component: ResetPasswordPage
    }
];
var ResetPasswordPageModule = /** @class */ (function () {
    function ResetPasswordPageModule() {
    }
    ResetPasswordPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [ResetPasswordPage]
        })
    ], ResetPasswordPageModule);
    return ResetPasswordPageModule;
}());
export { ResetPasswordPageModule };
//# sourceMappingURL=reset-password.module.js.map