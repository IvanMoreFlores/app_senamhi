import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ModalProfilePage } from './modal-profile.page';
var routes = [
    {
        path: '',
        component: ModalProfilePage
    }
];
var ModalProfilePageModule = /** @class */ (function () {
    function ModalProfilePageModule() {
    }
    ModalProfilePageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [ModalProfilePage]
        })
    ], ModalProfilePageModule);
    return ModalProfilePageModule;
}());
export { ModalProfilePageModule };
//# sourceMappingURL=modal-profile.module.js.map